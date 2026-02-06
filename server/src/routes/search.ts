import { Hono } from 'hono'
import { client } from '../db/index.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// GET /?q=term - full-text search via FTS5
// ---------------------------------------------------------------------------

app.get('/', async (c) => {
  const q = c.req.query('q')

  if (!q || q.trim().length === 0) {
    return c.json([])
  }

  // Sanitize the query for FTS5: wrap each token in double quotes to treat
  // special characters as literals, then join with spaces (implicit AND).
  const sanitized = q
    .trim()
    .split(/\s+/)
    .map((token) => `"${token.replace(/"/g, '""')}"`)
    .join(' ')

  const result = await client.execute({
    sql: `
      SELECT c.*
      FROM contacts_fts fts
      JOIN contacts c ON c.id = fts.rowid
      WHERE contacts_fts MATCH ?
        AND c.is_archived = 0
      ORDER BY rank
      LIMIT 20
    `,
    args: [sanitized],
  })

  return c.json(result.rows)
})

export default app
