'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CustomerNavigation() {
  const pathname = usePathname()
  const historyActive = pathname === '/customer/reservations'
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-sm justify-around">
        <Link href="/customer/rescues" className={`rounded-lg px-8 py-2 text-xs font-bold ${!historyActive ? 'bg-emerald-50 text-emerald-700' : 'text-stone-400'}`}>RESCUE枠</Link>
        <Link href="/customer/reservations" className={`rounded-lg px-8 py-2 text-xs font-bold ${historyActive ? 'bg-emerald-50 text-emerald-700' : 'text-stone-400'}`}>予約履歴</Link>
      </div>
    </nav>
  )
}
