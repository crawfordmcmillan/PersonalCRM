const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }

  return res.json()
}

function qs(params?: Record<string, string | number | undefined>): string {
  if (!params) return ''
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '',
  )
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export interface ContactParams {
  search?: string
  sphere?: string
  category?: string
  sort?: string
  limit?: number
  offset?: number
}

export function fetchContacts(params?: ContactParams) {
  return request<any[]>(`/contacts${qs(params as Record<string, string | number | undefined>)}`)
}

export function fetchContact(id: number) {
  return request<any>(`/contacts/${id}`)
}

export function createContact(data: Record<string, unknown>) {
  return request<any>('/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateContact(id: number, data: Record<string, unknown>) {
  return request<any>(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function archiveContact(id: number) {
  return request<{ success: boolean }>(`/contacts/${id}`, {
    method: 'DELETE',
  })
}

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------

export interface InteractionParams {
  contactId?: number
  type?: string
  limit?: number
  offset?: number
}

export function fetchInteractions(params?: InteractionParams) {
  return request<any[]>(`/interactions${qs(params as Record<string, string | number | undefined>)}`)
}

export function fetchContactInteractions(contactId: number, limit = 50) {
  return request<any[]>(`/contacts/${contactId}/interactions?limit=${limit}`)
}

export function createInteraction(data: Record<string, unknown>) {
  return request<any>('/interactions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateInteraction(id: number, data: Record<string, unknown>) {
  return request<any>(`/interactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteInteraction(id: number) {
  return request<{ success: boolean }>(`/interactions/${id}`, {
    method: 'DELETE',
  })
}

// ---------------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------------

export function fetchReminders() {
  return request<any[]>('/reminders')
}

export function snoozeReminder(contactId: number, days: number) {
  return request<any>(`/reminders/${contactId}/snooze`, {
    method: 'PUT',
    body: JSON.stringify({ days }),
  })
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export function searchContacts(q: string) {
  return request<any[]>(`/search?q=${encodeURIComponent(q)}`)
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export function fetchTags() {
  return request<any[]>('/tags')
}

export function createTag(data: { name: string; color?: string }) {
  return request<any>('/tags', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export function fetchSphereSettings() {
  return request<any[]>('/settings/spheres')
}

export function updateSphereSetting(sphere: string, defaultFrequencyDays: number) {
  return request<any>(`/settings/spheres/${encodeURIComponent(sphere)}`, {
    method: 'PUT',
    body: JSON.stringify({ defaultFrequencyDays }),
  })
}
