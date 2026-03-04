'use client'

import { useQuery } from '@tanstack/react-query'
import { getParametros } from '@api/Post'

export function useParametrosQuery() {
  return useQuery({
    queryKey: ['parameters'],
    queryFn: () => getParametros(),
  })
}
