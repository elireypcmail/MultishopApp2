'use client'

import { useMutation } from '@tanstack/react-query'
import { fetchKpiAndLastSync } from '@g/kpiService'

export function useKpiDataMutation() {
  return useMutation({
    mutationKey: ['kpiData'],
    mutationFn: (payload) => fetchKpiAndLastSync(payload),
  })
}

