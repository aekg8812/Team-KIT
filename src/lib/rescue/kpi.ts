import type { KpiBase, KPI, RescueOfferType, RescueSlot, RescueBreakdown } from './types'

const RESCUE_FEE_RATE = 0.10

export function calcKPIs(base: KpiBase): KPI {
  const recoveryRate =
    base.cancellationGMV > 0
      ? Math.round((base.recoveredGMV / base.cancellationGMV) * 1000) / 10
      : 0
  const fillRate =
    base.totalListed > 0
      ? Math.round((base.filledCount / base.totalListed) * 1000) / 10
      : 0
  const rescueRevenue = Math.round(base.recoveredGMV * RESCUE_FEE_RATE)

  return {
    cancellationGMV: base.cancellationGMV,
    recoveredGMV: base.recoveredGMV,
    recoveryRate,
    fillRate,
    filledCount: base.filledCount,
    totalListed: base.totalListed,
    rescueRevenue,
  }
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

export function calcRescueBreakdown(offerType: RescueOfferType, slot: RescueSlot): RescueBreakdown {
  const rescuePrice = offerType === 'perk' ? slot.originalPrice : slot.rescuePrice
  const serviceFee = Math.round(rescuePrice * RESCUE_FEE_RATE)
  const storeRevenue = rescuePrice - serviceFee
  return { originalPrice: slot.originalPrice, rescuePrice, serviceFee, storeRevenue }
}
