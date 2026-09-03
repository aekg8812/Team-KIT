'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import StepIndicator from '@/components/rescue/StepIndicator'
import { DEMO_SLOT } from '@/lib/rescue/data'
import { calcRescueBreakdown, formatYen } from '@/lib/rescue/kpi'

export default function RescuedPage() {
  const router = useRouter()
  const { rescueStatus, rescueOfferType } = useRescue()
  const [displayAmount, setDisplayAmount] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (rescueStatus !== 'reserved') {
      router.replace('/store')
    }
  }, [rescueStatus, router])

  // Count-up: starts 1s after mount, runs for 1s with easeOutCubic.
  // setDisplayAmount is called inside rAF callback — not synchronously in effect body.
  useEffect(() => {
    const storeRevenue = calcRescueBreakdown(rescueOfferType, DEMO_SLOT).storeRevenue
    const DURATION = 1000

    const delay = setTimeout(() => {
      startTimeRef.current = null
      function tick(timestamp: number) {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / DURATION, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayAmount(Math.round(storeRevenue * eased))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, 1000)

    return () => {
      clearTimeout(delay)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [rescueOfferType])

  const bd = calcRescueBreakdown(rescueOfferType, DEMO_SLOT)

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="mx-auto max-w-sm px-4 py-8">

        {/* Step Indicator */}
        <div className="mb-8 rounded-xl border border-emerald-200 bg-white px-4 py-3">
          <StepIndicator activeStep={3} />
        </div>

        <div className="text-center">

          {/* Hero: checkmark + title */}
          <div className="animate-[rescue-appear_0.65s_cubic-bezier(0.34,1.56,0.64,1)_forwards] opacity-0">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white shadow-lg">
                ✓
              </div>
            </div>
            <h1 className="text-3xl font-black text-stone-900">売上を回収しました</h1>
            <p className="mt-1 text-sm text-stone-500">キャンセル損失を売上に変換しました</p>
          </div>

          {/* Count-up amount */}
          <div
            className="mt-6 opacity-0 animate-[rescue-fade-up_0.4s_ease-out_forwards]"
            style={{ animationDelay: '0.7s' }}
          >
            <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
              店舗の実質回収
            </p>
            <p className="mt-1 text-7xl font-black tabular-nums text-emerald-600">
              +{formatYen(displayAmount)}
            </p>
          </div>

          {/* Breakdown card */}
          <div
            className="mt-8 w-full rounded-2xl border border-stone-200 bg-white p-6 opacity-0 animate-[rescue-fade-up_0.4s_ease-out_forwards]"
            style={{ animationDelay: '1.3s' }}
          >
            <p className="mb-4 text-left text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
              回収サマリー
            </p>

            <div
              className="flex items-center justify-between border-b border-stone-100 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
              style={{ animationDelay: '1.55s' }}
            >
              <span className="text-sm text-stone-500">本来の損失</span>
              <span className="text-lg font-bold tabular-nums text-red-500">
                -{formatYen(bd.originalPrice)}
              </span>
            </div>

            <div
              className="flex items-center justify-between border-b border-stone-100 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
              style={{ animationDelay: '1.85s' }}
            >
              <span className="text-sm text-stone-500">回収売上</span>
              <span className="text-lg font-bold tabular-nums text-emerald-600">
                +{formatYen(bd.rescuePrice)}
              </span>
            </div>

            <div
              className="flex items-center justify-between border-b border-stone-100 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
              style={{ animationDelay: '2.15s' }}
            >
              <span className="text-sm text-stone-500">Fill Food 手数料 (10%)</span>
              <span className="text-lg font-bold tabular-nums text-stone-400">
                -{formatYen(bd.serviceFee)}
              </span>
            </div>

            <div
              className="flex items-center justify-between pt-4 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
              style={{ animationDelay: '2.45s' }}
            >
              <span className="text-base font-semibold text-stone-800">店舗の実質回収</span>
              <span className="text-3xl font-black tabular-nums text-emerald-600">
                +{formatYen(bd.storeRevenue)}
              </span>
            </div>
          </div>

          {/* Service revenue note */}
          <div
            className="mt-4 rounded-xl border border-stone-200 bg-white px-4 py-3 opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards]"
            style={{ animationDelay: '2.75s' }}
          >
            <p className="text-xs text-stone-400">
              Fill Food にも{' '}
              <span className="font-bold text-orange-500">+{formatYen(bd.serviceFee)}</span>
              {' '}の成功報酬が発生しました
            </p>
          </div>

          {/* Return button */}
          <button
            onClick={() => router.push('/store')}
            className="mt-8 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white opacity-0 animate-[rescue-fade-up_0.35s_ease-out_forwards] transition-colors hover:bg-orange-600"
            style={{ animationDelay: '3.0s' }}
          >
            ダッシュボードで成果を見る →
          </button>

        </div>
      </div>
    </div>
  )
}
