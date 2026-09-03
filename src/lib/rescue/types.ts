export type RescueStatus = 'idle' | 'cancelled' | 'listed' | 'reserved'

export type RescueOfferType = 'discount' | 'perk'

export type UserRole = 'customer' | 'restaurant'

export type RescueBreakdown = {
  originalPrice: number
  rescuePrice: number
  serviceFee: number
  storeRevenue: number
}

export type RescueSlot = {
  id: string
  restaurantName: string
  category: string
  date: string
  time: string
  guests: number
  originalPrice: number
  rescuePrice: number
  discountRate: number
  minutesUntil: number
}

export type KpiBase = {
  cancellationGMV: number
  recoveredGMV: number
  filledCount: number
  totalListed: number
}

export type KPI = {
  cancellationGMV: number
  recoveredGMV: number
  recoveryRate: number
  fillRate: number
  filledCount: number
  totalListed: number
  rescueRevenue: number
}
