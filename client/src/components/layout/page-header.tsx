import { type ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  children?: ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 px-8 py-5">
      <h1 className="text-xl font-semibold text-text tracking-tight">{title}</h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
