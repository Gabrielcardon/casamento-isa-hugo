import { useEffect, useState } from 'react'
import { subscribeGifts } from '../services/gifts'
import type { Gift } from '../types/gift'

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    try {
      const unsub = subscribeGifts((next) => {
        setGifts(next)
        setLoading(false)
        setError(null)
      })
      return unsub
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar presentes')
      setLoading(false)
    }
  }, [])

  return { gifts, loading, error }
}
