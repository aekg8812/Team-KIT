'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import { DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function ReservationConfirmPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { hydrated, rescueStatus, rescueOfferType, completeReservation } = useRescue()
  useEffect(() => {
    if (!hydrated) return
    if (params.id !== DEMO_SLOT.id || rescueStatus !== 'listed') router.replace('/customer/rescues')
  }, [hydrated, params.id, rescueStatus, router])

  function confirm() {
    completeReservation()
    router.push('/customer/reservation-complete')
  }

  if (!hydrated || params.id !== DEMO_SLOT.id || rescueStatus !== 'listed') return null
  return <RoleGate role="customer"><main className="min-h-screen bg-emerald-50 px-4 py-10"><div className="mx-auto max-w-md"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">Fill Food — 予約確認</p><h1 className="mt-2 text-2xl font-black">この内容で予約しますか？</h1><div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-2xl font-bold">{DEMO_SLOT.restaurantName}</h2><p className="mt-2 text-sm text-stone-500">{DEMO_SLOT.date} {DEMO_SLOT.time} / {DEMO_SLOT.guests}名</p><div className="mt-5 border-t border-stone-100 pt-5">{rescueOfferType === 'discount' ? <><p className="text-xs text-stone-400 line-through">通常 {formatYen(DEMO_SLOT.originalPrice)}</p><p className="text-4xl font-black text-orange-500">{formatYen(DEMO_SLOT.rescuePrice)}</p><p className="font-bold text-orange-600">20% OFF</p></> : <><p className="text-4xl font-black">{formatYen(DEMO_SLOT.originalPrice)}</p><p className="font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p></>}</div><div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">キャンセル枠のため、予約後の変更・キャンセルができない場合があります。</div></div><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => router.back()} className="rounded-xl border border-stone-300 bg-white py-4 font-bold text-stone-600">戻る</button><button onClick={confirm} className="rounded-xl bg-emerald-500 py-4 font-bold text-white">予約を確定する</button></div></div></main></RoleGate>
}
