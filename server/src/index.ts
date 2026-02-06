import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { errorHandler } from './middleware/error.js'
import contacts from './routes/contacts.js'
import interactions from './routes/interactions.js'
import reminders from './routes/reminders.js'
import search from './routes/search.js'
import tags from './routes/tags.js'
import settings from './routes/settings.js'

const app = new Hono()

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use('*', cors())
app.use('*', logger())
app.use('*', errorHandler)

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const api = new Hono()

api.route('/contacts', contacts)
api.route('/interactions', interactions)
api.route('/reminders', reminders)
api.route('/search', search)
api.route('/tags', tags)
api.route('/settings', settings)

app.route('/api', api)

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', (c) => c.json({ status: 'ok' }))

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const port = 3001

console.log(`Server running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })

export type AppType = typeof app
