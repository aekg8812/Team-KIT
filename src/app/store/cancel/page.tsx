'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRescue } from '@/context/RescueContext'
import { DEMO_SLOT } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function CancelPage() {
  const router = useRouter()
  const { rescueStatus, startRescue } = useRescue()

  // State guard: redirect to dashboard if cancellation hasn't been initiated.
  // router.replace is not setState, so it doesn't trigger react-hooks/set-state-in-effect.
  useEffect(() => {
    if (rescueStatus !== 'cancelled') {
      router.replace('/store')
    }
  }, [rescueStatus, router])

  function handleRescue() {
    startRescue()
    router.push('/marketplace')
  }

  const slot = DEMO_SLOT
  const discountPct = Math.round(slot.discountRate * 100)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* ─── Nav ─── */}
        <Link
          href="/store"
          className="mb-8 flex w-fit items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← ダッシュボードへ戻る
        </Link>

        {/* ─── Store Header ─── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">{slot.restaurantName}</h1>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {slot.category}
            </span>
          </div>
        </div>

        {/* ─── Reservation Info ─── */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
            キャンセルされた予約
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-300">
            <span>📅 {slot.date}</span>
            <span>🕖 {slot.time}</span>
            <span>👥 {slot.guests}名</span>
            <span>💴 通常 {formatYen(slot.originalPrice)}</span>
          </div>
        </div>

        {/* ─── LOSS DETECTED ─── */}
        <div className="mb-4 rounded-2xl border border-red-900 bg-red-950/50 px-6 py-7 animate-[loss-pulse_2s_ease-in-out_3]">
          <p className="mb-4 text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase">
            ⚠ Loss Detected
          </p>
          <p className="mb-2 text-sm text-red-400/70">予想損失</p>
          <p className="text-6xl font-black tabular-nums text-red-400">
            -{formatYen(slot.originalPrice)}
          </p>
          <p className="mt-3 text-xs text-red-900">
            このままでは売上がゼロになります
          </p>
        </div>

        {/* ─── SMART PRICING ─── */}
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-6">
          <p className="mb-4 text-[10px] font-bold tracking-[0.3em] text-orange-400 uppercase">
            Smart Pricing
          </p>

          <div className="mb-5 grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-zinc-500">予約まで</span>
            <span className="font-medium text-white">{slot.minutesUntil}分</span>
            <span className="text-zinc-500">推奨値引率</span>
            <span className="font-medium text-orange-400">{discountPct}% OFF</span>
          </div>

          <div className="flex items-end gap-4 border-t border-zinc-800 pt-5">
            <div>
              <p className="mb-1 text-xs text-zinc-500">通常価格</p>
              <p className="text-xl font-medium text-zinc-500 line-through tabular-nums">
                {formatYen(slot.originalPrice)}
              </p>
            </div>
            <span className="pb-0.5 text-2xl text-zinc-600">→</span>
            <div>
              <p className="mb-1 text-xs text-orange-500">RESCUE PRICE</p>
              <p className="text-4xl font-black tabular-nums text-orange-400">
                {formatYen(slot.rescuePrice)}
              </p>
            </div>
            <span className="mb-1 self-end rounded-full bg-orange-950 px-2.5 py-0.5 text-xs font-bold text-orange-400">
              {discountPct}% OFF
            </span>
          </div>
        </div>

        {/* ─── RESCUE Button ─── */}
        <button
          onClick={handleRescue}
          disabled={rescueStatus !== 'cancelled'}
          className="w-full rounded-2xl bg-orange-600 py-5 text-lg font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50"
        >
          RESCUE 開始 — 今すぐ出品する
        </button>

        <p className="mt-3 text-center text-xs text-zinc-700">
          出品後、ユーザー向けマーケットプレイスに即時掲載されます
        </p>

      </div>
    </div>
  )
}
