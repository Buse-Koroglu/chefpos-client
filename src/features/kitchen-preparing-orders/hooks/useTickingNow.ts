import { useEffect, useState } from 'react'

/**
 * Verilen aralıkla güncellenen bir "now" değeri döner. Tarayıcı sekmesi
 * arka plandayken interval'i durdurup sekme tekrar görünür olduğunda
 * hemen tazeleyerek gereksiz kaynak tüketimini önler.
 */
export function useTickingNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    function tick() {
      setNow(new Date())
    }

    function startTicking() {
      tick()
      intervalId = setInterval(tick, intervalMs)
    }

    function stopTicking() {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        stopTicking()
      } else {
        startTicking()
      }
    }

    if (document.visibilityState !== 'hidden') {
      startTicking()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopTicking()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [intervalMs])

  return now
}
