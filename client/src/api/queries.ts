import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import * as api from './client'

// ---------------------------------------------------------------------------
// Query key factory
// ---------------------------------------------------------------------------

const keys = {
  contacts: {
    all: ['contacts'] as const,
    list: (params?: api.ContactParams) => ['contacts', 'list', params] as const,
    detail: (id: number) => ['contacts', 'detail', id] as const,
  },
  interactions: {
    all: ['interactions'] as const,
    list: (params?: api.InteractionParams) => ['interactions', 'list', params] as const,
    byContact: (contactId: number) => ['interactions', 'contact', contactId] as const,
  },
  reminders: ['reminders'] as const,
  birthdays: ['birthdays'] as const,
  search: (q: string) => ['search', q] as const,
  tags: ['tags'] as const,
  sphereSettings: ['sphereSettings'] as const,
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export function useContacts(params?: api.ContactParams) {
  return useQuery({
    queryKey: keys.contacts.list(params),
    queryFn: () => api.fetchContacts(params),
  })
}

export function useContact(id: number) {
  return useQuery({
    queryKey: keys.contacts.detail(id),
    queryFn: () => api.fetchContact(id),
    enabled: id > 0,
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createContact(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.contacts.all })
    },
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      api.updateContact(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: keys.contacts.all })
      qc.invalidateQueries({ queryKey: keys.contacts.detail(id) })
    },
  })
}

export function useArchiveContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.archiveContact(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.contacts.all })
      qc.invalidateQueries({ queryKey: keys.reminders })
    },
  })
}

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------

export function useInteractions(params?: api.InteractionParams) {
  return useQuery({
    queryKey: keys.interactions.list(params),
    queryFn: () => api.fetchInteractions(params),
  })
}

export function useContactInteractions(contactId: number) {
  return useQuery({
    queryKey: keys.interactions.byContact(contactId),
    queryFn: () => api.fetchContactInteractions(contactId),
    enabled: contactId > 0,
  })
}

export function useCreateInteraction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createInteraction(data),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: keys.interactions.all })
      if (variables.contactId) {
        qc.invalidateQueries({
          queryKey: keys.interactions.byContact(variables.contactId as number),
        })
        qc.invalidateQueries({
          queryKey: keys.contacts.detail(variables.contactId as number),
        })
      }
      qc.invalidateQueries({ queryKey: keys.reminders })
    },
  })
}

export function useUpdateInteraction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      api.updateInteraction(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.interactions.all })
    },
  })
}

export function useDeleteInteraction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.deleteInteraction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.interactions.all })
    },
  })
}

// ---------------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------------

export function useReminders() {
  return useQuery({
    queryKey: keys.reminders,
    queryFn: api.fetchReminders,
  })
}

export function useBirthdays() {
  return useQuery({
    queryKey: keys.birthdays,
    queryFn: api.fetchBirthdays,
  })
}

export function useSnoozeReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ contactId, days }: { contactId: number; days: number }) =>
      api.snoozeReminder(contactId, days),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.reminders })
    },
  })
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export function useSearch(q: string) {
  return useQuery({
    queryKey: keys.search(q),
    queryFn: () => api.searchContacts(q),
    enabled: q.length >= 2,
  })
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export function useTags() {
  return useQuery({
    queryKey: keys.tags,
    queryFn: api.fetchTags,
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; color?: string }) => api.createTag(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.tags })
    },
  })
}

// ---------------------------------------------------------------------------
// Sphere Settings
// ---------------------------------------------------------------------------

export function useSphereSettings() {
  return useQuery({
    queryKey: keys.sphereSettings,
    queryFn: api.fetchSphereSettings,
  })
}

export function useUpdateSphereSetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sphere, days }: { sphere: string; days: number }) =>
      api.updateSphereSetting(sphere, days),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.sphereSettings })
      qc.invalidateQueries({ queryKey: keys.reminders })
    },
  })
}
