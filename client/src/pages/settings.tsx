import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { useSphereSettings, useUpdateSphereSetting } from '@/api/queries'

interface SphereRowProps {
  sphere: string
  defaultFrequencyDays: number
}

function SphereRow({ sphere, defaultFrequencyDays }: SphereRowProps) {
  const [value, setValue] = useState(String(defaultFrequencyDays))
  const updateSphere = useUpdateSphereSetting()

  useEffect(() => {
    setValue(String(defaultFrequencyDays))
  }, [defaultFrequencyDays])

  async function save() {
    const days = Number(value)
    if (!days || days < 1 || days === defaultFrequencyDays) {
      setValue(String(defaultFrequencyDays))
      return
    }

    try {
      await updateSphere.mutateAsync({ sphere, days })
      toast.success(`Updated ${sphere} to ${days} days`)
    } catch {
      toast.error('Failed to update')
      setValue(String(defaultFrequencyDays))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      save()
    }
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div>
        <p className="text-sm font-medium text-text">{sphere}</p>
        <p className="text-xs text-muted">
          Default contact frequency for this sphere
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          className="w-20 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-text text-right focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-sm text-muted">days</span>
      </div>
    </div>
  )
}

export function SettingsPage() {
  const { data: settings, isLoading } = useSphereSettings()

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="max-w-xl p-8">
        <section>
          <h2 className="text-sm font-semibold text-text mb-1">
            Contact frequency by sphere
          </h2>
          <p className="text-xs text-muted mb-4">
            Set how often you want to stay in touch with contacts in each sphere.
            Individual contacts can override these defaults.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded bg-gray-50"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border px-4">
              {settings?.map((s: any) => (
                <SphereRow
                  key={s.sphere}
                  sphere={s.sphere}
                  defaultFrequencyDays={s.defaultFrequencyDays}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
