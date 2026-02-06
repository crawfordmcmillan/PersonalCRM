import { formatRelative } from '@/lib/date'

interface RelativeTimeProps {
  date: string
}

export function RelativeTime({ date }: RelativeTimeProps) {
  return (
    <time dateTime={date} title={date} className="text-sm text-muted">
      {formatRelative(date)}
    </time>
  )
}
