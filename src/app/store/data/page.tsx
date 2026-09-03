'use client'

import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import StoreNavigation from '@/components/navigation/StoreNavigation'
import DemoRoleSwitch from '@/components/navigation/DemoRoleSwitch'
import KpiCard from '@/components/rescue/KpiCard'
import MonthlyChart from '@/components/rescue/MonthlyChart'
import { formatYen } from '@/lib/rescue/kpi'
import { calcCsvStats } from '@/lib/rescue/csvStats'
import { CUMULATIVE_RECOVERY_GMV } from '@/lib/rescue/data'

export default function StoreDataPage() {
  const { kpi, csvSlots, csvListingStatus } = useRescue()
  const stats = calcCsvStats(csvSlots, csvListingStatus)

  return (
    <RoleGate role="restaurant">
      <main className="min-h-screen bg-stone-50 px-4 py-8 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">Fill Food — 飲食店向け</p>
              <h1 className="mt-1 text-2xl font-bold">データ</h1>
              <p className="mt-1 text-sm text-stone-500">回収実績の詳細</p>
            </div>
            <DemoRoleSwitch to="customer" />
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-[10px] text-stone-400">Cumulative Recovered</p>
            <p className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase">累計救出売上</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-stone-800">{formatYen(CUMULATIVE_RECOVERY_GMV)}</p>
            <p className="mt-1 text-xs text-stone-400">サービス開始来</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <KpiCard labelJa="成約率" labelEn="Fill Rate" value={`${kpi.fillRate}%`} subValue={`${kpi.filledCount} / ${kpi.totalListed} 枠`} sentiment="neutral" />
            <KpiCard labelJa="救出した予約" labelEn="Filled Count" value={`${kpi.filledCount}件`} sentiment="gain" />
            <KpiCard labelJa="成功報酬売上" labelEn="Rescue Revenue" value={formatYen(kpi.rescueRevenue)} sentiment="gain" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <KpiCard
              labelJa="平均割引率"
              labelEn="Avg. Discount Rate"
              value={stats.avgDiscountRate !== null ? `${Math.round(stats.avgDiscountRate * 100)}%` : '—'}
              subValue="RESCUE成立分（値下げ型）"
              sentiment="neutral"
            />
            <KpiCard
              labelJa="平均回収単価"
              labelEn="Avg. Recovered Price"
              value={stats.avgRecoveredPrice !== null ? formatYen(stats.avgRecoveredPrice) : '—'}
              subValue="RESCUE成立分（全体）"
              sentiment="gain"
            />
            <KpiCard
              labelJa="削減できた食品ロス"
              labelEn="Food Waste Reduced"
              value={stats.reservedCount > 0 ? `${stats.foodWasteKg}kg` : '—'}
              subValue={stats.reservedCount > 0 ? `${stats.mealsSaved}食分（推定）` : 'RESCUE成立分から算出'}
              sentiment="gain"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="mb-4 text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase">月別の回収売上</p>
            <MonthlyChart />
          </div>

          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase">時間帯別の回収内訳</p>
            {stats.byTimeBand.length === 0 ? (
              <p className="mt-3 text-sm text-stone-400">まだRESCUE成立の実績がありません。</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {stats.byTimeBand.map((row) => (
                  <li key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">{row.label} <span className="text-xs text-stone-400">×{row.count}</span></span>
                    <span className="font-bold tabular-nums text-stone-800">{formatYen(row.recoveredTotal)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <StoreNavigation />
      </main>
    </RoleGate>
  )
}
