import type { Sphere, Category, InteractionType, Direction } from './constants.js'

export interface Contact {
  id: number
  firstName: string
  lastName: string | null
  nickname: string | null
  email: string | null
  phone: string | null
  company: string | null
  jobTitle: string | null
  location: string | null
  category: Category
  sphere: Sphere
  frequencyOverrideDays: number | null
  notes: string | null
  interests: string | null
  familyDetails: string | null
  howWeMet: string | null
  whatMatters: string | null
  avatarUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  websiteUrl: string | null
  isArchived: number
  snoozedUntil: string | null
  createdAt: string
  updatedAt: string
}

export interface Interaction {
  id: number
  contactId: number
  type: InteractionType
  direction: Direction
  summary: string | null
  notes: string | null
  occurredAt: string
  createdAt: string
}

export interface Tag {
  id: number
  name: string
  color: string | null
}

export interface ContactTag {
  contactId: number
  tagId: number
}

export interface SphereSettings {
  id: number
  sphere: Sphere
  defaultFrequencyDays: number
}

export interface ReminderContact extends Contact {
  lastInteractionAt: string | null
  daysSinceContact: number
  effectiveFrequency: number
  urgencyScore: number
}
