'use client'

import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import CustomerNavigation from '@/components/navigation/CustomerNavigation'
import DemoRoleSwitch from '@/components/navigation/DemoRoleSwitch'
import { DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function ReservationsPage() {
  const { rescueStatus, rescueOfferType, csvSlots, csvListingStatus } = useRescue()
  const demoReserved = rescueStatus === 'reserved'
  const demoPrice = rescueOfferType === 'perk' ? DEMO_SLOT.originalPrice : DEMO_SLOT.rescuePrice
  const csvReserved = csvSlots.filter((s) => csvListingStatus[s.id] === 'reserved')
  const hasAny = demoReserved || csvReserved.length > 0

  return <RoleGate role="customer"><main className="min-h-screen bg-stone-50 pb-24"><header className="border-b border-stone-200 bg-white px-4 py-5"><div className="mx-auto flex max-w-2xl items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">Fill Food — お客さま向け</p><h1 className="mt-1 text-2xl font-bold">予約履歴</h1></div><DemoRoleSwitch to="restaurant" /></div></header><div className="mx-auto max-w-2xl px-4 py-6">
    {hasAny ? <div className="space-y-3">
      {demoReserved && <article className="rounded-2xl border border-emerald-200 bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">{DEMO_SLOT.restaurantName}</h2><p className="mt-1 text-sm text-stone-500">{DEMO_SLOT.date} {DEMO_SLOT.time} / {DEMO_SLOT.guests}名</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">✓ 予約済み</span></div><p className="mt-5 text-2xl font-black">{formatYen(demoPrice)}</p>{rescueOfferType === 'perk' && <p className="text-sm font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p>}</article>}
      {csvReserved.map((slot) => <article key={slot.id} className="rounded-2xl border border-emerald-200 bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">{slot.restaurantName}</h2><p className="mt-0.5 text-xs text-stone-400">{slot.category}</p><p className="mt-1 text-sm text-stone-500">{slot.date} {slot.time} / {slot.guests}名</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">✓ 予約済み</span></div><p className="mt-5 text-2xl font-black">{formatYen(slot.rescuePrice)}</p>{slot.offerType === 'perk' && <p className="text-sm font-bold text-emerald-600">+ {slot.perkDescription}</p>}</article>)}
    </div> : <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center"><p className="text-4xl">📖</p><p className="mt-4 font-bold">予約履歴はまだありません</p><p className="mt-1 text-sm text-stone-500">RESCUE枠を予約すると、ここに表示されます。</p></div>}
  </div><CustomerNavigation /></main></RoleGate>
}
