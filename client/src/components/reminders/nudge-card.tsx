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
        'rounded-xl border p-4 shadow-card transition-all duration-200 hover:shadow-card-hover',
        isOverdue ? 'border-red-200/80 bg-gradient-to-r from-red-50/40 to-transparent' : 'border-amber-200/80 bg-gradient-to-r from-amber-50/40 to-transparent',
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
            onClick={() => navigate(`/contacts/${reminder.id}?action=log`)}
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
              <div className="absolute right-0 top-full mt-1 z-10 w-36 rounded-xl border border-border/60 bg-white py-1.5 shadow-elevated">
                {snoozeOptions.map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => handleSnooze(opt.days)}
                    className="block w-full px-3 py-2 text-left text-[13px] text-text hover:bg-surface rounded-lg mx-auto transition-all duration-150"
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
