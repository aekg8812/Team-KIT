'use client'

import Link from 'next/link'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import CustomerNavigation from '@/components/navigation/CustomerNavigation'
import DemoRoleSwitch from '@/components/navigation/DemoRoleSwitch'
import { DEMO_SLOT, DUMMY_SLOTS, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function RescueListPage() {
  const { rescueStatus, rescueOfferType, csvSlots, csvListingStatus } = useRescue()
  const showDemoSlot = rescueStatus === 'listed' || rescueStatus === 'reserved'
  const reserved = rescueStatus === 'reserved'
  const publishedCsvSlots = csvSlots.filter(
    (slot) => csvListingStatus[slot.id] === 'listed' || csvListingStatus[slot.id] === 'reserved',
  )
  const hasCsvSlots = publishedCsvSlots.length > 0
  const listedSlots = hasCsvSlots ? publishedCsvSlots : DUMMY_SLOTS

  return <RoleGate role="customer"><main className="min-h-screen bg-stone-50 pb-24">
    <header className="border-b border-stone-200 bg-white px-4 py-5"><div className="mx-auto flex max-w-2xl items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">救席 — お客さま向け</p><h1 className="mt-1 text-2xl font-bold">RESCUE枠</h1><p className="mt-1 text-sm text-stone-500">空いた人気店を、今だけの条件で予約</p></div><DemoRoleSwitch to="restaurant" /></div></header>
    <div className="mx-auto max-w-2xl px-4 py-6">
      {showDemoSlot && <article className={`mb-6 overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${reserved ? 'border-emerald-300' : 'border-orange-300'}`}>
        <div className={`flex items-center px-5 py-2 ${reserved ? 'bg-emerald-500' : 'bg-orange-500'}`}><span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{reserved ? '✓ 予約済み' : 'たった今キャンセル'}</span><span className="ml-auto text-xs font-bold text-white/80">{reserved ? '予約が確定しました' : '残り1枠'}</span></div>
        <div className="p-5"><div className="flex items-start justify-between"><div><h2 className="text-2xl font-bold">{DEMO_SLOT.restaurantName}</h2><p className="mt-1 text-xs text-stone-500">{DEMO_SLOT.category}</p></div>{rescueOfferType === 'discount' ? <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">20% OFF</span> : <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">特典付き</span>}</div><p className="mt-4 text-sm text-stone-500">📅 {DEMO_SLOT.date}　🕖 {DEMO_SLOT.time}　👥 {DEMO_SLOT.guests}名</p>{rescueOfferType === 'discount' ? <div className="mt-4 flex items-end gap-3"><span className="text-sm text-stone-400 line-through">{formatYen(DEMO_SLOT.originalPrice)}</span><span className="text-3xl font-black text-orange-500">{formatYen(DEMO_SLOT.rescuePrice)}</span></div> : <div className="mt-4"><p className="text-3xl font-black">{formatYen(DEMO_SLOT.originalPrice)}</p><p className="font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p></div>}
        <Link href={`/customer/rescues/${DEMO_SLOT.id}`} className={`mt-5 block w-full rounded-xl py-3.5 text-center text-sm font-bold ${reserved ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-emerald-500 text-white'}`}>{reserved ? '予約内容を見る' : '詳細を見る'}</Link></div>
      </article>}
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">公開中のRESCUE枠</p>
      <div className="grid gap-3 sm:grid-cols-3">{listedSlots.map(slot => {
        const isPerk = 'offerType' in slot && slot.offerType === 'perk'
        const isReserved = hasCsvSlots && csvListingStatus[slot.id] === 'reserved'
        const badge = isReserved
          ? <span className="h-fit rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">✓ 予約済み</span>
          : isPerk
            ? <span className="h-fit rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">特典付き</span>
            : <span className="h-fit rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">{Math.round(slot.discountRate * 100)}% OFF</span>
        const body = <><div className="flex justify-between gap-2"><div><h2 className="font-bold">{slot.restaurantName}</h2><p className="text-[10px] text-stone-400">{slot.category}</p></div>{badge}</div>
          <p className="mt-3 text-xs text-stone-500">{slot.date} {slot.time} / {slot.guests}名</p>
          <p className="mt-1 text-xl font-bold">{formatYen(slot.rescuePrice)}</p></>
        return hasCsvSlots
          ? <Link key={slot.id} href={`/customer/rescues/${slot.id}`} className="block rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300">{body}<span className="mt-3 inline-block text-xs font-bold text-stone-400">詳細を見る →</span></Link>
          : <article key={slot.id} className="rounded-xl border border-stone-200 bg-white p-4">{body}<button className="mt-3 text-xs font-bold text-stone-400" onClick={() => window.alert('この店舗の詳細は Coming Soon です')}>詳細を見る →</button></article>
      })}</div>
    </div><CustomerNavigation />
  </main></RoleGate>
}
