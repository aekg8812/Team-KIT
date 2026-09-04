'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import type { UserRole } from '@/lib/rescue/types'

export default function RoleSelectPage() {
  const router = useRouter()
  const { hydrated, selectRole } = useRescue()

  function choose(role: UserRole) {
    selectRole(role)
    router.push(role === 'customer' ? '/customer/rescues' : '/store')
  }

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-10 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-stone-500">← 戻る</Link>
        <div className="mt-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-500">救席</p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">どちらで利用しますか？</h1>
          <p className="mt-2 text-sm text-stone-500">デモではゲストとしてすぐに始められます</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <button disabled={!hydrated} onClick={() => choose('customer')} className="rounded-2xl border-2 border-transparent bg-white p-7 text-left shadow-sm transition hover:border-emerald-300 disabled:opacity-50">
            <span className="text-3xl">🍽️</span>
            <h2 className="mt-4 text-xl font-bold">お客さまとして使う</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">キャンセルで空いた人気店を<br />今だけの条件で予約できます。</p>
            <p className="mt-6 font-bold text-emerald-600">ゲストではじめる →</p>
          </button>
          <button disabled={!hydrated} onClick={() => choose('restaurant')} className="rounded-2xl border-2 border-transparent bg-white p-7 text-left shadow-sm transition hover:border-orange-300 disabled:opacity-50">
            <span className="text-3xl">🏮</span>
            <h2 className="mt-4 text-xl font-bold">飲食店として使う</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">キャンセルで失う予定だった売上を<br />RESCUE出品で取り戻します。</p>
            <p className="mt-6 font-bold text-orange-600">ゲストではじめる →</p>
          </button>
        </div>
      </div>
    </main>
  )
}
