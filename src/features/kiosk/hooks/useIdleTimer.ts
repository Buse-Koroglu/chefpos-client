import { useEffect, useRef } from 'react'

const ACTIVITY_EVENTS = ['pointerdown', 'touchstart', 'keydown'] as const

export function useIdleTimer(timeoutMs: number, onIdle: () => void, active = true) {
  const onIdleRef = useRef(onIdle)
  onIdleRef.current = onIdle

  useEffect(() => {
    if (!active) return

    let timeoutId: ReturnType<typeof setTimeout>

    function reset() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => onIdleRef.current(), timeoutMs)
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset))
    reset()

    return () => {
      clearTimeout(timeoutId)
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [timeoutMs, active])
}
