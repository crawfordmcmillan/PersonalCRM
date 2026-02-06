import { type ReactNode } from 'react'
import clsx from 'clsx'

type BadgeVariant = 'default' | 'love' | 'like' | 'know' | 'overdue' | 'due'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  love: 'bg-rose-50 text-rose-700',
  like: 'bg-blue-50 text-blue-700',
  know: 'bg-gray-100 text-gray-600',
  overdue: 'bg-red-50 text-red-700',
  due: 'bg-amber-50 text-amber-700',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
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
