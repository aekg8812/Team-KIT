'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { calcKPIs } from '@/lib/rescue/kpi'
import { KPI_BASES } from '@/lib/rescue/data'
import type { RescueStatus, KPI } from '@/lib/rescue/types'

const SESSION_KEY = 'rescue_demo_status'
const VALID_STATUSES: RescueStatus[] = ['idle', 'cancelled', 'listed', 'reserved']

// Reads from sessionStorage on client; returns 'idle' on server (SSR).
// Pages use a router-based redirect (not a state guard) for hydration safety.
function getInitialStatus(): RescueStatus {
  if (typeof window === 'undefined') return 'idle'
  const saved = sessionStorage.getItem(SESSION_KEY)
  return saved && VALID_STATUSES.includes(saved as RescueStatus)
    ? (saved as RescueStatus)
    : 'idle'
}

type RescueContextValue = {
  rescueStatus: RescueStatus
  kpi: KPI
  pendingHighlight: boolean
  consumeHighlight: () => void
  startCancel: () => void
  startRescue: () => void
  completeReservation: () => void
  resetDemo: () => void
}

const RescueContext = createContext<RescueContextValue | null>(null)

export function RescueProvider({ children }: { children: ReactNode }) {
  const [rescueStatus, setRescueStatus] = useState<RescueStatus>(getInitialStatus)
  const [pendingHighlight, setPendingHighlight] = useState(false)

  const startCancel = useCallback(() => {
    setRescueStatus((prev) => {
      if (prev !== 'idle') return prev
      sessionStorage.setItem(SESSION_KEY, 'cancelled')
      return 'cancelled'
    })
  }, [])

  const startRescue = useCallback(() => {
    setRescueStatus((prev) => {
      if (prev !== 'cancelled') return prev
      sessionStorage.setItem(SESSION_KEY, 'listed')
      return 'listed'
    })
  }, [])

  const completeReservation = useCallback(() => {
    setRescueStatus((prev) => {
      if (prev !== 'listed') return prev
      sessionStorage.setItem(SESSION_KEY, 'reserved')
      return 'reserved'
    })
    setPendingHighlight(true)
  }, [])

  const resetDemo = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setPendingHighlight(false)
    setRescueStatus('idle')
  }, [])

  const consumeHighlight = useCallback(() => {
    setPendingHighlight(false)
  }, [])

  const kpi = calcKPIs(KPI_BASES[rescueStatus])

  return (
    <RescueContext.Provider
      value={{
        rescueStatus,
        kpi,
        pendingHighlight,
        consumeHighlight,
        startCancel,
        startRescue,
        completeReservation,
        resetDemo,
      }}
    >
      {children}
    </RescueContext.Provider>
  )
}

export function useRescue(): RescueContextValue {
  const ctx = useContext(RescueContext)
  if (!ctx) throw new Error('useRescue must be used within RescueProvider')
  return ctx
}
