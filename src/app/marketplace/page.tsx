'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import { DEMO_SLOT, DUMMY_SLOTS, STORE_COMMENT, PERK_DESCRIPTION } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function MarketplacePage() {
  const router = useRouter()
  const { rescueStatus, rescueOfferType, completeReservation } = useRescue()
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    if (rescueStatus !== 'listed') {
      router.replace('/store')
    }
  }, [rescueStatus, router])

  function handleReserve() {
    completeReservation()
    router.push('/store/rescued')
  }

  const slot = DEMO_SLOT
  const discountPct = Math.round(slot.discountRate * 100)
  const isPerk = rescueOfferType === 'perk'

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <div className="border-b border-stone-200 bg-white px-4 py-5">
        <div className="mx-auto max-w-2xl">
          <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-600 uppercase">
            Fill Food — お客さま向け
          </p>
          <h1 className="mt-0.5 text-xl font-bold text-stone-900">キャンセル枠マーケットプレイス</h1>
          <p className="mt-0.5 text-sm text-stone-500">直前キャンセルが出た特別な枠を、今すぐ予約</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">

        {/* Featured slot */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          {/* JUST CANCELLED banner */}
          <div className="flex items-center gap-2 bg-orange-500 px-5 py-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">
              Just Cancelled
            </span>
            <span className="ml-auto text-xs font-bold text-orange-100">残り 1 枠</span>
          </div>

          <div className="px-5 py-5">
            {/* Store info */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">{slot.restaurantName}</h2>
                <span className="mt-1 inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                  {slot.category}
                </span>
              </div>
              {isPerk ? (
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
                  特典付き
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Reservation details */}
            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-stone-500">
              <span>📅 {slot.date}</span>
              <span>🕖 {slot.time}〜</span>
              <span>👥 {slot.guests}名</span>
            </div>

            {/* Price */}
            <div className="mb-3 border-t border-stone-100 pt-4">
              {isPerk ? (
                <div>
                  <p className="mb-0.5 text-xs text-stone-400">通常価格</p>
                  <p className="text-4xl font-black tabular-nums text-stone-900">
                    {formatYen(slot.originalPrice)}
                  </p>
                  <div className="mt-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
                      + {PERK_DESCRIPTION}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-4">
                  <div>
                    <p className="mb-0.5 text-xs text-stone-400">通常</p>
                    <p className="text-lg font-medium text-stone-400 line-through tabular-nums">
                      {formatYen(slot.originalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs text-orange-500">特別価格</p>
                    <p className="text-4xl font-black tabular-nums text-orange-500">
                      {formatYen(slot.rescuePrice)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social proof */}
            <p className="mb-4 text-xs text-stone-400">👀 3人がこの枠を見ています</p>

            {/* Store comment */}
            <div className="mb-4 rounded-xl bg-stone-50 px-4 py-3">
              <p className="mb-1 text-[10px] font-bold text-stone-400">店舗からひとこと</p>
              <p className="text-sm leading-relaxed text-stone-600">{STORE_COMMENT}</p>
              <p className="mt-1 text-xs text-stone-400">— {slot.restaurantName} 店主</p>
            </div>

            {/* Detail toggle */}
            <button
              onClick={() => setShowDetail((d) => !d)}
              className="mb-4 text-xs text-stone-400 transition-colors hover:text-stone-600"
            >
              {showDetail ? '▲ 詳細を閉じる' : '▼ 店舗詳細を見る'}
            </button>

            {showDetail && (
              <div className="mb-4 rounded-xl border border-stone-200 p-4 text-sm">
                <p className="font-bold text-stone-900">{slot.restaurantName}</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {slot.category} / 佐賀駅から徒歩5分
                </p>
                <p className="text-xs text-stone-500">カウンター 8席</p>
                <div className="mt-3 border-t border-stone-100 pt-3">
                  <p className="text-xs text-stone-400">通常価格</p>
                  <p className="font-bold text-stone-800">{formatYen(slot.originalPrice)}</p>
                  {isPerk ? (
                    <>
                      <p className="mt-1 text-xs text-stone-400">今回の特典</p>
                      <p className="font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-xs text-stone-400">今回の条件</p>
                      <p className="font-bold text-orange-500">
                        {formatYen(slot.rescuePrice)} ({discountPct}% OFF)
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleReserve}
              disabled={rescueStatus !== 'listed'}
              className="w-full rounded-xl bg-emerald-500 py-4 text-base font-bold text-white transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50"
            >
              今すぐ予約する
            </button>
          </div>
        </div>

        {/* Other listings */}
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-400">
          ほかのキャンセル枠
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DUMMY_SLOTS.map((s) => {
            const pct = Math.round(s.discountRate * 100)
            return (
              <div
                key={s.id}
                className="rounded-xl border border-stone-200 bg-white p-4 opacity-60"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{s.restaurantName}</p>
                    <p className="mt-0.5 text-[10px] text-stone-400">{s.category}</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">
                    {pct}% OFF
                  </span>
                </div>
                <p className="mb-1 text-xs text-stone-400">
                  {s.date} {s.time} / {s.guests}名
                </p>
                <p className="text-lg font-bold tabular-nums text-stone-700">
                  {formatYen(s.rescuePrice)}
                </p>
                <p className="mt-1 text-[10px] text-stone-400 line-through">
                  {formatYen(s.originalPrice)}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
