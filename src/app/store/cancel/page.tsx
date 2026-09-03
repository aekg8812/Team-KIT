'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRescue } from '@/context/RescueContext'
import StepIndicator from '@/components/rescue/StepIndicator'
import { DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'
import type { RescueOfferType } from '@/lib/rescue/types'

export default function CancelPage() {
  const router = useRouter()
  const { rescueStatus, startRescue, setRescueOfferType } = useRescue()
  const [selectedOffer, setSelectedOffer] = useState<RescueOfferType>('discount')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    if (rescueStatus !== 'cancelled') {
      router.replace('/store')
    }
  }, [rescueStatus, router])

  const slot = DEMO_SLOT
  const discountPct = Math.round(slot.discountRate * 100)

  function handlePublish() {
    setRescueOfferType(selectedOffer)
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setIsPublished(true)
      setTimeout(() => {
        startRescue()
        router.push('/marketplace')
      }, 400)
    }, 700)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Nav */}
        <Link
          href="/store"
          className="mb-6 flex w-fit items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700"
        >
          ← ダッシュボードへ戻る
        </Link>

        <p className="mb-4 text-[10px] font-bold tracking-[0.25em] text-orange-500 uppercase">
          Fill Food — 飲食店向け
        </p>

        {/* Step Indicator */}
        <div className="mb-6 rounded-xl border border-stone-200 bg-white px-4 py-3">
          <StepIndicator activeStep={0} />
        </div>

        {/* Store header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-stone-900">{slot.restaurantName}</h1>
          <span className="mt-1 inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
            {slot.category}
          </span>
        </div>

        {/* Reservation info */}
        <div className="mb-4 rounded-xl border border-stone-200 bg-white px-5 py-4">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
            キャンセルされた予約
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-stone-600">
            <span>📅 {slot.date}</span>
            <span>🕖 {slot.time}</span>
            <span>👥 {slot.guests}名</span>
            <span>💴 通常 {formatYen(slot.originalPrice)}</span>
          </div>
        </div>

        {/* LOSS card */}
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-6 py-6 animate-[loss-pulse_2s_ease-in-out_3]">
          <p className="mb-3 text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase">
            ⚠ キャンセルが発生しました
          </p>
          <p className="mb-1 text-sm text-red-400">予想損失</p>
          <p className="text-5xl font-black tabular-nums text-red-600">
            -{formatYen(slot.originalPrice)}
          </p>
          <p className="mt-2 text-xs text-red-400">このままでは売上がゼロになります</p>
        </div>

        {/* Rescue method selection */}
        <p className="mb-3 text-sm font-bold text-stone-700">Rescue 方式を選択</p>
        <div className="mb-5 grid grid-cols-2 gap-3">

          {/* Option A: Discount */}
          <button
            onClick={() => setSelectedOffer('discount')}
            className={[
              'rounded-xl border-2 p-4 text-left transition-all',
              selectedOffer === 'discount'
                ? 'border-orange-400 bg-orange-50'
                : 'border-stone-200 bg-white hover:border-stone-300',
            ].join(' ')}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-orange-500">おすすめ</span>
              {selectedOffer === 'discount' && (
                <span className="text-[10px] font-bold text-orange-500">✓</span>
              )}
            </div>
            <p className="text-sm font-bold text-stone-800">値下げして再販売</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xs text-stone-400 line-through">{formatYen(slot.originalPrice)}</span>
              <span className="text-lg font-black text-orange-500">{formatYen(slot.rescuePrice)}</span>
            </div>
            <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
              {discountPct}% OFF
            </span>
          </button>

          {/* Option B: Perk */}
          <button
            onClick={() => setSelectedOffer('perk')}
            className={[
              'rounded-xl border-2 p-4 text-left transition-all',
              selectedOffer === 'perk'
                ? 'border-orange-400 bg-orange-50'
                : 'border-stone-200 bg-white hover:border-stone-300',
            ].join(' ')}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-stone-400">価格維持</span>
              {selectedOffer === 'perk' && (
                <span className="text-[10px] font-bold text-orange-500">✓</span>
              )}
            </div>
            <p className="text-sm font-bold text-stone-800">価格を維持して特典追加</p>
            <div className="mt-2">
              <span className="text-lg font-black text-stone-800">{formatYen(slot.originalPrice)}</span>
            </div>
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              + {PERK_DESCRIPTION}
            </span>
          </button>

        </div>

        {/* Preview card */}
        <div className="mb-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="mb-3 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
            利用者画面プレビュー
          </p>
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="bg-orange-500 px-4 py-1.5">
              <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">
                Just Cancelled
              </span>
            </div>
            <div className="p-4">
              <p className="font-bold text-stone-900">{slot.restaurantName}</p>
              <p className="mt-0.5 text-xs text-stone-400">
                {slot.date} {slot.time} / {slot.guests}名
              </p>
              <div className="mt-3">
                {selectedOffer === 'discount' ? (
                  <div className="flex items-end gap-2">
                    <span className="text-sm text-stone-400 line-through">{formatYen(slot.originalPrice)}</span>
                    <span className="text-2xl font-black text-orange-500">{formatYen(slot.rescuePrice)}</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                      {discountPct}% OFF
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-2xl font-black text-stone-800">{formatYen(slot.originalPrice)}</span>
                    <div className="mt-1">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        + {PERK_DESCRIPTION}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Publish CTA */}
        <button
          onClick={handlePublish}
          disabled={rescueStatus !== 'cancelled' || isPublishing || isPublished}
          className="w-full rounded-2xl bg-orange-500 py-5 text-lg font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60"
        >
          {isPublished
            ? '掲載しました ✓'
            : isPublishing
            ? 'ユーザーへ配信中...'
            : 'この内容でキャンセル枠を出品する'}
        </button>

        <p className="mt-3 text-center text-xs text-stone-400">
          出品後、マーケットプレイスに即時掲載されます
        </p>

      </div>
    </div>
  )
}
