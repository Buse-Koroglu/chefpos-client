import { useEffect, useRef } from 'react'

const NON_ACTIVE_ACTIVITY = ['pointerdown', 'touchstart', 'keydown'] as const  // fare tıklaması, dokunma ve klavyeden tuşa basma işlemleri

export function useUnactiveTimer(timeoutMs: number, onUnactive: () => void, active = true) {
  const onUnactiveRef = useRef(onUnactive)

  useEffect(() => {
    onUnactiveRef.current = onUnactive
  })

  useEffect(() => {
    if (!active) return

    let timeoutId: ReturnType<typeof setTimeout>

    function reset() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => onUnactiveRef.current(), timeoutMs)
    }

    NON_ACTIVE_ACTIVITY.forEach((event) => window.addEventListener(event, reset))
    reset()

    return () => {
      clearTimeout(timeoutId)
      NON_ACTIVE_ACTIVITY.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [timeoutMs, active])
}
