import { PageHeader } from '@/components/layout/page-header'
import { NudgeList } from '@/components/reminders/nudge-list'
import { Timeline } from '@/components/interactions/timeline'
import { useInteractions } from '@/api/queries'

export function DashboardPage() {
  const { data: interactions, isLoading } = useInteractions({ limit: 15 })

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 gap-10 p-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-5 text-[13px] font-semibold text-muted uppercase tracking-wider">Reach out to</h2>
          <NudgeList />
        </section>
        <section>
          <h2 className="mb-5 text-[13px] font-semibold text-muted uppercase tracking-wider">Recent activity</h2>
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
