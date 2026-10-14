import { useEffect, useState } from 'react'

export function useInfiniteScroll(onLoadMore, { enabled = true, root = null, rootMargin = '400px' } = {}) {
  // ref en forma de estado: el efecto se ejecuta cuando el centinela se monta de verdad
  const [sentinel, setSentinel] = useState(null)

  useEffect(() => {
    if (!sentinel || !enabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore()
      },
      { root, rootMargin },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinel, enabled, onLoadMore, root, rootMargin])

  return setSentinel
}