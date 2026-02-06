import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateInteraction } from '@/api/queries'
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input'
import { Textarea } from '@/components/shared/textarea'
import { toISODate } from '@/lib/date'

const INTERACTION_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'text', label: 'Text' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
]

interface InteractionFormProps {
  contactId: number
  onSuccess: () => void
  onCancel: () => void
}

export function InteractionForm({
  contactId,
  onSuccess,
  onCancel,
}: InteractionFormProps) {
  const [type, setType] = useState('call')
  const [direction, setDirection] = useState<'outbound' | 'inbound'>('outbound')
  const [occurredAt, setOccurredAt] = useState(toISODate(new Date()))
  const [summary, setSummary] = useState('')
  const [notes, setNotes] = useState('')

  const createInteraction = useCreateInteraction()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createInteraction.mutateAsync({
        contactId,
        type,
        direction,
        occurredAt: new Date(occurredAt).toISOString(),
        summary: summary || undefined,
        notes: notes || undefined,
      })
      toast.success('Interaction logged')
      onSuccess()
    } catch {
      toast.error('Failed to log interaction')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="block w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {INTERACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">Direction</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDirection('outbound')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              direction === 'outbound'
                ? 'border-primary bg-indigo-50 text-indigo-700'
                : 'border-border text-muted hover:bg-surface'
            }`}
          >
            Outbound
          </button>
          <button
            type="button"
            onClick={() => setDirection('inbound')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              direction === 'inbound'
                ? 'border-primary bg-indigo-50 text-indigo-700'
                : 'border-border text-muted hover:bg-surface'
            }`}
          >
            Inbound
          </button>
        </div>
      </div>

      <Input
        label="Date"
        type="date"
        value={occurredAt}
        onChange={(e) => setOccurredAt(e.target.value)}
      />

      <Input
        label="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Brief description of the interaction"
      />

      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Additional details..."
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={createInteraction.isPending}>
          {createInteraction.isPending ? 'Saving...' : 'Log interaction'}
        </Button>
      </div>
    </form>
  )
}
