import { useBirthdays } from '@/api/queries'
import { BirthdayCard } from './birthday-card'
import { EmptyState } from '@/components/shared/empty-state'

export function BirthdayList() {
  const { data: birthdays, isLoading } = useBirthdays()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-[68px] skeleton rounded-xl"
          />
        ))}
      </div>
    )
  }

  if (!birthdays || birthdays.length === 0) {
    return (
      <EmptyState
        title="No upcoming birthdays"
        description="No contacts have birthdays in the next 14 days."
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        {birthdays.length} birthday{birthdays.length === 1 ? '' : 's'} coming up
      </p>
      {birthdays.map((contact: any) => (
        <BirthdayCard key={contact.id} contact={contact} />
      ))}
    </div>
  )
}
