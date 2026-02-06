import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useContact, useContactInteractions, useUpdateContact, useArchiveContact } from '@/api/queries'
import { ContactAvatar } from '@/components/contacts/contact-avatar'
import { Badge, sphereVariant } from '@/components/shared/badge'
import { Button } from '@/components/shared/button'
import { Modal } from '@/components/shared/modal'
import { Timeline } from '@/components/interactions/timeline'
import { InteractionForm } from '@/components/interactions/interaction-form'
import { formatRelative } from '@/lib/date'

function DetailSection({
  label,
  value,
  contactId,
  field,
}: {
  label: string
  value: string | null
  contactId: number
  field: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')
  const updateContact = useUpdateContact()

  async function save() {
    try {
      await updateContact.mutateAsync({
        id: contactId,
        data: { [field]: draft || null },
      })
      setEditing(false)
      toast.success('Updated')
    } catch {
      toast.error('Failed to save')
    }
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="block w-full rounded-lg border border-border/80 bg-white px-3.5 py-2.5 text-sm text-text shadow-sm shadow-black/[0.02] focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          rows={3}
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={updateContact.isPending}>
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDraft(value || '')
              setEditing(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </label>
        <button
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-surface"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
      <p className="mt-1 text-sm text-text whitespace-pre-wrap">
        {value || (
          <span className="text-muted italic">Not set</span>
        )}
      </p>
    </div>
  )
}

function InfoRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline truncate ml-4"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-text truncate ml-4">{value}</span>
      )}
    </div>
  )
}

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const contactId = Number(id)
  const navigate = useNavigate()
  const { data: contact, isLoading } = useContact(contactId)
  const { data: interactions, isLoading: loadingInteractions } =
    useContactInteractions(contactId)
  const archiveContact = useArchiveContact()
  const [interactionModalOpen, setInteractionModalOpen] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  if (isLoading) {
    return (
      <div className="animate-pulse p-8">
        <div className="h-6 w-48 rounded bg-gray-200 mb-8" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted">Contact not found.</p>
        <Link to="/contacts" className="text-sm text-primary hover:underline">
          Back to contacts
        </Link>
      </div>
    )
  }

  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(' ')
  const subtitle = [contact.jobTitle, contact.company]
    .filter(Boolean)
    .join(' at ')

  async function handleArchive() {
    try {
      await archiveContact.mutateAsync(contactId)
      toast.success('Contact archived')
      navigate('/contacts')
    } catch {
      toast.error('Failed to archive contact')
    }
  }

  return (
    <div>
      <div className="border-b border-border/60 px-8 py-3">
        <Link
          to="/contacts"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to contacts
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <ContactAvatar
                firstName={contact.firstName}
                lastName={contact.lastName}
                size="lg"
              />
              <div>
                <h1 className="text-lg font-semibold text-text">{fullName}</h1>
                {subtitle && (
                  <p className="text-sm text-muted">{subtitle}</p>
                )}
                {contact.location && (
                  <p className="text-xs text-muted mt-0.5">{contact.location}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/contacts/${contactId}/edit`}>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmArchive(true)}
              >
                Archive
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <DetailSection
              label="Notes"
              value={contact.notes}
              contactId={contactId}
              field="notes"
            />
            <DetailSection
              label="Interests"
              value={contact.interests}
              contactId={contactId}
              field="interests"
            />
            <DetailSection
              label="Family"
              value={contact.familyDetails}
              contactId={contactId}
              field="familyDetails"
            />
            <DetailSection
              label="How we met"
              value={contact.howWeMet}
              contactId={contactId}
              field="howWeMet"
            />
            <DetailSection
              label="What matters"
              value={contact.whatMatters}
              contactId={contactId}
              field="whatMatters"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/60 p-5 space-y-1.5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={sphereVariant(contact.sphere)}>
                {contact.sphere}
              </Badge>
              <Badge>{contact.category}</Badge>
            </div>
            <InfoRow label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
            <InfoRow label="Phone" value={contact.phone} href={contact.phone ? `tel:${contact.phone}` : undefined} />
            <InfoRow label="LinkedIn" value={contact.linkedinUrl ? 'Profile' : null} href={contact.linkedinUrl} />
            <InfoRow label="Twitter" value={contact.twitterUrl ? 'Profile' : null} href={contact.twitterUrl} />
            <InfoRow label="Website" value={contact.websiteUrl} href={contact.websiteUrl} />
            {contact.frequencyOverrideDays && (
              <InfoRow label="Custom frequency" value={`${contact.frequencyOverrideDays} days`} />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">Interactions</h3>
              <Button
                size="sm"
                onClick={() => setInteractionModalOpen(true)}
              >
                Log interaction
              </Button>
            </div>

            {contact.recentInteractions && contact.recentInteractions.length > 0 && (
              <p className="mb-3 text-xs text-muted">
                Last contact {formatRelative(contact.recentInteractions[0].occurredAt)}
              </p>
            )}

            <Timeline
              interactions={interactions || contact.recentInteractions || []}
              loading={loadingInteractions}
            />
          </div>
        </div>
      </div>

      <Modal
        open={interactionModalOpen}
        onClose={() => setInteractionModalOpen(false)}
        title="Log interaction"
      >
        <InteractionForm
          contactId={contactId}
          onSuccess={() => setInteractionModalOpen(false)}
          onCancel={() => setInteractionModalOpen(false)}
        />
      </Modal>

      <Modal
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        title="Archive contact"
      >
        <p className="text-sm text-muted mb-4">
          Are you sure you want to archive {fullName}? They will no longer appear in your
          contacts or reminders.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmArchive(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleArchive}
            disabled={archiveContact.isPending}
          >
            {archiveContact.isPending ? 'Archiving...' : 'Archive'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
