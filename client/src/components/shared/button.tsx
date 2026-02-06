import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

const variantStyles = {
  primary: 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-sm shadow-indigo-500/25 hover:shadow-md hover:shadow-indigo-500/30',
  secondary: 'border border-border/80 bg-white text-text hover:bg-surface hover:border-border shadow-sm shadow-black/[0.02]',
  ghost: 'text-muted hover:bg-surface-hover hover:text-text',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-4 py-2 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
