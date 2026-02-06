import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { client } from '../db/index.js'
import { contacts } from '../db/schema.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// GET / - contacts due for reach-out, ranked by urgency
// ---------------------------------------------------------------------------

app.get('/', async (c) => {
  const result = await client.execute({
    sql: `
      SELECT
        c.id,
        c.first_name AS firstName,
        c.last_name AS lastName,
        c.nickname,
        c.email,
        c.phone,
        c.company,
        c.job_title AS jobTitle,
        c.sphere,
        c.category,
        c.avatar_url AS avatarUrl,
        c.frequency_override_days AS frequencyOverrideDays,
        c.snoozed_until AS snoozedUntil,
        COALESCE(c.frequency_override_days, ss.default_frequency_days) AS effectiveFrequency,
        MAX(i.occurred_at) AS lastInteractionAt,
        COALESCE(MAX(i.occurred_at), c.created_at) AS lastContactAt,
        CAST(
          julianday('now') - julianday(COALESCE(MAX(i.occurred_at), c.created_at))
        AS REAL) AS daysSinceContact,
        CAST(
          (julianday('now') - julianday(COALESCE(MAX(i.occurred_at), c.created_at))
           - COALESCE(c.frequency_override_days, ss.default_frequency_days))
          * 1.0
          / COALESCE(c.frequency_override_days, ss.default_frequency_days)
        AS REAL) AS urgencyScore
      FROM contacts c
      JOIN sphere_settings ss ON ss.sphere = c.sphere
      LEFT JOIN interactions i ON i.contact_id = c.id
      WHERE c.is_archived = 0
        AND (c.snoozed_until IS NULL OR c.snoozed_until < datetime('now'))
      GROUP BY c.id
      HAVING urgencyScore >= -0.1
      ORDER BY urgencyScore DESC
    `,
    args: [],
  })

  return c.json(result.rows)
})

// ---------------------------------------------------------------------------
// GET /birthdays - contacts with birthdays in the next 14 days
// ---------------------------------------------------------------------------

app.get('/birthdays', async (c) => {
  const result = await client.execute({
    sql: `
      SELECT
        c.id,
        c.first_name AS firstName,
        c.last_name AS lastName,
        c.company,
        c.avatar_url AS avatarUrl,
        c.birthday,
        CAST(
          CASE
            WHEN julianday(
              COALESCE(
                date(strftime('%Y', 'now') || substr(c.birthday, 5)),
                date(strftime('%Y', 'now') || '-03-01')
              )
            ) >= julianday('now', 'start of day')
            THEN julianday(
              COALESCE(
                date(strftime('%Y', 'now') || substr(c.birthday, 5)),
                date(strftime('%Y', 'now') || '-03-01')
              )
            ) - julianday('now', 'start of day')
            ELSE julianday(
              COALESCE(
                date((CAST(strftime('%Y', 'now') AS INTEGER) + 1) || substr(c.birthday, 5)),
                date((CAST(strftime('%Y', 'now') AS INTEGER) + 1) || '-03-01')
              )
            ) - julianday('now', 'start of day')
          END
        AS INTEGER) AS daysUntil
      FROM contacts c
      WHERE c.birthday IS NOT NULL
        AND c.is_archived = 0
      HAVING daysUntil <= 14
      ORDER BY daysUntil ASC
    `,
    args: [],
  })

  return c.json(result.rows)
})

// ---------------------------------------------------------------------------
// PUT /:contactId/snooze - snooze reminders for N days
// ---------------------------------------------------------------------------

const snoozeSchema = z.object({
  days: z.number().int().positive(),
})

app.put(
  '/:contactId/snooze',
  zValidator('json', snoozeSchema),
  async (c) => {
    const contactId = Number(c.req.param('contactId'))
    const { days } = c.req.valid('json')

    const modifier = `+${days} days`

    const [updated] = await db
      .update(contacts)
      .set({
        snoozedUntil: sql`datetime('now', ${modifier})`,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(contacts.id, contactId))
      .returning()

    if (!updated) {
      return c.json({ error: 'Contact not found' }, 404)
    }

    return c.json(updated)
  },
)

// ---------------------------------------------------------------------------
// PUT /:contactId/dismiss - clear snooze
// ---------------------------------------------------------------------------

app.put('/:contactId/dismiss', async (c) => {
  const contactId = Number(c.req.param('contactId'))

  const [updated] = await db
    .update(contacts)
    .set({
      snoozedUntil: null,
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(contacts.id, contactId))
    .returning()

  if (!updated) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json(updated)
})

export default app
