import { formatDate } from '@/lib/date'
import { InteractionItem } from './interaction-item'
import { EmptyState } from '@/components/shared/empty-state'

interface TimelineProps {
  interactions: any[]
  loading: boolean
  showContact?: boolean
}

function groupByDate(interactions: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {}
  for (const interaction of interactions) {
    const date = formatDate(interaction.occurredAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(interaction)
  }
  return groups
}

export function Timeline({ interactions, loading, showContact = false }: TimelineProps) {
  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="h-7 w-7 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!interactions || interactions.length === 0) {
    return (
      <EmptyState
        title="No interactions yet"
        description="Log your first interaction to start tracking."
      />
    )
  }

  const groups = groupByDate(interactions)

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-medium text-muted uppercase tracking-wide">
            {date}
          </p>
          <div className="divide-y divide-border/40">
            {items.map((interaction: any) => (
              <InteractionItem
                key={interaction.id}
                interaction={interaction}
                showContact={showContact}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
