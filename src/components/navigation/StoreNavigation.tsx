'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { label: 'ホーム', href: '/store' },
  { label: '出品', href: '/store/cancel' },
  { label: 'データ', href: '/store#data' },
]

export default function StoreNavigation() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-around">
        {ITEMS.map((item) => {
          const active = item.href === '/store'
            ? pathname === '/store'
            : pathname.startsWith('/store/cancel') && item.href === '/store/cancel'
          return <Link key={item.label} href={item.href} className={`rounded-lg px-5 py-2 text-xs font-bold ${active ? 'bg-orange-50 text-orange-600' : 'text-stone-400'}`}>{item.label}</Link>
        })}
      </div>
    </nav>
  )
}
