'use client'

import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import type { UserRole } from '@/lib/rescue/types'

export default function DemoRoleSwitch({ to }: { to: UserRole }) {
  const router = useRouter()
  const { rescueStatus, beginRoleSwitch } = useRescue()

  function handleSwitch() {
    beginRoleSwitch(to)
    if (to === 'customer') {
      router.push('/customer/rescues')
      return
    }
    router.push(rescueStatus === 'reserved' ? '/store/rescued' : '/store')
  }

  return (
    <button
      onClick={handleSwitch}
      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 shadow-sm transition-colors hover:border-stone-300 hover:text-stone-700"
    >
      <span className="mr-1 text-[10px] text-stone-400">デモ用</span>
      {to === 'customer' ? 'お客さま画面へ' : '飲食店画面へ'} →
    </button>
  )
}
