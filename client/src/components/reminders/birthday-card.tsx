import { useNavigate } from 'react-router-dom'
import { ContactAvatar } from '@/components/contacts/contact-avatar'
import { formatDate } from '@/lib/date'

interface BirthdayCardProps {
  contact: {
    id: number
    firstName: string
    lastName: string | null
    company: string | null
    avatarUrl: string | null
    birthday: string
    daysUntil: number
  }
}

function daysLabel(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

export function BirthdayCard({ contact }: BirthdayCardProps) {
  const navigate = useNavigate()

  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(' ')

  const isToday = contact.daysUntil === 0
  const isSoon = contact.daysUntil <= 3

  return (
    <button
      onClick={() => navigate(`/contacts/${contact.id}`)}
      className="w-full text-left rounded-xl border border-border/60 p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-indigo-200/60 group"
    >
      <div className="flex items-center gap-3">
        <ContactAvatar
          firstName={contact.firstName}
          lastName={contact.lastName}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text truncate group-hover:text-indigo-600 transition-colors duration-200">
            {fullName}
          </p>
          {contact.company && (
            <p className="text-xs text-muted truncate">{contact.company}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p
            className={
              isToday
                ? 'text-xs font-semibold text-indigo-600'
                : isSoon
                  ? 'text-xs font-medium text-indigo-500'
                  : 'text-xs font-medium text-muted'
            }
          >
            {daysLabel(contact.daysUntil)}
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            {formatDate(contact.birthday)}
          </p>
        </div>
      </div>
    </button>
  )
}
