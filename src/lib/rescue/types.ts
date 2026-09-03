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

// A RescueSlot loaded from a store CSV import, with extra fields needed for the detail page.
export type CsvSlot = RescueSlot & {
  description: string
  comment: string
  location: string
  offerType: RescueOfferType
  perkDescription: string
}

// Per-CsvSlot publication state, independent of the DEMO_SLOT state machine so
// multiple CSV-sourced listings can be pending/listed/reserved at the same time.
export type CsvListingStatus = 'pending' | 'listed' | 'reserved'

// Minimal input for the restaurant's manual "quick add" form — the rest of a
// CsvSlot is auto-filled with sensible defaults and computed pricing. There is
// no restaurantName here: this is a single-restaurant platform, so every slot
// (CSV-imported or manually added) belongs to the one store running the demo.
export type ManualCancellationInput = {
  originalPrice: number
  category?: string
  time?: string
  guests?: number
  minutesUntil?: number
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
