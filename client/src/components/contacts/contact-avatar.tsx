import clsx from 'clsx'

interface ContactAvatarProps {
  firstName: string
  lastName?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const palette = [
  'bg-gradient-to-br from-indigo-100 to-indigo-200/70 text-indigo-700',
  'bg-gradient-to-br from-rose-100 to-rose-200/70 text-rose-700',
  'bg-gradient-to-br from-emerald-100 to-emerald-200/70 text-emerald-700',
  'bg-gradient-to-br from-amber-100 to-amber-200/70 text-amber-700',
  'bg-gradient-to-br from-sky-100 to-sky-200/70 text-sky-700',
  'bg-gradient-to-br from-violet-100 to-violet-200/70 text-violet-700',
  'bg-gradient-to-br from-teal-100 to-teal-200/70 text-teal-700',
  'bg-gradient-to-br from-pink-100 to-pink-200/70 text-pink-700',
  'bg-gradient-to-br from-cyan-100 to-cyan-200/70 text-cyan-700',
  'bg-gradient-to-br from-orange-100 to-orange-200/70 text-orange-700',
]

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function ContactAvatar({
  firstName,
  lastName,
  size = 'md',
}: ContactAvatarProps) {
  const initials = `${firstName[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  const colorIndex = hashName(`${firstName}${lastName || ''}`) % palette.length

  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full font-medium',
        palette[colorIndex],
        sizeStyles[size],
      )}
    >
      {initials}
    </div>
  )
}
