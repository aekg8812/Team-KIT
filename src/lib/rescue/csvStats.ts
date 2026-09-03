import type { CsvListingStatus, CsvSlot } from './types'

export type CsvBreakdownRow = { label: string; count: number; recoveredTotal: number }

// Rough, clearly-labeled estimate of food waste avoided per rescued guest — not a
// precise measurement, just enough to turn "meals saved" into a tangible number.
const FOOD_WASTE_KG_PER_GUEST = 0.35

export type CsvStats = {
  reservedCount: number
  avgDiscountRate: number | null
  avgRecoveredPrice: number | null
  mealsSaved: number
  foodWasteKg: number
  byTimeBand: CsvBreakdownRow[]
}

function timeBand(time: string): string {
  const hour = Number(time.split(':')[0])
  if (!Number.isFinite(hour)) return '不明'
  if (hour < 11) return '朝（〜11時）'
  if (hour < 15) return '昼（11-15時）'
  if (hour < 18) return '夕方（15-18時）'
  return '夜（18時〜）'
}

function groupBy(slots: CsvSlot[], keyFn: (slot: CsvSlot) => string): CsvBreakdownRow[] {
  const acc: Record<string, CsvBreakdownRow> = {}
  for (const slot of slots) {
    const key = keyFn(slot)
    if (!acc[key]) acc[key] = { label: key, count: 0, recoveredTotal: 0 }
    acc[key].count += 1
    acc[key].recoveredTotal += slot.rescuePrice
  }
  return Object.values(acc).sort((a, b) => b.recoveredTotal - a.recoveredTotal)
}

export function calcCsvStats(
  slots: CsvSlot[],
  status: Record<string, CsvListingStatus>,
): CsvStats {
  const reserved = slots.filter((s) => status[s.id] === 'reserved')
  const discountReserved = reserved.filter((s) => s.offerType === 'discount')

  const avgDiscountRate =
    discountReserved.length > 0
      ? discountReserved.reduce((sum, s) => sum + s.discountRate, 0) / discountReserved.length
      : null
  const avgRecoveredPrice =
    reserved.length > 0
      ? Math.round(reserved.reduce((sum, s) => sum + s.rescuePrice, 0) / reserved.length)
      : null

  const mealsSaved = reserved.reduce((sum, s) => sum + s.guests, 0)
  const foodWasteKg = Math.round(mealsSaved * FOOD_WASTE_KG_PER_GUEST * 10) / 10

  return {
    reservedCount: reserved.length,
    avgDiscountRate,
    avgRecoveredPrice,
    mealsSaved,
    foodWasteKg,
    byTimeBand: groupBy(reserved, (s) => timeBand(s.time)),
  }
}
