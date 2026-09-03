'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRescue } from '@/context/RescueContext'
import KpiCard from '@/components/rescue/KpiCard'
import { formatYen } from '@/lib/rescue/kpi'

export default function StoreDashboardPage() {
  const router = useRouter()
  const { rescueStatus, kpi, pendingHighlight, consumeHighlight, startCancel, resetDemo } =
    useRescue()

  // After reservation: show highlight animation for 2500ms then clear it.
  // consumeHighlight is called inside a setTimeout callback (not synchronously in effect body).
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!pendingHighlight) return
    timerRef.current = setTimeout(() => {
      consumeHighlight()
    }, 2500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [pendingHighlight, consumeHighlight])

  function handleSimulate() {
    startCancel()
    router.push('/store/cancel')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* ─── Header ─── */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-orange-400 uppercase">
              FILL FOOD — RESCUE
            </div>
            <h1 className="text-2xl font-bold text-white">店舗ダッシュボード</h1>
            <p className="mt-0.5 text-sm text-zinc-500">鮨 佐賀</p>
          </div>
          <button
            onClick={resetDemo}
            className="shrink-0 rounded border border-zinc-800 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-400"
          >
            Reset Demo
          </button>
        </div>

        {/* ─── Status Banner ─── */}
        {rescueStatus === 'cancelled' && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-orange-900 bg-orange-950/40 px-4 py-3">
            <span className="text-sm font-medium text-orange-400">
              ⚠ 本日 19:00 鮨 佐賀 のキャンセルが発生しました
            </span>
            <Link href="/store/cancel" className="shrink-0 text-sm text-orange-400 hover:text-orange-300">
              詳細を見る →
            </Link>
          </div>
        )}
        {rescueStatus === 'listed' && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-sky-900 bg-sky-950/40 px-4 py-3">
            <span className="text-sm font-medium text-sky-400">
              🚀 RESCUE 出品中 — ユーザーの予約受付中
            </span>
            <Link href="/marketplace" className="shrink-0 text-sm text-sky-400 hover:text-sky-300">
              マーケットを見る →
            </Link>
          </div>
        )}
        {rescueStatus === 'reserved' && (
          <div className="mb-6 rounded-xl border border-emerald-900 bg-emerald-950/40 px-4 py-3">
            <span className="text-sm font-medium text-emerald-400">
              ✓ 予約成立 — {formatYen(8000)} の売上を回収しました
            </span>
          </div>
        )}

        {/* ─── KPI Grid — Top 3 ─── */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            labelJa="今月のキャンセル損失"
            labelEn="Cancellation GMV"
            value={formatYen(kpi.cancellationGMV)}
            sentiment="loss"
          />
          <KpiCard
            labelJa="回収できた売上"
            labelEn="Recovered GMV"
            value={formatYen(kpi.recoveredGMV)}
            sentiment="gain"
            highlighted={pendingHighlight}
          />
          <KpiCard
            labelJa="回収率"
            labelEn="Recovery Rate"
            value={`${kpi.recoveryRate}%`}
            sentiment="gain"
          />
        </div>

        {/* ─── KPI Grid — Bottom 2 ─── */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-2xl">
          <KpiCard
            labelJa="成約率"
            labelEn="Fill Rate"
            value={`${kpi.fillRate}%`}
            subValue={`${kpi.filledCount} / ${kpi.totalListed} 枠`}
            sentiment="neutral"
          />
          <KpiCard
            labelJa="成功報酬売上"
            labelEn="Rescue Revenue"
            value={formatYen(kpi.rescueRevenue)}
            sentiment="gain"
            highlighted={pendingHighlight}
          />
        </div>

        {/* ─── Action Area ─── */}
        {rescueStatus === 'idle' && (
          <div className="mx-auto max-w-xl">
            <button
              onClick={handleSimulate}
              className="group w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left transition-all hover:border-orange-800 hover:bg-zinc-800"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-950 text-orange-400 text-sm">
                  ⚡
                </span>
                <span className="font-semibold text-white group-hover:text-orange-300">
                  キャンセル発生をシミュレート
                </span>
              </div>
              <p className="pl-11 text-sm text-zinc-600">
                このボタンでデモを開始します ― 損失発生 → RESCUE → 売上回収
              </p>
            </button>
          </div>
        )}

        {/* ─── Business Model Footer ─── */}
        <div className="mt-16 border-t border-zinc-800 pt-6">
          <p className="text-center text-xs text-zinc-700">
            成功報酬型 ― 売上が回収できた時だけ 10% の手数料 / 初期費用 ¥0 / 月額固定費 ¥0
          </p>
        </div>

      </div>
    </div>
  )
}
