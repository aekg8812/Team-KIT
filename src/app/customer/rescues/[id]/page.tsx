'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import CustomerNavigation from '@/components/navigation/CustomerNavigation'
import { DEMO_SLOT, PERK_DESCRIPTION, STORE_COMMENT, STORE_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function RescueDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { hydrated, rescueStatus, rescueOfferType, csvSlots, csvListingStatus } = useRescue()
  const available = rescueStatus === 'listed' || rescueStatus === 'reserved'
  const isDemoSlot = params.id === DEMO_SLOT.id
  const csvSlot = !isDemoSlot ? csvSlots.find((s) => s.id === params.id) : undefined
  const csvStatus = csvSlot ? csvListingStatus[csvSlot.id] : undefined
  const csvAvailable = csvStatus === 'listed' || csvStatus === 'reserved'

  useEffect(() => {
    if (!hydrated) return
    if (isDemoSlot && !available) { router.replace('/customer/rescues'); return }
    if (!isDemoSlot && (!csvSlot || !csvAvailable)) router.replace('/customer/rescues')
  }, [available, csvAvailable, csvSlot, hydrated, isDemoSlot, router])

  if (!hydrated) return null

  if (isDemoSlot) {
    if (!available) return null
    const reserved = rescueStatus === 'reserved'
    return <RoleGate role="customer"><main className="min-h-screen bg-stone-50 px-4 py-8 pb-24"><div className="mx-auto max-w-xl"><button onClick={() => router.push('/customer/rescues')} className="text-sm text-stone-500">← RESCUE枠一覧</button><div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="h-32 bg-gradient-to-br from-orange-100 via-amber-50 to-stone-100 p-6"><span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-stone-600">{DEMO_SLOT.category}</span></div><div className="p-6"><div className="flex items-start justify-between"><div><h1 className="text-3xl font-black">{DEMO_SLOT.restaurantName}</h1><p className="mt-1 text-xs text-stone-500">佐賀駅から徒歩5分 / カウンター8席</p></div>{reserved && <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">✓ 予約済み</span>}</div><p className="mt-5 text-sm leading-relaxed text-stone-600">{STORE_DESCRIPTION}</p><div className="mt-5 rounded-xl bg-stone-50 p-4"><p className="text-xs font-bold text-stone-400">店舗からひとこと</p><p className="mt-1 text-sm leading-relaxed text-stone-600">{STORE_COMMENT}</p></div><div className="mt-5 grid grid-cols-3 gap-2 border-y border-stone-100 py-4 text-center"><div><p className="text-[10px] text-stone-400">日付</p><p className="font-bold">{DEMO_SLOT.date}</p></div><div><p className="text-[10px] text-stone-400">時間</p><p className="font-bold">{DEMO_SLOT.time}</p></div><div><p className="text-[10px] text-stone-400">人数</p><p className="font-bold">{DEMO_SLOT.guests}名</p></div></div><div className="mt-5">{rescueOfferType === 'discount' ? <><p className="text-sm text-stone-400 line-through">通常 {formatYen(DEMO_SLOT.originalPrice)}</p><p className="text-4xl font-black text-orange-500">{formatYen(DEMO_SLOT.rescuePrice)} <span className="text-sm">20% OFF</span></p></> : <><p className="text-xs text-stone-400">通常価格のまま特典付き</p><p className="text-4xl font-black">{formatYen(DEMO_SLOT.originalPrice)}</p><p className="font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p></>}</div>{reserved ? <button disabled className="mt-6 w-full rounded-xl bg-emerald-100 py-4 font-bold text-emerald-700">✓ 予約済み</button> : <button onClick={() => router.push(`/customer/rescues/${DEMO_SLOT.id}/confirm`)} className="mt-6 w-full rounded-xl bg-emerald-500 py-4 font-bold text-white">予約する</button>}<p className="mt-3 text-center text-xs text-stone-400">キャンセル枠のため、残り1枠です</p></div></div></div><CustomerNavigation /></main></RoleGate>
  }

  if (!csvSlot || !csvAvailable) return null

  const csvReserved = csvStatus === 'reserved'

  return <RoleGate role="customer"><main className="min-h-screen bg-stone-50 px-4 py-8 pb-24"><div className="mx-auto max-w-xl"><button onClick={() => router.push('/customer/rescues')} className="text-sm text-stone-500">← RESCUE枠一覧</button><div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="h-32 bg-gradient-to-br from-orange-100 via-amber-50 to-stone-100 p-6"><span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-stone-600">{csvSlot.category || 'レストラン'}</span></div><div className="p-6"><div className="flex items-start justify-between"><div><h1 className="text-3xl font-black">{csvSlot.restaurantName}</h1>{csvSlot.location && <p className="mt-1 text-xs text-stone-500">{csvSlot.location}</p>}</div>{csvReserved && <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">✓ 予約済み</span>}</div>{csvSlot.description && <p className="mt-5 text-sm leading-relaxed text-stone-600">{csvSlot.description}</p>}{csvSlot.comment && <div className="mt-5 rounded-xl bg-stone-50 p-4"><p className="text-xs font-bold text-stone-400">店舗からひとこと</p><p className="mt-1 text-sm leading-relaxed text-stone-600">{csvSlot.comment}</p></div>}<div className="mt-5 grid grid-cols-3 gap-2 border-y border-stone-100 py-4 text-center"><div><p className="text-[10px] text-stone-400">日付</p><p className="font-bold">{csvSlot.date}</p></div><div><p className="text-[10px] text-stone-400">時間</p><p className="font-bold">{csvSlot.time}</p></div><div><p className="text-[10px] text-stone-400">人数</p><p className="font-bold">{csvSlot.guests}名</p></div></div><div className="mt-5">{csvSlot.offerType === 'discount' ? <><p className="text-sm text-stone-400 line-through">通常 {formatYen(csvSlot.originalPrice)}</p><p className="text-4xl font-black text-orange-500">{formatYen(csvSlot.rescuePrice)} <span className="text-sm">{Math.round(csvSlot.discountRate * 100)}% OFF</span></p></> : <><p className="text-xs text-stone-400">通常価格のまま特典付き</p><p className="text-4xl font-black">{formatYen(csvSlot.originalPrice)}</p><p className="font-bold text-emerald-600">+ {csvSlot.perkDescription}</p></>}</div>{csvReserved ? <button disabled className="mt-6 w-full rounded-xl bg-emerald-100 py-4 font-bold text-emerald-700">✓ 予約済み</button> : <button onClick={() => router.push(`/customer/rescues/${csvSlot.id}/confirm`)} className="mt-6 w-full rounded-xl bg-emerald-500 py-4 font-bold text-white">予約する</button>}<p className="mt-3 text-center text-xs text-stone-400">キャンセル枠のため、残り1枠です</p></div></div></div><CustomerNavigation /></main></RoleGate>
}
