'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import { DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function ReservationCompletePage() {
  const router = useRouter()
  const { hydrated, rescueStatus, rescueOfferType, csvSlots, csvListingStatus, lastReservedCsvId } = useRescue()
  const demoReserved = rescueStatus === 'reserved'
  const matchedCsvSlot = lastReservedCsvId ? csvSlots.find((s) => s.id === lastReservedCsvId) : undefined
  // Prefer the CSV booking when both happen to be true — it's the one the customer
  // just came from (confirm pages for the two flows never overlap in a single visit).
  const reservedCsvSlot =
    matchedCsvSlot && csvListingStatus[matchedCsvSlot.id] === 'reserved' ? matchedCsvSlot : undefined
  const showDemo = !reservedCsvSlot && demoReserved
  const available = Boolean(reservedCsvSlot) || showDemo

  useEffect(() => {
    if (hydrated && !available) router.replace('/customer/rescues')
  }, [available, hydrated, router])

  if (!hydrated || !available) return null

  const restaurantName = reservedCsvSlot?.restaurantName ?? DEMO_SLOT.restaurantName
  const category = reservedCsvSlot?.category
  const date = reservedCsvSlot?.date ?? DEMO_SLOT.date
  const time = reservedCsvSlot?.time ?? DEMO_SLOT.time
  const guests = reservedCsvSlot?.guests ?? DEMO_SLOT.guests
  const offerType = reservedCsvSlot?.offerType ?? rescueOfferType
  const price = reservedCsvSlot
    ? reservedCsvSlot.rescuePrice
    : rescueOfferType === 'perk' ? DEMO_SLOT.originalPrice : DEMO_SLOT.rescuePrice
  const perkText = reservedCsvSlot?.perkDescription ?? PERK_DESCRIPTION

  return <RoleGate role="customer"><main className="min-h-screen bg-emerald-50 px-4 py-12"><div className="mx-auto max-w-sm text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white shadow-lg animate-[rescue-appear_0.65s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">✓</div><h1 className="mt-5 text-3xl font-black">予約できました！</h1><div className="mt-7 rounded-2xl border border-emerald-200 bg-white p-6"><h2 className="text-2xl font-bold">{restaurantName}</h2>{category && <p className="mt-0.5 text-xs text-stone-400">{category}</p>}<p className="mt-2 text-sm text-stone-500">{date} {time} / {guests}名</p><p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Rescue Price</p><p className="mt-1 text-4xl font-black text-orange-500">{formatYen(price)}</p>{offerType === 'perk' && <p className="mt-1 font-bold text-emerald-600">+ {perkText}</p>}</div><button onClick={() => router.push('/customer/rescues')} className="mt-7 w-full rounded-xl bg-emerald-500 py-4 font-bold text-white">RESCUE枠一覧へ戻る</button></div></main></RoleGate>
}
