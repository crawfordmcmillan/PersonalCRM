import { useEffect } from 'react'

export function useKeyboard(
  key: string,
  callback: () => void,
  options: { meta?: boolean; ctrl?: boolean } = {},
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const metaMatch = options.meta ? e.metaKey || e.ctrlKey : true
      const ctrlMatch = options.ctrl ? e.ctrlKey : true

      if (e.key.toLowerCase() === key.toLowerCase() && metaMatch && ctrlMatch) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, options.meta, options.ctrl])
}
