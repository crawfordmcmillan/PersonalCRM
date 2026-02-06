import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbDir = path.resolve(__dirname, '../../../data')
const dbPath = path.resolve(dbDir, 'crm.db')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const client = createClient({ url: `file:${dbPath}` })

const migrations = [
  `CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    nickname TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    location TEXT,
    category TEXT NOT NULL DEFAULT 'personal',
    sphere TEXT NOT NULL DEFAULT 'Like Them',
    frequency_override_days INTEGER,
    notes TEXT,
    interests TEXT,
    family_details TEXT,
    how_we_met TEXT,
    what_matters TEXT,
    avatar_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    snoozed_until TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    direction TEXT NOT NULL DEFAULT 'outbound',
    summary TEXT,
    notes TEXT,
    occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS contact_tags (
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, tag_id)
  )`,

  `CREATE TABLE IF NOT EXISTS sphere_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sphere TEXT NOT NULL UNIQUE,
    default_frequency_days INTEGER NOT NULL
  )`,

  // Full-text search
  `CREATE VIRTUAL TABLE IF NOT EXISTS contacts_fts USING fts5(
    first_name, last_name, company, notes, interests, job_title,
    content=contacts,
    content_rowid=id
  )`,

  // FTS triggers
  `CREATE TRIGGER IF NOT EXISTS contacts_ai AFTER INSERT ON contacts BEGIN
    INSERT INTO contacts_fts(rowid, first_name, last_name, company, notes, interests, job_title)
    VALUES (new.id, new.first_name, new.last_name, new.company, new.notes, new.interests, new.job_title);
  END`,

  `CREATE TRIGGER IF NOT EXISTS contacts_ad AFTER DELETE ON contacts BEGIN
    INSERT INTO contacts_fts(contacts_fts, rowid, first_name, last_name, company, notes, interests, job_title)
    VALUES ('delete', old.id, old.first_name, old.last_name, old.company, old.notes, old.interests, old.job_title);
  END`,

  `CREATE TRIGGER IF NOT EXISTS contacts_au AFTER UPDATE ON contacts BEGIN
    INSERT INTO contacts_fts(contacts_fts, rowid, first_name, last_name, company, notes, interests, job_title)
    VALUES ('delete', old.id, old.first_name, old.last_name, old.company, old.notes, old.interests, old.job_title);
    INSERT INTO contacts_fts(rowid, first_name, last_name, company, notes, interests, job_title)
    VALUES (new.id, new.first_name, new.last_name, new.company, new.notes, new.interests, new.job_title);
  END`,

  // Default sphere settings
  `INSERT OR IGNORE INTO sphere_settings (sphere, default_frequency_days) VALUES ('Love Them', 30)`,
  `INSERT OR IGNORE INTO sphere_settings (sphere, default_frequency_days) VALUES ('Like Them', 90)`,
  `INSERT OR IGNORE INTO sphere_settings (sphere, default_frequency_days) VALUES ('Know Them', 180)`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_contacts_sphere ON contacts(sphere)`,
  `CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts(category)`,
  `CREATE INDEX IF NOT EXISTS idx_contacts_archived ON contacts(is_archived)`,
  `CREATE INDEX IF NOT EXISTS idx_interactions_contact ON interactions(contact_id)`,
  `CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(occurred_at)`,
]

async function migrate() {
  console.log('Running migrations...')
  for (const sql of migrations) {
    await client.execute(sql)
  }
  console.log('Migrations complete. Database at:', dbPath)
}

migrate().catch(console.error)
