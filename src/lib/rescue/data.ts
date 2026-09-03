import type { KpiBase, RescueStatus, RescueSlot } from './types'

// KPI base values for each demo state.
// Derived values (recoveryRate, fillRate, rescueRevenue) are computed by calcKPIs().
export const KPI_BASES: Record<RescueStatus, KpiBase> = {
  idle:      { cancellationGMV: 116000, recoveredGMV: 76000, filledCount: 6, totalListed: 8 },
  cancelled: { cancellationGMV: 126000, recoveredGMV: 76000, filledCount: 6, totalListed: 8 },
  listed:    { cancellationGMV: 126000, recoveredGMV: 76000, filledCount: 6, totalListed: 9 },
  reserved:  { cancellationGMV: 126000, recoveredGMV: 84000, filledCount: 7, totalListed: 9 },
}

// Main demo slot: 鮨 佐賀
export const DEMO_SLOT: RescueSlot = {
  id: 'slot-001',
  restaurantName: '鮨 佐賀',
  category: '寿司',
  date: '本日',
  time: '19:00',
  guests: 2,
  originalPrice: 10000,
  rescuePrice: 8000,
  discountRate: 0.20,
  minutesUntil: 52,
}

// Supplementary marketplace listings (static, not interactive in demo)
export const DUMMY_SLOTS: RescueSlot[] = [
  {
    id: 'slot-002',
    restaurantName: '焼肉 匠',
    category: '焼肉',
    date: '本日',
    time: '20:00',
    guests: 4,
    originalPrice: 8000,
    rescuePrice: 6800,
    discountRate: 0.15,
    minutesUntil: 112,
  },
  {
    id: 'slot-003',
    restaurantName: 'Bistro SAGA',
    category: 'フレンチ',
    date: '本日',
    time: '19:30',
    guests: 2,
    originalPrice: 6000,
    rescuePrice: 5100,
    discountRate: 0.15,
    minutesUntil: 90,
  },
  {
    id: 'slot-004',
    restaurantName: '炭火焼 炎',
    category: '炭火焼',
    date: '本日',
    time: '18:30',
    guests: 2,
    originalPrice: 5000,
    rescuePrice: 4250,
    discountRate: 0.15,
    minutesUntil: 75,
  },
]

// Fixed values for the rescued breakdown display
export const RESCUE_BREAKDOWN = {
  originalPrice: 10000,
  rescuePrice: 8000,
  serviceFee: 800,
  storeRevenue: 7200,
} as const
