import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { contacts, interactions } from '../db/schema.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  nickname: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  category: z.string().default('personal'),
  sphere: z.string().default('Like Them'),
  frequencyOverrideDays: z.number().int().positive().optional(),
  notes: z.string().optional(),
  interests: z.string().optional(),
  familyDetails: z.string().optional(),
  howWeMet: z.string().optional(),
  whatMatters: z.string().optional(),
  avatarUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
})

const updateContactSchema = createContactSchema.partial()

// ---------------------------------------------------------------------------
// Sorting helper
// ---------------------------------------------------------------------------

function sortColumn(sort: string) {
  switch (sort) {
    case 'lastName':
      return contacts.lastName
    case 'company':
      return contacts.company
    case 'sphere':
      return contacts.sphere
    case 'createdAt':
      return contacts.createdAt
    case 'updatedAt':
      return contacts.updatedAt
    default:
      return contacts.firstName
  }
}

// ---------------------------------------------------------------------------
// GET / - list contacts
// ---------------------------------------------------------------------------

app.get('/', async (c) => {
  const search = c.req.query('search')
  const sphere = c.req.query('sphere')
  const category = c.req.query('category')
  const archived = c.req.query('archived') === 'true' ? 1 : 0
  const sort = c.req.query('sort') || 'firstName'
  const limit = Math.min(Number(c.req.query('limit')) || 50, 200)
  const offset = Number(c.req.query('offset')) || 0

  const conditions = [eq(contacts.isArchived, archived)]

  if (sphere) {
    conditions.push(eq(contacts.sphere, sphere))
  }
  if (category) {
    conditions.push(eq(contacts.category, category))
  }
  if (search) {
    const term = `%${search}%`
    conditions.push(
      or(
        like(contacts.firstName, term),
        like(contacts.lastName, term),
        like(contacts.company, term),
        like(contacts.email, term),
      )!,
    )
  }

  const rows = await db
    .select()
    .from(contacts)
    .where(and(...conditions))
    .orderBy(asc(sortColumn(sort)))
    .limit(limit)
    .offset(offset)

  return c.json(rows)
})

// ---------------------------------------------------------------------------
// GET /:id - single contact with recent interactions
// ---------------------------------------------------------------------------

app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1)

  if (!contact) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  const recentInteractions = await db
    .select()
    .from(interactions)
    .where(eq(interactions.contactId, id))
    .orderBy(desc(interactions.occurredAt))
    .limit(10)

  return c.json({ ...contact, recentInteractions })
})

// ---------------------------------------------------------------------------
// POST / - create contact
// ---------------------------------------------------------------------------

app.post('/', zValidator('json', createContactSchema), async (c) => {
  const data = c.req.valid('json')

  const [created] = await db.insert(contacts).values(data).returning()

  return c.json(created, 201)
})

// ---------------------------------------------------------------------------
// PUT /:id - update contact
// ---------------------------------------------------------------------------

app.put('/:id', zValidator('json', updateContactSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const data = c.req.valid('json')

  const [updated] = await db
    .update(contacts)
    .set({ ...data, updatedAt: sql`(datetime('now'))` })
    .where(eq(contacts.id, id))
    .returning()

  if (!updated) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json(updated)
})

// ---------------------------------------------------------------------------
// DELETE /:id - soft delete
// ---------------------------------------------------------------------------

app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const [archived] = await db
    .update(contacts)
    .set({ isArchived: 1, updatedAt: sql`(datetime('now'))` })
    .where(eq(contacts.id, id))
    .returning()

  if (!archived) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json({ success: true })
})

// ---------------------------------------------------------------------------
// GET /:id/interactions - all interactions for a contact
// ---------------------------------------------------------------------------

app.get('/:id/interactions', async (c) => {
  const contactId = Number(c.req.param('id'))
  const limit = Math.min(Number(c.req.query('limit')) || 50, 200)
  const offset = Number(c.req.query('offset')) || 0

  const rows = await db
    .select()
    .from(interactions)
    .where(eq(interactions.contactId, contactId))
    .orderBy(desc(interactions.occurredAt))
    .limit(limit)
    .offset(offset)

  return c.json(rows)
})

export default app
