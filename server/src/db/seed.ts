import { db } from './index.js'
import { contacts, interactions } from './schema.js'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(
  __dirname,
  '../../../Relatable_Contacts_Graeme_Crawford - Contacts.csv'
)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function firstValue(raw: string | undefined): string | undefined {
  if (!raw || !raw.trim()) return undefined
  const first = raw.split(',')[0].trim()
  return first || undefined
}

function parseLinks(raw: string | undefined): {
  linkedinUrl?: string
  twitterUrl?: string
  websiteUrl?: string
} {
  if (!raw || !raw.trim()) return {}

  const urls = raw
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)

  let linkedinUrl: string | undefined
  let twitterUrl: string | undefined
  let websiteUrl: string | undefined

  for (const url of urls) {
    const lower = url.toLowerCase()
    if (!linkedinUrl && lower.includes('linkedin.com')) {
      linkedinUrl = url
    } else if (!twitterUrl && (lower.includes('twitter.com') || lower.includes('x.com'))) {
      twitterUrl = url
    } else if (!websiteUrl && !lower.includes('linkedin.com') && !lower.includes('twitter.com') && !lower.includes('x.com') && !lower.includes('instagram.com')) {
      websiteUrl = url
    }
  }

  return { linkedinUrl, twitterUrl, websiteUrl }
}

function parseSphere(raw: string | undefined): string {
  if (!raw || !raw.trim()) return 'Like Them'
  const first = raw.split(',')[0].trim()
  const valid = ['Love Them', 'Like Them', 'Know Them']
  return valid.includes(first) ? first : 'Like Them'
}

function cleanPhone(raw: string | undefined): string | undefined {
  const first = firstValue(raw)
  if (!first) return undefined
  // Strip anything that is not a digit or leading +
  return first.replace(/[^\d+]/g, '') || undefined
}

function parseBirthday(raw: string | undefined): string | undefined {
  if (!raw || !raw.trim()) return undefined
  // Format is already YYYY-MM-DD in the CSV
  const trimmed = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  return undefined
}

function isTemplateRow(row: Record<string, string>): boolean {
  const id = row['ID'] || ''
  return id.includes('{{') || id.includes('$json')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log('Reading CSV from:', csvPath)

  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: false,
    relax_column_count: true,
    trim: true,
  })

  // Filter out template rows and rows with no first name
  const validRecords = records.filter((row) => {
    if (isTemplateRow(row)) return false
    const firstName = (row['First Name'] || '').trim()
    if (!firstName) return false
    return true
  })

  console.log(`Found ${records.length} total rows, ${validRecords.length} valid contacts`)

  let contactCount = 0
  let interactionCount = 0

  for (const row of validRecords) {
    const firstName = row['First Name'].trim()
    const lastName = (row['Last Name'] || '').trim() || null
    const oneLiner = (row['One Liner'] || '').trim() || null
    const phone = cleanPhone(row['Phone Numbers']) || null
    const location = (row['Location'] || '').trim() || null
    const email = firstValue(row['Email Addresses']) || null
    const company = firstValue(row['Companies']) || null
    const links = parseLinks(row['Links'])
    const sphere = parseSphere(row['Spheres'])
    const birthday = parseBirthday(row['Birthday'])
    const snoozedUntil = (row['snooze_until'] || '').trim() || null
    const lastTouchDate = (row['last_touch_date'] || '').trim() || null

    const notes = null

    const [inserted] = await db
      .insert(contacts)
      .values({
        firstName,
        lastName,
        jobTitle: oneLiner,
        phone,
        location,
        email,
        company,
        linkedinUrl: links.linkedinUrl || null,
        twitterUrl: links.twitterUrl || null,
        websiteUrl: links.websiteUrl || null,
        sphere,
        category: 'professional',
        snoozedUntil,
        birthday,
        notes,
      })
      .returning()

    contactCount++

    // Create interaction record for last_touch_date
    if (lastTouchDate && /^\d{4}-\d{2}-\d{2}$/.test(lastTouchDate)) {
      await db.insert(interactions).values({
        contactId: inserted.id,
        type: 'other',
        direction: 'outbound',
        summary: 'Imported from Relatable',
        occurredAt: lastTouchDate,
      })
      interactionCount++
    }
  }

  console.log('')
  console.log('--- Seed complete ---')
  console.log(`Contacts created:     ${contactCount}`)
  console.log(`Interactions created: ${interactionCount}`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
