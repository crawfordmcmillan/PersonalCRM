import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { useSearch } from '@/api/queries'
import { useDebounce } from '@/hooks/use-debounce'
import { useKeyboard } from '@/hooks/use-keyboard'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)
  const navigate = useNavigate()
  const { data: searchResults } = useSearch(debouncedQuery)

  const toggle = useCallback(() => setOpen((o) => !o), [])
  useKeyboard('k', toggle, { meta: true })

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  function go(path: string) {
    setOpen(false)
    navigate(path)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <Command
        className="relative w-full max-w-lg rounded-lg border border-border bg-white shadow-2xl"
        shouldFilter={false}
      >
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search contacts, navigate..."
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-text outline-none placeholder:text-muted/60"
        />
        <Command.List className="max-h-72 overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-muted">
            No results found.
          </Command.Empty>

          {searchResults && searchResults.length > 0 && (
            <Command.Group
              heading="Contacts"
              className="px-2 py-1.5 text-xs font-medium text-muted"
            >
              {searchResults.map((contact: any) => (
                <Command.Item
                  key={contact.id}
                  value={`${contact.firstName} ${contact.lastName || ''}`}
                  onSelect={() => go(`/contacts/${contact.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text data-[selected]:bg-surface"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-medium text-indigo-600">
                    {contact.firstName?.[0]}
                    {contact.lastName?.[0] || ''}
                  </span>
                  <span>
                    {contact.firstName} {contact.lastName || ''}
                  </span>
                  {contact.company && (
                    <span className="ml-auto text-xs text-muted">
                      {contact.company}
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group
            heading="Pages"
            className="px-2 py-1.5 text-xs font-medium text-muted"
          >
            <Command.Item
              onSelect={() => go('/')}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text data-[selected]:bg-surface"
            >
              Dashboard
            </Command.Item>
            <Command.Item
              onSelect={() => go('/contacts')}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text data-[selected]:bg-surface"
            >
              Contacts
            </Command.Item>
            <Command.Item
              onSelect={() => go('/settings')}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text data-[selected]:bg-surface"
            >
              Settings
            </Command.Item>
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="px-2 py-1.5 text-xs font-medium text-muted"
          >
            <Command.Item
              onSelect={() => go('/contacts/new')}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text data-[selected]:bg-surface"
            >
              Add contact
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
