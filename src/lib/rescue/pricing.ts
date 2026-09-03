// Pricing logic is isolated from UI so it can be replaced with AI/ML in the future.
// Current implementation: rule-based discount by minutes until reservation.

export function calcDiscountRate(minutesUntil: number): number {
  if (minutesUntil > 180) return 0.10
  if (minutesUntil > 60) return 0.15
  return 0.20
}

export function calcRescuePrice(
  originalPrice: number,
  minutesUntil: number,
): { rescuePrice: number; discountRate: number } {
  const discountRate = calcDiscountRate(minutesUntil)
  const rescuePrice = Math.round(originalPrice * (1 - discountRate))
  return { rescuePrice, discountRate }
}
