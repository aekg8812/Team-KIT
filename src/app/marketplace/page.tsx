'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import { DEMO_SLOT, DUMMY_SLOTS } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function MarketplacePage() {
  const router = useRouter()
  const { rescueStatus, completeReservation } = useRescue()

  // State guard: router redirect (not setState) — safe for react-hooks/set-state-in-effect.
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ─── Header ─── */}
      <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-5">
        <div className="mx-auto max-w-2xl">
          <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-orange-400 uppercase">
            FILL FOOD
          </p>
          <h1 className="text-xl font-bold text-white">キャンセル枠マーケットプレイス</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            直前キャンセルが出た特別な枠を、今すぐ予約
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">

        {/* ─── Featured Slot: 鮨 佐賀 ─── */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-orange-800 bg-zinc-900">

          {/* JUST CANCELLED banner */}
          <div className="flex items-center gap-2 bg-orange-600 px-5 py-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">
              Just Cancelled
            </span>
            <span className="ml-auto text-xs font-bold text-orange-200">
              残り 1 枠
            </span>
          </div>

          <div className="px-5 py-5">
            {/* Store info */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">{slot.restaurantName}</h2>
                <span className="mt-1 inline-block rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                  {slot.category}
                </span>
              </div>
              <div className="shrink-0 rounded-full bg-orange-950 px-3 py-1 text-sm font-bold text-orange-400">
                {discountPct}% OFF
              </div>
            </div>

            {/* Reservation details */}
            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-zinc-400">
              <span>📅 {slot.date}</span>
              <span>🕖 {slot.time}〜</span>
              <span>👥 {slot.guests}名</span>
            </div>

            {/* Price */}
            <div className="mb-1 flex items-end gap-4 border-t border-zinc-800 pt-4">
              <div>
                <p className="mb-0.5 text-xs text-zinc-600">通常</p>
                <p className="text-lg font-medium text-zinc-600 line-through tabular-nums">
                  {formatYen(slot.originalPrice)}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs text-orange-500">RESCUE PRICE</p>
                <p className="text-4xl font-black tabular-nums text-orange-400">
                  {formatYen(slot.rescuePrice)}
                </p>
              </div>
            </div>

            {/* Social proof */}
            <p className="mb-5 text-xs text-zinc-600">👀 3人がこの枠を見ています</p>

            {/* CTA */}
            <button
              onClick={handleReserve}
              disabled={rescueStatus !== 'listed'}
              className="w-full rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50"
            >
              今すぐ予約する
            </button>
          </div>
        </div>

        {/* ─── Other Listings ─── */}
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">
          ほかのキャンセル枠
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DUMMY_SLOTS.map((s) => {
            const pct = Math.round(s.discountRate * 100)
            return (
              <div
                key={s.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 opacity-60"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{s.restaurantName}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-600">{s.category}</p>
                  </div>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                    {pct}% OFF
                  </span>
                </div>
                <p className="mb-1 text-xs text-zinc-500">
                  {s.date} {s.time} / {s.guests}名
                </p>
                <p className="text-lg font-bold tabular-nums text-zinc-300">
                  {formatYen(s.rescuePrice)}
                </p>
                <p className="mt-2 text-[10px] text-zinc-700 line-through">
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
