import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Maitú Café` : 'Maitú Café · Del origen a tu taza'
  }, [title])
}
