import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import clsx from 'clsx'
import { ContactAvatar } from '@/components/contacts/contact-avatar'
import { Button } from '@/components/shared/button'
import { useSnoozeReminder } from '@/api/queries'

interface NudgeCardProps {
  reminder: {
    id: number
    firstName: string
    lastName: string | null
    company: string | null
    sphere: string
    daysSinceContact: number
    effectiveFrequency: number
    urgencyScore: number
    lastInteractionAt: string | null
  }
}

const snoozeOptions = [
  { days: 7, label: '7 days' },
  { days: 14, label: '14 days' },
  { days: 30, label: '30 days' },
]

export function NudgeCard({ reminder }: NudgeCardProps) {
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const navigate = useNavigate()
  const snooze = useSnoozeReminder()

  const days = Math.round(reminder.daysSinceContact)
  const overdueDays = days - reminder.effectiveFrequency
  const isOverdue = overdueDays > 0
  const label = isOverdue
    ? `${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue`
    : 'Due today'

  async function handleSnooze(snoozeDays: number) {
    try {
      await snooze.mutateAsync({ contactId: reminder.id, days: snoozeDays })
      toast.success(`Snoozed for ${snoozeDays} days`)
      setSnoozeOpen(false)
    } catch {
      toast.error('Failed to snooze')
    }
  }

  const fullName = [reminder.firstName, reminder.lastName]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={clsx(
        'rounded-lg border p-4',
        isOverdue ? 'border-red-200' : 'border-amber-200',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <ContactAvatar
            firstName={reminder.firstName}
            lastName={reminder.lastName}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text truncate">{fullName}</p>
            {reminder.company && (
              <p className="text-xs text-muted truncate">{reminder.company}</p>
            )}
            <p
              className={clsx(
                'mt-0.5 text-xs font-medium',
                isOverdue ? 'text-red-600' : 'text-amber-600',
              )}
            >
              {label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/contacts/${reminder.id}`)}
          >
            Log interaction
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSnoozeOpen(!snoozeOpen)}
            >
              Snooze
            </Button>
            {snoozeOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 w-32 rounded-md border border-border bg-white py-1 shadow-lg">
                {snoozeOptions.map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => handleSnooze(opt.days)}
                    className="block w-full px-3 py-1.5 text-left text-sm text-text hover:bg-surface transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
