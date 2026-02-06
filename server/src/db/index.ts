import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../../../data/crm.db')

const client = createClient({
  url: `file:${dbPath}`,
})

export const db = drizzle(client, { schema })
export { client }
