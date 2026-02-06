import { formatRelative } from '@/lib/date'

interface InteractionItemProps {
  interaction: {
    id: number
    type: string
    summary: string | null
    notes: string | null
    occurredAt: string
    direction: string
    contactFirstName?: string
    contactLastName?: string | null
  }
  showContact?: boolean
}

const typeIcons: Record<string, { icon: string; label: string }> = {
  call: { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Call' },
  email: { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email' },
  meeting: { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', label: 'Meeting' },
  coffee: { icon: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zm4-4h8', label: 'Coffee' },
  text: { icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Text' },
  social: { icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', label: 'Social' },
  other: { icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z', label: 'Other' },
}

export function InteractionItem({ interaction, showContact = false }: InteractionItemProps) {
  const typeInfo = typeIcons[interaction.type] || typeIcons.other
  const contactName = showContact
    ? [interaction.contactFirstName, interaction.contactLastName].filter(Boolean).join(' ')
    : null

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted"
        >
          <path d={typeInfo.icon} />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wide">
            {typeInfo.label}
          </span>
          <span className="text-xs text-muted">
            {interaction.direction === 'inbound' ? 'from' : 'to'}
          </span>
          {contactName && (
            <span className="text-sm font-medium text-text">{contactName}</span>
          )}
          <span className="ml-auto shrink-0 text-xs text-muted">
            {formatRelative(interaction.occurredAt)}
          </span>
        </div>
        {interaction.summary && (
          <p className="mt-0.5 text-sm text-text">{interaction.summary}</p>
        )}
        {interaction.notes && (
          <p className="mt-0.5 text-xs text-muted line-clamp-2">
            {interaction.notes}
          </p>
        )}
      </div>
    </div>
  )
}
