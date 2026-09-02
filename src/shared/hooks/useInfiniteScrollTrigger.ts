import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

interface UseInfiniteScrollTriggerParams {
  rootRef: RefObject<HTMLElement | null>
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

export function useInfiniteScrollTrigger({ rootRef, hasMore, isLoading, onLoadMore }: UseInfiniteScrollTriggerParams) {
  const listEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || isLoading) return

    const end = listEndRef.current
    const root = rootRef.current
    if (!end || !root) return

    const observer = new IntersectionObserver( // gerçek DOM ister o yüzden sayfanın en sonunu belirtmesi için listEndRef
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { root, rootMargin: '200px' },
    )

    observer.observe(end) 
    return () => observer.disconnect()
  }, [rootRef, hasMore, isLoading, onLoadMore])

  return listEndRef
}
