import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { RescueProvider } from '@/context/RescueContext'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: '救席 — キャンセル損失回収サービス',
  description: '飲食店のキャンセル損失を売上に変える。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <RescueProvider>
          {children}
        </RescueProvider>
      </body>
    </html>
  )
}
