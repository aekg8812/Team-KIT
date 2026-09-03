import { calcRescuePrice } from './pricing'
import { DEMO_SLOT } from './data'
import type { CsvSlot } from './types'

// Expected CSV header (UTF-8, comma-separated, quoted fields supported):
// id,店舗名,ジャンル,説明,コメント,場所,日付,時間,人数,通常価格,残り分数,特典
// - id: optional, auto-generated when blank
// - 店舗名, 通常価格: required
// - 特典: when set, the row becomes a perk offer (price kept, perk text shown) instead of a discount
// - 残り分数: minutes until the slot, fed into the existing discount-rate rules when no 特典 is set
const REQUIRED_HEADERS = ['店舗名', '通常価格']

function parseCsvRows(text: string): string[][] {
  const clean = text.replace(/^﻿/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }
    if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && clean[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((f) => f.trim() !== '')) rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    if (row.some((f) => f.trim() !== '')) rows.push(row)
  }
  return rows
}

export function parseStoreCsv(text: string): { slots: CsvSlot[]; errors: string[] } {
  const rows = parseCsvRows(text)
  if (rows.length === 0) return { slots: [], errors: ['CSVが空です'] }

  const header = rows[0].map((h) => h.trim())
  const missing = REQUIRED_HEADERS.filter((h) => !header.includes(h))
  if (missing.length > 0) {
    return { slots: [], errors: [`必須列がありません: ${missing.join(', ')}`] }
  }

  const errors: string[] = []
  const slots: CsvSlot[] = []

  rows.slice(1).forEach((cells, i) => {
    const get = (name: string): string => {
      const idx = header.indexOf(name)
      return idx >= 0 ? (cells[idx] ?? '').trim() : ''
    }

    const restaurantName = get('店舗名')
    const originalPriceRaw = get('通常価格')
    if (!restaurantName || !originalPriceRaw) {
      errors.push(`${i + 2}行目: 店舗名または通常価格が空です`)
      return
    }

    const originalPrice = Number(originalPriceRaw.replace(/[^\d.-]/g, ''))
    if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      errors.push(`${i + 2}行目: 通常価格が不正です`)
      return
    }

    const minutesRaw = get('残り分数')
    const minutesUntil = minutesRaw && Number.isFinite(Number(minutesRaw)) ? Number(minutesRaw) : 60
    const guestsRaw = get('人数')
    const guests = guestsRaw && Number(guestsRaw) > 0 ? Number(guestsRaw) : 2
    const perkDescription = get('特典')

    let id = get('id') || `csv-${i + 1}`
    if (id === DEMO_SLOT.id) id = `csv-${i + 1}`

    const base = {
      id,
      restaurantName,
      category: get('ジャンル'),
      description: get('説明'),
      comment: get('コメント'),
      location: get('場所'),
      date: get('日付') || '本日',
      time: get('時間') || '19:00',
      guests,
      originalPrice,
      minutesUntil,
    }

    if (perkDescription) {
      slots.push({
        ...base,
        rescuePrice: originalPrice,
        discountRate: 0,
        offerType: 'perk',
        perkDescription,
      })
    } else {
      const { rescuePrice, discountRate } = calcRescuePrice(originalPrice, minutesUntil)
      slots.push({
        ...base,
        rescuePrice,
        discountRate,
        offerType: 'discount',
        perkDescription: '',
      })
    }
  })

  return { slots, errors }
}
