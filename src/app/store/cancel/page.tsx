'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import StoreNavigation from '@/components/navigation/StoreNavigation'
import DemoRoleSwitch from '@/components/navigation/DemoRoleSwitch'
import StepIndicator from '@/components/rescue/StepIndicator'
import { DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'
import type { RescueOfferType } from '@/lib/rescue/types'

export default function CancelPage() {
  const router = useRouter()
  const { rescueStatus, rescueOfferType, setRescueOfferType } = useRescue()
  const [selectedOffer, setSelectedOffer] = useState<RescueOfferType>(rescueOfferType)
  const slot = DEMO_SLOT

  function reviewOffer() {
    setRescueOfferType(selectedOffer)
    router.push('/store/cancel/confirm')
  }

  if (rescueStatus !== 'cancelled') {
    const message = rescueStatus === 'idle'
      ? '現在、出品できるキャンセル枠はありません。'
      : rescueStatus === 'listed'
        ? '鮨 佐賀のRESCUE枠をお客さまへ公開中です。'
        : '鮨 佐賀のRESCUE予約が成立しました。'
    return (
      <RoleGate role="restaurant">
        <main className="min-h-screen bg-stone-50 px-4 py-8 pb-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">Fill Food — 飲食店向け</p><h1 className="mt-1 text-2xl font-bold">出品管理</h1></div><DemoRoleSwitch to="customer" /></div>
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center"><p className="text-4xl">{rescueStatus === 'idle' ? '📭' : rescueStatus === 'listed' ? '🔥' : '✓'}</p><p className="mt-4 font-bold text-stone-800">{message}</p><button onClick={() => router.push('/store')} className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white">ダッシュボードへ</button></div>
          </div>
          <StoreNavigation />
        </main>
      </RoleGate>
    )
  }

  return (
    <RoleGate role="restaurant">
      <main className="min-h-screen bg-stone-50 px-4 py-8 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">Fill Food — 飲食店向け</p><h1 className="mt-1 text-2xl font-bold">RESCUE投稿設定</h1></div><DemoRoleSwitch to="customer" /></div>
          <div className="mt-6 rounded-xl border border-stone-200 bg-white px-4 py-3"><StepIndicator activeStep={0} /></div>

          <div className="mt-5 rounded-xl border border-stone-200 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">キャンセルされた予約</p><h2 className="mt-2 text-xl font-bold">{slot.restaurantName}</h2><p className="mt-1 text-sm text-stone-500">{slot.date} {slot.time} / {slot.guests}名 / 通常 {formatYen(slot.originalPrice)}</p></div>
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6 animate-[loss-pulse_2s_ease-in-out_3]"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">⚠ キャンセルが発生しました</p><p className="mt-3 text-sm text-red-400">予想損失</p><p className="text-5xl font-black text-red-600">-{formatYen(slot.originalPrice)}</p><p className="mt-2 text-xs text-red-400">回収率は60.3%まで低下。このままでは売上がゼロになります。</p></div>

          <h2 className="mt-6 text-sm font-bold text-stone-700">RESCUE方式を選択</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={() => setSelectedOffer('discount')} className={`rounded-xl border-2 p-4 text-left ${selectedOffer === 'discount' ? 'border-orange-400 bg-orange-50' : 'border-stone-200 bg-white'}`}><p className="text-[10px] font-bold text-orange-500">おすすめ</p><p className="mt-2 text-sm font-bold">値下げして再販売</p><p className="mt-3 text-xs text-stone-400 line-through">{formatYen(slot.originalPrice)}</p><p className="text-2xl font-black text-orange-500">{formatYen(slot.rescuePrice)}</p><span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">20% OFF</span></button>
            <button onClick={() => setSelectedOffer('perk')} className={`rounded-xl border-2 p-4 text-left ${selectedOffer === 'perk' ? 'border-orange-400 bg-orange-50' : 'border-stone-200 bg-white'}`}><p className="text-[10px] font-bold text-stone-400">価格維持</p><p className="mt-2 text-sm font-bold">価格維持 + 特典</p><p className="mt-5 text-2xl font-black">{formatYen(slot.originalPrice)}</p><span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">+ {PERK_DESCRIPTION}</span></button>
          </div>

          <div className="mt-5 rounded-xl border border-stone-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">お客さま画面プレビュー</p><h3 className="mt-3 font-bold">{slot.restaurantName}</h3><p className="text-xs text-stone-500">{slot.date} {slot.time} / {slot.guests}名</p>{selectedOffer === 'discount' ? <p className="mt-3 text-2xl font-black text-orange-500">{formatYen(slot.rescuePrice)} <span className="text-xs">20% OFF</span></p> : <div><p className="mt-3 text-2xl font-black">{formatYen(slot.originalPrice)}</p><p className="text-sm font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p></div>}</div>
          <button onClick={reviewOffer} className="mt-5 w-full rounded-2xl bg-orange-500 py-5 text-lg font-bold text-white hover:bg-orange-600">出品内容を確認する</button>
        </div>
        <StoreNavigation />
      </main>
    </RoleGate>
  )
}
