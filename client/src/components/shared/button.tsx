import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
  secondary: 'border border-border bg-white text-text hover:bg-surface',
  ghost: 'text-muted hover:bg-gray-100 hover:text-text',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
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
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
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
