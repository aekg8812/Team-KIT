'use client'

import { useRef, useState } from 'react'
import { useRescue } from '@/context/RescueContext'
import { DEMO_CSV_TEXT } from '@/lib/rescue/demoCsvData'

export default function CsvImportLink() {
  const { loadCsvSlots, queueDemoCancellations } = useRescue()
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  function flashMessage(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(null), 4000)
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const buffer = await file.arrayBuffer()
    // Excel on Japanese Windows saves plain "CSV" as Shift-JIS, not UTF-8.
    // Try strict UTF-8 first; fall back to Shift-JIS so both save formats work.
    let text: string
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(buffer)
    } catch {
      text = new TextDecoder('shift_jis').decode(buffer)
    }
    const result = loadCsvSlots(text)
    flashMessage(
      result.ok
        ? `${result.count}件の店舗データを読み込みました`
        : (result.error ?? '読み込みに失敗しました'),
    )
  }

  function handleUseDemoData() {
    const result = loadCsvSlots(DEMO_CSV_TEXT)
    if (!result.ok) {
      flashMessage(result.error ?? 'デモデータの読み込みに失敗しました')
      return
    }
    queueDemoCancellations(result.slots)
    flashMessage(`${result.count}件のキャンセル待ちを投入しました`)
  }

  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-[10px] text-stone-300 hover:text-stone-400"
        >
          店舗データを読み込む
        </button>
        <span className="text-[10px] text-stone-200">|</span>
        <button
          type="button"
          onClick={handleUseDemoData}
          className="text-[10px] text-stone-300 hover:text-stone-400"
        >
          デモデータを使用
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        className="hidden"
      />
      {message && <p className="mt-1 text-[10px] text-stone-400">{message}</p>}
    </div>
  )
}
