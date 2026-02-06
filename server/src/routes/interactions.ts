import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, desc, and, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { interactions, contacts } from '../db/schema.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createInteractionSchema = z.object({
  contactId: z.number().int().positive(),
  type: z.string().min(1),
  direction: z.enum(['inbound', 'outbound']).default('outbound'),
  summary: z.string().optional(),
  notes: z.string().optional(),
  occurredAt: z.string().optional(),
})

const updateInteractionSchema = z.object({
  type: z.string().min(1).optional(),
  direction: z.enum(['inbound', 'outbound']).optional(),
  summary: z.string().optional(),
  notes: z.string().optional(),
  occurredAt: z.string().optional(),
})

// ---------------------------------------------------------------------------
// GET / - list recent interactions with contact name
// ---------------------------------------------------------------------------

app.get('/', async (c) => {
  const contactId = c.req.query('contactId')
  const type = c.req.query('type')
  const limit = Math.min(Number(c.req.query('limit')) || 50, 200)
  const offset = Number(c.req.query('offset')) || 0

  let query = db
    .select({
      id: interactions.id,
      contactId: interactions.contactId,
      type: interactions.type,
      direction: interactions.direction,
      summary: interactions.summary,
      notes: interactions.notes,
      occurredAt: interactions.occurredAt,
      createdAt: interactions.createdAt,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
    })
    .from(interactions)
    .innerJoin(contacts, eq(interactions.contactId, contacts.id))
    .orderBy(desc(interactions.occurredAt))
    .limit(limit)
    .offset(offset)
    .$dynamic()

  const conditions = []
  if (contactId) {
    conditions.push(eq(interactions.contactId, Number(contactId)))
  }
  if (type) {
    conditions.push(eq(interactions.type, type))
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const rows = await query

  return c.json(rows)
})

// ---------------------------------------------------------------------------
// POST / - create interaction
// ---------------------------------------------------------------------------

app.post('/', zValidator('json', createInteractionSchema), async (c) => {
  const data = c.req.valid('json')

  const [contact] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.id, data.contactId))
    .limit(1)

  if (!contact) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  const [created] = await db.insert(interactions).values(data).returning()

  // Touch the contact's updatedAt timestamp
  await db
    .update(contacts)
    .set({ updatedAt: sql`(datetime('now'))` })
    .where(eq(contacts.id, data.contactId))

  return c.json(created, 201)
})

// ---------------------------------------------------------------------------
// PUT /:id - update interaction
// ---------------------------------------------------------------------------

app.put('/:id', zValidator('json', updateInteractionSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const data = c.req.valid('json')

  const [updated] = await db
    .update(interactions)
    .set(data)
    .where(eq(interactions.id, id))
    .returning()

  if (!updated) {
    return c.json({ error: 'Interaction not found' }, 404)
  }

  return c.json(updated)
})

// ---------------------------------------------------------------------------
// DELETE /:id - delete interaction
// ---------------------------------------------------------------------------

app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const [deleted] = await db
    .delete(interactions)
    .where(eq(interactions.id, id))
    .returning()

  if (!deleted) {
    return c.json({ error: 'Interaction not found' }, 404)
  }

  return c.json({ success: true })
})

export default app
