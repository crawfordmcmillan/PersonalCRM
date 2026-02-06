import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  nickname: text('nickname'),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  jobTitle: text('job_title'),
  location: text('location'),
  category: text('category').notNull().default('personal'),
  sphere: text('sphere').notNull().default('Like Them'),
  frequencyOverrideDays: integer('frequency_override_days'),
  notes: text('notes'),
  interests: text('interests'),
  familyDetails: text('family_details'),
  howWeMet: text('how_we_met'),
  whatMatters: text('what_matters'),
  avatarUrl: text('avatar_url'),
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  websiteUrl: text('website_url'),
  isArchived: integer('is_archived').notNull().default(0),
  snoozedUntil: text('snoozed_until'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const interactions = sqliteTable('interactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  direction: text('direction').notNull().default('outbound'),
  summary: text('summary'),
  notes: text('notes'),
  occurredAt: text('occurred_at').notNull().default(sql`(datetime('now'))`),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  color: text('color'),
})

export const contactTags = sqliteTable('contact_tags', {
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
})

export const sphereSettings = sqliteTable('sphere_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sphere: text('sphere').notNull().unique(),
  defaultFrequencyDays: integer('default_frequency_days').notNull(),
})
