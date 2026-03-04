'use client'

import { useMutation } from '@tanstack/react-query'
import { generateToken, validateToken, disabledToken } from '@api/Post'

export function useGenerateTokenMutation() {
  return useMutation({
    mutationKey: ['generateToken'],
    mutationFn: (payload) => generateToken(payload),
  })
}

export function useValidateTokenMutation() {
  return useMutation({
    mutationKey: ['validateToken'],
    mutationFn: (payload) => validateToken(payload),
  })
}

export function useDisableTokenMutation() {
  return useMutation({
    mutationKey: ['disableToken'],
    mutationFn: (payload) => disabledToken(payload),
  })
}

