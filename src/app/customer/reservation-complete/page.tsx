'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import { DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function ReservationCompletePage() {
  const router = useRouter()
  const { hydrated, rescueStatus, rescueOfferType } = useRescue()
  useEffect(() => { if (hydrated && rescueStatus !== 'reserved') router.replace('/customer/rescues') }, [hydrated, rescueStatus, router])
  if (!hydrated || rescueStatus !== 'reserved') return null
  const price = rescueOfferType === 'perk' ? DEMO_SLOT.originalPrice : DEMO_SLOT.rescuePrice
  return <RoleGate role="customer"><main className="min-h-screen bg-emerald-50 px-4 py-12"><div className="mx-auto max-w-sm text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white shadow-lg animate-[rescue-appear_0.65s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">✓</div><h1 className="mt-5 text-3xl font-black">予約できました！</h1><div className="mt-7 rounded-2xl border border-emerald-200 bg-white p-6"><h2 className="text-2xl font-bold">{DEMO_SLOT.restaurantName}</h2><p className="mt-2 text-sm text-stone-500">{DEMO_SLOT.date} {DEMO_SLOT.time} / {DEMO_SLOT.guests}名</p><p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Rescue Price</p><p className="mt-1 text-4xl font-black text-orange-500">{formatYen(price)}</p>{rescueOfferType === 'perk' && <p className="mt-1 font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p>}</div><button onClick={() => router.push('/customer/rescues')} className="mt-7 w-full rounded-xl bg-emerald-500 py-4 font-bold text-white">RESCUE枠一覧へ戻る</button></div></main></RoleGate>
}
