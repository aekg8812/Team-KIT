'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import { RESCUE_BREAKDOWN } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

export default function RescuedPage() {
  const router = useRouter()
  const { rescueStatus } = useRescue()

  // State guard: redirect to dashboard if reservation hasn't been completed.
  useEffect(() => {
    if (rescueStatus !== 'reserved') {
      router.replace('/store')
    }
  }, [rescueStatus, router])

  const bd = RESCUE_BREAKDOWN

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-16 text-white">
      <div className="w-full max-w-sm text-center">

        {/* ─── RESCUED Title ─── */}
        <div className="animate-[rescue-appear_0.65s_cubic-bezier(0.34,1.56,0.64,1)_forwards] opacity-0">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-4xl">
              ✓
            </div>
          </div>
          <h1 className="text-7xl font-black tracking-tight text-white">RESCUED</h1>
          <p className="mt-2 text-sm text-zinc-500">
            キャンセル損失を売上に変換しました
          </p>
        </div>

        {/* ─── Breakdown Card ─── */}
        <div
          className="mt-8 w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 opacity-0 animate-[rescue-fade-up_0.4s_ease-out_forwards]"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="mb-4 text-left text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
            回収サマリー
          </p>

          {/* Row 1: Original loss */}
          <div
            className="flex items-center justify-between border-b border-zinc-800 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
            style={{ animationDelay: '0.95s' }}
          >
            <span className="text-sm text-zinc-400">本来の損失</span>
            <span className="text-lg font-bold tabular-nums text-red-400">
              -{formatYen(bd.originalPrice)}
            </span>
          </div>

          {/* Row 2: Recovered revenue */}
          <div
            className="flex items-center justify-between border-b border-zinc-800 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
            style={{ animationDelay: '1.3s' }}
          >
            <span className="text-sm text-zinc-400">回収売上</span>
            <span className="text-lg font-bold tabular-nums text-emerald-400">
              +{formatYen(bd.rescuePrice)}
            </span>
          </div>

          {/* Row 3: Service fee */}
          <div
            className="flex items-center justify-between border-b border-zinc-800 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
            style={{ animationDelay: '1.65s' }}
          >
            <span className="text-sm text-zinc-400">サービス手数料 (10%)</span>
            <span className="text-lg font-bold tabular-nums text-zinc-500">
              -{formatYen(bd.serviceFee)}
            </span>
          </div>

          {/* Row 4: Net revenue — highlighted */}
          <div
            className="flex items-center justify-between pt-4 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
            style={{ animationDelay: '2.0s' }}
          >
            <span className="text-base font-semibold text-white">店舗の実質回収</span>
            <span className="text-3xl font-black tabular-nums text-emerald-400">
              +{formatYen(bd.storeRevenue)}
            </span>
          </div>
        </div>

        {/* ─── Service Revenue Note ─── */}
        <div
          className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
          style={{ animationDelay: '2.3s' }}
        >
          <p className="text-xs text-zinc-500">
            FILL FOOD の成功報酬{' '}
            <span className="font-bold text-orange-400">+{formatYen(bd.serviceFee)}</span>
            {' '}が発生しました
          </p>
        </div>

        {/* ─── Return Button ─── */}
        <button
          onClick={() => router.push('/store')}
          className="mt-8 w-full rounded-xl border border-zinc-700 bg-zinc-800 py-3.5 text-sm font-medium text-white opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards] transition-colors hover:bg-zinc-700"
          style={{ animationDelay: '2.6s' }}
        >
          ダッシュボードへ戻る →
        </button>

      </div>
    </div>
  )
}
