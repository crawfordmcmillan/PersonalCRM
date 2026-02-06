import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { sphereSettings } from '../db/schema.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateSphereSchema = z.object({
  defaultFrequencyDays: z.number().int().positive(),
})

// ---------------------------------------------------------------------------
// GET /spheres - get all sphere settings
// ---------------------------------------------------------------------------

app.get('/spheres', async (c) => {
  const rows = await db.select().from(sphereSettings)
  return c.json(rows)
})

// ---------------------------------------------------------------------------
// PUT /spheres/:sphere - update frequency for a sphere
// ---------------------------------------------------------------------------

app.put(
  '/spheres/:sphere',
  zValidator('json', updateSphereSchema),
  async (c) => {
    const sphere = c.req.param('sphere')
    const { defaultFrequencyDays } = c.req.valid('json')

    const [updated] = await db
      .update(sphereSettings)
      .set({ defaultFrequencyDays })
      .where(eq(sphereSettings.sphere, sphere))
      .returning()

    if (!updated) {
      return c.json({ error: 'Sphere not found' }, 404)
    }

    return c.json(updated)
  },
)

export default app
