import { type TextareaHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, id, ...props }, ref) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'block w-full rounded-lg border border-border/80 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 shadow-sm shadow-black/[0.02] transition-all duration-200',
            'focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-500/10',
            className,
          )}
          rows={3}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  },
)
