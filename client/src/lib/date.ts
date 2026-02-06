import { formatDistanceToNow, format, parseISO } from 'date-fns'

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), "MMM d, yyyy 'at' h:mm a")
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
