'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import StepIndicator from '@/components/rescue/StepIndicator'
import { DEMO_SLOT, PERK_DESCRIPTION, STORE_COMMENT } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function PublishConfirmPage() {
  const router = useRouter()
  const { hydrated, rescueStatus, rescueOfferType, startRescue } = useRescue()
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  useEffect(() => {
    if (hydrated && rescueStatus !== 'cancelled') router.replace('/store/cancel')
  }, [hydrated, rescueStatus, router])

  function publish() {
    setPublishing(true)
    window.setTimeout(() => {
      startRescue()
      setPublishing(false)
      setPublished(true)
      window.setTimeout(() => router.push('/store'), 650)
    }, 700)
  }

  return <RoleGate role="restaurant"><main className="min-h-screen bg-stone-50 px-4 py-8"><div className="mx-auto max-w-xl">
    <button onClick={() => router.back()} className="text-sm text-stone-500">← 戻って修正</button>
    <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">救席 — 飲食店向け</p><h1 className="mt-1 text-2xl font-bold">出品内容の確認</h1>
    <div className="mt-5 rounded-xl border border-stone-200 bg-white px-4 py-3"><StepIndicator activeStep={1} /></div>
    <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-6"><p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">公開するRESCUE枠</p><h2 className="mt-3 text-2xl font-bold">{DEMO_SLOT.restaurantName}</h2><p className="mt-1 text-sm text-stone-500">{DEMO_SLOT.date} {DEMO_SLOT.time} / {DEMO_SLOT.guests}名</p><div className="my-5 border-y border-stone-100 py-5">{rescueOfferType === 'discount' ? <><p className="text-xs text-stone-400 line-through">通常 {formatYen(DEMO_SLOT.originalPrice)}</p><p className="text-4xl font-black text-orange-500">{formatYen(DEMO_SLOT.rescuePrice)}</p><p className="text-sm font-bold text-orange-600">20% OFF</p></> : <><p className="text-4xl font-black">{formatYen(DEMO_SLOT.originalPrice)}</p><p className="mt-1 font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p></>}</div><p className="text-xs font-bold text-stone-400">店舗からひとこと</p><p className="mt-1 text-sm leading-relaxed text-stone-600">{STORE_COMMENT}</p></div>
    <button disabled={publishing || published || rescueStatus !== 'cancelled'} onClick={publish} className="mt-5 w-full rounded-2xl bg-orange-500 py-5 text-lg font-bold text-white disabled:opacity-60">{published ? '出品しました ✓' : publishing ? 'お客さまへ公開中...' : 'この内容で出品を確定する'}</button>
    <p className="mt-3 text-center text-xs text-stone-400">出品後は店舗ダッシュボードへ戻ります</p>
  </div></main></RoleGate>
}
