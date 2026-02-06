import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input'
import { ContactCard } from '@/components/contacts/contact-card'
import { EmptyState } from '@/components/shared/empty-state'
import { useContacts } from '@/api/queries'
import { useDebounce } from '@/hooks/use-debounce'

const SPHERES = ['All', 'Love Them', 'Like Them', 'Know Them']
const CATEGORIES = ['All', 'personal', 'professional', 'family', 'acquaintance']

const categoryLabels: Record<string, string> = {
  All: 'All',
  personal: 'Personal',
  professional: 'Professional',
  family: 'Family',
  acquaintance: 'Acquaintance',
}

export function ContactsPage() {
  const [search, setSearch] = useState('')
  const [sphere, setSphere] = useState('All')
  const [category, setCategory] = useState('All')
  const debouncedSearch = useDebounce(search, 250)

  const { data: contacts, isLoading } = useContacts({
    search: debouncedSearch || undefined,
    sphere: sphere === 'All' ? undefined : sphere,
    category: category === 'All' ? undefined : category,
  })

  return (
    <div>
      <PageHeader title="Contacts">
        <Link to="/contacts/new">
          <Button>Add contact</Button>
        </Link>
      </PageHeader>

      <div className="p-8">
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            {SPHERES.map((s) => (
              <button
                key={s}
                onClick={() => setSphere(s)}
                className={clsx(
                  'rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200',
                  sphere === s
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'bg-surface text-muted hover:bg-surface-hover hover:text-text',
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={clsx(
                  'rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200',
                  category === c
                    ? 'bg-text text-white shadow-sm'
                    : 'bg-surface text-muted hover:bg-surface-hover hover:text-text',
                )}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 skeleton rounded-xl"
              />
            ))}
          </div>
        ) : !contacts || contacts.length === 0 ? (
          <EmptyState
            title="No contacts found"
            description={
              search
                ? 'Try adjusting your search or filters.'
                : 'Add your first contact to get started.'
            }
            action={
              !search ? (
                <Link to="/contacts/new">
                  <Button>Add contact</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="divide-y divide-border/40">
            {contacts.map((contact: any) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
