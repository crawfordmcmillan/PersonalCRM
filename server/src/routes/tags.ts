import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { db } from '../db/index.js'
import { tags, contactTags } from '../db/schema.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createTagSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
})

const addTagSchema = z.object({
  tagId: z.number().int().positive(),
})

// ---------------------------------------------------------------------------
// GET / - list all tags
// ---------------------------------------------------------------------------

app.get('/', async (c) => {
  const rows = await db.select().from(tags)
  return c.json(rows)
})

// ---------------------------------------------------------------------------
// POST / - create tag
// ---------------------------------------------------------------------------

app.post('/', zValidator('json', createTagSchema), async (c) => {
  const data = c.req.valid('json')

  const [created] = await db.insert(tags).values(data).returning()

  return c.json(created, 201)
})

// ---------------------------------------------------------------------------
// GET /contacts/:contactId/tags - get tags for a contact
// ---------------------------------------------------------------------------

app.get('/contacts/:contactId/tags', async (c) => {
  const contactId = Number(c.req.param('contactId'))

  const rows = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
    })
    .from(contactTags)
    .innerJoin(tags, eq(contactTags.tagId, tags.id))
    .where(eq(contactTags.contactId, contactId))

  return c.json(rows)
})

// ---------------------------------------------------------------------------
// POST /contacts/:contactId/tags - add tag to contact
// ---------------------------------------------------------------------------

app.post(
  '/contacts/:contactId/tags',
  zValidator('json', addTagSchema),
  async (c) => {
    const contactId = Number(c.req.param('contactId'))
    const { tagId } = c.req.valid('json')

    await db.insert(contactTags).values({ contactId, tagId })

    return c.json({ success: true }, 201)
  },
)

// ---------------------------------------------------------------------------
// DELETE /contacts/:contactId/tags/:tagId - remove tag from contact
// ---------------------------------------------------------------------------

app.delete('/contacts/:contactId/tags/:tagId', async (c) => {
  const contactId = Number(c.req.param('contactId'))
  const tagId = Number(c.req.param('tagId'))

  await db
    .delete(contactTags)
    .where(and(eq(contactTags.contactId, contactId), eq(contactTags.tagId, tagId)))

  return c.json({ success: true })
})

export default app
