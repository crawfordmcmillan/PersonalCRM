import { PageHeader } from '@/components/layout/page-header'
import { Timeline } from '@/components/interactions/timeline'
import { useInteractions } from '@/api/queries'

export function ActivityPage() {
  const { data: interactions, isLoading } = useInteractions({ limit: 50 })

  return (
    <div>
      <PageHeader title="Activity" />
      <div className="max-w-2xl p-8">
        <Timeline
          interactions={interactions || []}
          loading={isLoading}
          showContact
        />
      </div>
    </div>
  )
}
