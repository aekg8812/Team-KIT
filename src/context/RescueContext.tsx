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
import type { RescueStatus, RescueOfferType, KPI } from '@/lib/rescue/types'

const SESSION_KEY = 'rescue_demo_status'
const SESSION_KEY_OFFER = 'rescue_demo_offer'
const VALID_STATUSES: RescueStatus[] = ['idle', 'cancelled', 'listed', 'reserved']

// Reads from sessionStorage on client; returns 'idle' on server (SSR).
function getInitialStatus(): RescueStatus {
  if (typeof window === 'undefined') return 'idle'
  const saved = sessionStorage.getItem(SESSION_KEY)
  return saved && VALID_STATUSES.includes(saved as RescueStatus)
    ? (saved as RescueStatus)
    : 'idle'
}

function getInitialOffer(): RescueOfferType {
  if (typeof window === 'undefined') return 'discount'
  const saved = sessionStorage.getItem(SESSION_KEY_OFFER)
  return saved === 'perk' ? 'perk' : 'discount'
}

type RescueContextValue = {
  rescueStatus: RescueStatus
  rescueOfferType: RescueOfferType
  kpi: KPI
  pendingHighlight: boolean
  consumeHighlight: () => void
  startCancel: () => void
  startRescue: () => void
  completeReservation: () => void
  resetDemo: () => void
  setRescueOfferType: (type: RescueOfferType) => void
}

const RescueContext = createContext<RescueContextValue | null>(null)

export function RescueProvider({ children }: { children: ReactNode }) {
  const [rescueStatus, setRescueStatus] = useState<RescueStatus>(getInitialStatus)
  const [rescueOfferType, setRescueOfferTypeRaw] = useState<RescueOfferType>(getInitialOffer)
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
    sessionStorage.removeItem(SESSION_KEY_OFFER)
    setPendingHighlight(false)
    setRescueOfferTypeRaw('discount')
    setRescueStatus('idle')
  }, [])

  const consumeHighlight = useCallback(() => {
    setPendingHighlight(false)
  }, [])

  const setRescueOfferType = useCallback((type: RescueOfferType) => {
    sessionStorage.setItem(SESSION_KEY_OFFER, type)
    setRescueOfferTypeRaw(type)
  }, [])

  const kpi = calcKPIs(KPI_BASES[rescueStatus])

  return (
    <RescueContext.Provider
      value={{
        rescueStatus,
        rescueOfferType,
        kpi,
        pendingHighlight,
        consumeHighlight,
        startCancel,
        startRescue,
        completeReservation,
        resetDemo,
        setRescueOfferType,
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
