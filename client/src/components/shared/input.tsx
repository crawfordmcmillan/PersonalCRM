import { type InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id, ...props }, ref) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'block w-full rounded-lg border border-border/80 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 shadow-sm shadow-black/[0.02] transition-all duration-200',
            'focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-500/10',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  },
)
