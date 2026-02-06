import { type ReactNode } from 'react'
import clsx from 'clsx'

type BadgeVariant = 'default' | 'love' | 'like' | 'know' | 'overdue' | 'due'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60',
  love: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200/60',
  like: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/60',
  know: 'bg-slate-50 text-slate-500 ring-1 ring-slate-200/60',
  overdue: 'bg-red-50 text-red-600 ring-1 ring-red-200/60',
  due: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/60',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        variantStyles[variant],
      )}
    >
      {children}
    </span>
  )
}

export function sphereVariant(sphere: string): BadgeVariant {
  switch (sphere) {
    case 'Love Them':
      return 'love'
    case 'Like Them':
      return 'like'
    case 'Know Them':
      return 'know'
    default:
      return 'default'
  }
}
