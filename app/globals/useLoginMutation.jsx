'use client'

import { useMutation } from '@tanstack/react-query'
import { useSession } from '@g/SessionContext'

export function useLoginMutation() {
  const { loginWithCredentials } = useSession()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: (cliente) => loginWithCredentials(cliente),
  })
}

