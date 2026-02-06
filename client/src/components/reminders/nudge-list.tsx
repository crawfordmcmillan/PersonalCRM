import { useReminders } from '@/api/queries'
import { NudgeCard } from './nudge-card'
import { EmptyState } from '@/components/shared/empty-state'

export function NudgeList() {
  const { data: reminders, isLoading } = useReminders()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg border border-border bg-gray-50"
          />
        ))}
      </div>
    )
  }

  if (!reminders || reminders.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        description="No contacts need your attention right now."
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        {reminders.length} contact{reminders.length === 1 ? '' : 's'} to reach out to
      </p>
      {reminders.map((reminder: any) => (
        <NudgeCard key={reminder.id} reminder={reminder} />
      ))}
    </div>
  )
}
