import clsx from 'clsx'

interface ContactAvatarProps {
  firstName: string
  lastName?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const palette = [
  'bg-indigo-100 text-indigo-700',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
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
