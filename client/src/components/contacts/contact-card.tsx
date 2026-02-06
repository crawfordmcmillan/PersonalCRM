import { Link } from 'react-router-dom'
import { ContactAvatar } from './contact-avatar'
import { Badge, sphereVariant } from '@/components/shared/badge'
import { RelativeTime } from '@/components/shared/relative-time'

interface ContactCardProps {
  contact: {
    id: number
    firstName: string
    lastName: string | null
    company: string | null
    jobTitle: string | null
    sphere: string
    lastInteractionAt?: string | null
    daysSinceContact?: number
  }
}

export function ContactCard({ contact }: ContactCardProps) {
  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(' ')
  const subtitle = [contact.jobTitle, contact.company]
    .filter(Boolean)
    .join(' at ')

  return (
    <Link
      to={`/contacts/${contact.id}`}
      className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-surface hover:shadow-card"
    >
      <div className="flex items-center gap-3 min-w-0">
        <ContactAvatar
          firstName={contact.firstName}
          lastName={contact.lastName}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-text truncate">{fullName}</p>
          {subtitle && (
            <p className="text-xs text-muted truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <Badge variant={sphereVariant(contact.sphere)}>
          {contact.sphere}
        </Badge>
        {contact.lastInteractionAt && (
          <RelativeTime date={contact.lastInteractionAt} />
        )}
      </div>
    </Link>
  )
}
