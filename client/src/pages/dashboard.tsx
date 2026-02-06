import { PageHeader } from '@/components/layout/page-header'
import { NudgeList } from '@/components/reminders/nudge-list'
import { Timeline } from '@/components/interactions/timeline'
import { useInteractions } from '@/api/queries'

export function DashboardPage() {
  const { data: interactions, isLoading } = useInteractions({ limit: 15 })

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-sm font-semibold text-text">Reach out to</h2>
          <NudgeList />
        </section>
        <section>
          <h2 className="mb-4 text-sm font-semibold text-text">Recent activity</h2>
          <Timeline
            interactions={interactions || []}
            loading={isLoading}
            showContact
          />
        </section>
      </div>
    </div>
  )
}
