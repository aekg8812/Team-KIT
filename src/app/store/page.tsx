'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRescue } from '@/context/RescueContext'
import KpiCard from '@/components/rescue/KpiCard'
import StepIndicator from '@/components/rescue/StepIndicator'
import RecoveryGauge from '@/components/rescue/RecoveryGauge'
import MonthlyChart from '@/components/rescue/MonthlyChart'
import RoleGate from '@/components/navigation/RoleGate'
import StoreNavigation from '@/components/navigation/StoreNavigation'
import DemoRoleSwitch from '@/components/navigation/DemoRoleSwitch'
import { formatYen } from '@/lib/rescue/kpi'
import { CUMULATIVE_RECOVERY_GMV, DEMO_SLOT, PERK_DESCRIPTION } from '@/lib/rescue/data'

function getActiveStep(status: string): number {
  switch (status) {
    case 'cancelled': return 0
    case 'listed':    return 1
    case 'reserved':  return 3
    default:          return -1
  }
}

export default function StoreDashboardPage() {
  const router = useRouter()
  const { rescueStatus, rescueOfferType, kpi, pendingHighlight, consumeHighlight, startCancel, resetDemo } =
    useRescue()

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

  function handleReset() {
    resetDemo()
    window.location.assign('/')
  }

  return (
    <RoleGate role="restaurant">
    <div className="min-h-screen bg-stone-50 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-8">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-orange-500 uppercase">
              Fill Food — 飲食店向け
            </p>
            <h1 className="mt-0.5 text-2xl font-bold text-stone-900">店舗ダッシュボード</h1>
            <p className="mt-0.5 text-sm text-stone-500">鮨 佐賀</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DemoRoleSwitch to="customer" />
            <button onClick={handleReset} className="text-xs text-stone-400 hover:text-stone-600">Reset Demo</button>
          </div>
        </div>

        {/* Step Indicator */}
        {rescueStatus !== 'idle' && (
          <div className="mb-5 rounded-xl border border-stone-200 bg-white px-4 py-3">
            <StepIndicator activeStep={getActiveStep(rescueStatus)} />
          </div>
        )}

        {/* Status Banner */}
        {rescueStatus === 'cancelled' && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <span className="text-sm font-medium text-red-600">
              ⚠ 本日 19:00 鮨 佐賀 のキャンセルが発生しました
            </span>
            <Link
              href="/store/cancel"
              className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
            >
              詳細を見る →
            </Link>
          </div>
        )}
        {rescueStatus === 'listed' && (
          <div className="mb-5 rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">🔥 Rescue出品中</p>
                <h2 className="mt-2 text-xl font-bold text-stone-900">{DEMO_SLOT.restaurantName}</h2>
                <p className="mt-1 text-sm text-stone-500">{DEMO_SLOT.date} {DEMO_SLOT.time} / {DEMO_SLOT.guests}名</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600">お客さまへ公開中</span>
            </div>
            <div className="mt-4 border-t border-orange-200 pt-4">
              {rescueOfferType === 'discount' ? <div className="flex items-end gap-3"><div><p className="text-xs text-stone-500">特別価格</p><p className="text-3xl font-black text-orange-500">{formatYen(DEMO_SLOT.rescuePrice)}</p></div><span className="mb-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">20% OFF</span></div> : <div><p className="text-3xl font-black">{formatYen(DEMO_SLOT.originalPrice)}</p><p className="mt-1 text-sm font-bold text-emerald-600">+ {PERK_DESCRIPTION}</p></div>}
              <Link href="/store/cancel" className="mt-4 inline-block text-sm font-bold text-orange-600">出品内容を見る →</Link>
            </div>
          </div>
        )}
        {rescueStatus === 'reserved' && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="text-sm font-medium text-emerald-700">
              ✓ 予約が成立しました — 売上を回収しました
            </span>
          </div>
        )}

        {/* Hero KPI */}
        <div
          className={[
            'mb-4 rounded-2xl border p-8',
            pendingHighlight
              ? 'border-emerald-400 bg-emerald-50 animate-[kpi-highlight_2.5s_ease-out_forwards]'
              : 'border-stone-200 bg-white',
          ].join(' ')}
        >
          <p className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase">
            今月救った売上
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">Recovered GMV</p>
          <p className="mt-3 text-6xl font-black tabular-nums text-emerald-600">
            {formatYen(kpi.recoveredGMV)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            今月のキャンセル損失{' '}
            <span className="font-bold text-red-500">{formatYen(kpi.cancellationGMV)}</span>{' '}
            のうち
          </p>
        </div>

        {/* Recovery Rate + Cumulative */}
        <div id="data" className="mb-4 grid scroll-mt-6 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <RecoveryGauge rate={kpi.recoveryRate} />
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase">
              累計救出売上
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Cumulative Recovered</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-stone-800">
              {formatYen(CUMULATIVE_RECOVERY_GMV)}
            </p>
            <p className="mt-1 text-xs text-stone-400">サービス開始来</p>
          </div>
        </div>

        {/* Support KPIs */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard
            labelJa="成約率"
            labelEn="Fill Rate"
            value={`${kpi.fillRate}%`}
            subValue={`${kpi.filledCount} / ${kpi.totalListed} 枠`}
            sentiment="neutral"
          />
          <KpiCard
            labelJa="救出した予約"
            labelEn="Filled Count"
            value={`${kpi.filledCount}件`}
            sentiment="gain"
          />
          <KpiCard
            labelJa="成功報酬売上"
            labelEn="Rescue Revenue"
            value={formatYen(kpi.rescueRevenue)}
            sentiment="gain"
          />
        </div>

        {/* Monthly Chart */}
        <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5">
          <p className="mb-4 text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase">
            月別の回収売上
          </p>
          <MonthlyChart />
        </div>

        {/* Action Area */}
        {rescueStatus === 'idle' && (
          <div className="mx-auto max-w-xl">
            <button
              onClick={handleSimulate}
              className="group w-full rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 text-left transition-all hover:border-orange-400 hover:bg-orange-100"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-lg text-orange-500">
                  ⚡
                </span>
                <span className="font-bold text-stone-800 group-hover:text-orange-700">
                  キャンセルをシミュレートする
                </span>
              </div>
              <p className="pl-12 text-sm text-stone-500">
                このボタンでデモを開始 ― 損失発生 → RESCUE → 売上回収
              </p>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t border-stone-200 pt-6">
          <p className="text-center text-xs text-stone-400">
            成功報酬型 ― 売上が回収できた時だけ 10% / 初期費用 ¥0 / 月額固定費 ¥0
          </p>
        </div>

      </div>
      <StoreNavigation />
    </div>
    </RoleGate>
  )
}
