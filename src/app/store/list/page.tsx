'use client'

import { useState } from 'react'
import { useRescue } from '@/context/RescueContext'
import RoleGate from '@/components/navigation/RoleGate'
import StoreNavigation from '@/components/navigation/StoreNavigation'
import DemoRoleSwitch from '@/components/navigation/DemoRoleSwitch'
import CsvImportLink from '@/components/rescue/CsvImportLink'
import { formatYen } from '@/lib/rescue/kpi'
import { calcRescuePrice } from '@/lib/rescue/pricing'
import type { RescueOfferType } from '@/lib/rescue/types'

export default function StoreListPage() {
  const { csvSlots, csvListingStatus, publishCsvListing, addManualCancellation } = useRescue()
  const [course, setCourse] = useState('')
  const [price, setPrice] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('')
  const [minutesUntil, setMinutesUntil] = useState('')
  const [offerType, setOfferType] = useState<RescueOfferType>('discount')
  const [perkText, setPerkText] = useState('')
  const [comment, setComment] = useState('')

  const pending = csvSlots.filter((s) => csvListingStatus[s.id] === 'pending')
  const listed = csvSlots.filter((s) => csvListingStatus[s.id] === 'listed')
  const reserved = csvSlots.filter((s) => csvListingStatus[s.id] === 'reserved')
  const isEmpty = pending.length === 0 && listed.length === 0 && reserved.length === 0

  const originalPrice = Number(price)
  const validPrice = Number.isFinite(originalPrice) && originalPrice > 0
  const minutesNum = Number(minutesUntil)
  const validMinutes = minutesUntil.trim() !== '' && Number.isFinite(minutesNum) && minutesNum > 0
  const canSubmit = validPrice && validMinutes
  const preview = canSubmit ? calcRescuePrice(originalPrice, minutesNum) : null

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    addManualCancellation({
      originalPrice,
      minutesUntil: minutesNum,
      category: course.trim() || undefined,
      time: time.trim() || undefined,
      guests: guests ? Number(guests) : undefined,
      offerType,
      perkDescription: offerType === 'perk' ? perkText.trim() || undefined : undefined,
      comment: comment.trim() || undefined,
    })
    setCourse('')
    setPrice('')
    setTime('')
    setGuests('')
    setMinutesUntil('')
    setOfferType('discount')
    setPerkText('')
    setComment('')
  }

  return (
    <RoleGate role="restaurant">
      <main className="min-h-screen bg-stone-50 px-4 py-8 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">救席 — 飲食店向け</p>
              <h1 className="mt-1 text-2xl font-bold">出品する</h1>
              <p className="mt-0.5 text-sm text-stone-500">鮨 佐賀</p>
              <p className="mt-1 text-sm text-stone-500">発生したキャンセルをRESCUE枠として公開します</p>
            </div>
            <DemoRoleSwitch to="customer" />
          </div>

          <form onSubmit={handleAdd} className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">キャンセルを登録</p>
            <p className="mt-1 text-xs text-stone-400">通常価格だけ入力すればRESCUE価格が自動計算されます。内容を確認してから「出品する」で公開されます。</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="コース名 (任意)" className="col-span-2 rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-1" />
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min={1} placeholder="通常価格 (円)" required className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="時間 (例 19:00)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input value={guests} onChange={(e) => setGuests(e.target.value)} type="number" min={1} placeholder="人数" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            </div>
            <input value={minutesUntil} onChange={(e) => setMinutesUntil(e.target.value)} type="number" min={1} placeholder="予約までの残り分数 (必須、例 60)" required className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />

            {canSubmit && preview && (
              <>
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">予想損失</p>
                  <p className="text-3xl font-black text-red-600">-{formatYen(originalPrice)}</p>
                </div>

                <p className="mt-4 text-xs font-bold text-stone-700">RESCUE方式を選択</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setOfferType('discount')} className={`rounded-xl border-2 p-3 text-left ${offerType === 'discount' ? 'border-orange-400 bg-orange-50' : 'border-stone-200 bg-white'}`}>
                    <p className="text-[10px] font-bold text-orange-500">おすすめ</p>
                    <p className="mt-1 text-xs font-bold">値下げして再販売</p>
                    <p className="mt-2 text-xs text-stone-400 line-through">{formatYen(originalPrice)}</p>
                    <p className="text-lg font-black text-orange-500">{formatYen(preview.rescuePrice)}</p>
                    <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">{Math.round(preview.discountRate * 100)}% OFF</span>
                  </button>
                  <button type="button" onClick={() => setOfferType('perk')} className={`rounded-xl border-2 p-3 text-left ${offerType === 'perk' ? 'border-orange-400 bg-orange-50' : 'border-stone-200 bg-white'}`}>
                    <p className="text-[10px] font-bold text-stone-400">価格維持</p>
                    <p className="mt-1 text-xs font-bold">価格維持 + 特典</p>
                    <p className="mt-4 text-lg font-black">{formatYen(originalPrice)}</p>
                  </button>
                </div>
                {offerType === 'perk' && (
                  <input value={perkText} onChange={(e) => setPerkText(e.target.value)} placeholder="特典内容 (例: ドリンク1杯サービス)" className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                )}
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="店舗からひとこと (任意)" rows={2} className="mt-3 w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              </>
            )}

            <button type="submit" disabled={!canSubmit} className="mt-4 w-full rounded-xl bg-stone-800 py-3 text-sm font-bold text-white hover:bg-stone-700 disabled:opacity-50">この内容で登録する</button>
          </form>

          {isEmpty && (
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <p className="text-4xl">📭</p>
              <p className="mt-4 font-bold text-stone-800">現在、出品できるキャンセルはありません。</p>
              <p className="mt-1 text-sm text-stone-500">上のフォームまたは店舗データの読み込みで登録するとここに表示されます。</p>
            </div>
          )}

          {pending.length > 0 && (
            <section className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">未出品のキャンセル（{pending.length}件）</p>
              <div className="mt-3 space-y-3">
                {pending.map((slot) => (
                  <article key={slot.id} className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">⚠ キャンセル</p>
                        <h2 className="mt-1 text-lg font-bold text-stone-900">{slot.category}</h2>
                        <p className="mt-1 text-xs text-stone-500">{slot.date} {slot.time} / {slot.guests}名</p>
                      </div>
                      <p className="shrink-0 text-2xl font-black text-red-600">-{formatYen(slot.originalPrice)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-red-200 pt-4">
                      <div>
                        {slot.offerType === 'discount' ? (
                          <>
                            <p className="text-xs text-stone-400 line-through">{formatYen(slot.originalPrice)}</p>
                            <p className="text-xl font-black text-orange-500">{formatYen(slot.rescuePrice)} <span className="text-xs">{Math.round(slot.discountRate * 100)}% OFF</span></p>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-black">{formatYen(slot.originalPrice)}</p>
                            <p className="text-xs font-bold text-emerald-600">+ {slot.perkDescription}</p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => publishCsvListing(slot.id)}
                        className="shrink-0 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                      >
                        出品する
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {listed.length > 0 && (
            <section className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">公開中（{listed.length}件）</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {listed.map((slot) => (
                  <article key={slot.id} className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">🔥 公開中</p>
                    <h2 className="mt-1 font-bold">{slot.category}</h2>
                    <p className="mt-1 text-xs text-stone-500">{slot.date} {slot.time} / {slot.guests}名</p>
                    <p className="mt-2 text-lg font-bold text-orange-600">{formatYen(slot.rescuePrice)}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {reserved.length > 0 && (
            <section className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">予約成立（{reserved.length}件）</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {reserved.map((slot) => (
                  <article key={slot.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">✓ 予約成立</p>
                    <h2 className="mt-1 font-bold">{slot.category}</h2>
                    <p className="mt-2 text-lg font-bold text-emerald-700">{formatYen(slot.rescuePrice)}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <CsvImportLink />
        </div>
        <StoreNavigation />
      </main>
    </RoleGate>
  )
}
