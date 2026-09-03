type Sentiment = 'loss' | 'gain' | 'neutral'

interface KpiCardProps {
  labelJa: string
  labelEn: string
  value: string
  subValue?: string
  sentiment?: Sentiment
  highlighted?: boolean
}

const ACCENT: Record<Sentiment, string> = {
  loss:    'bg-red-400',
  gain:    'bg-emerald-400',
  neutral: 'bg-stone-300',
}

const VALUE_COLOR: Record<Sentiment, string> = {
  loss:    'text-red-600',
  gain:    'text-emerald-600',
  neutral: 'text-stone-800',
}

export default function KpiCard({
  labelJa,
  labelEn,
  value,
  subValue,
  sentiment = 'neutral',
  highlighted = false,
}: KpiCardProps) {
  return (
    <div
      className={[
        'rounded-2xl border p-5 transition-[border-color,background-color] duration-300',
        highlighted
          ? 'border-emerald-400 bg-emerald-50 animate-[kpi-highlight_2.5s_ease-out_forwards]'
          : 'border-stone-200 bg-white',
      ].join(' ')}
    >
      <div className={`mb-3 h-0.5 w-8 rounded-full ${ACCENT[sentiment]}`} />
      <div className="text-xs font-medium text-stone-700 leading-snug">{labelJa}</div>
      <div className="text-[10px] text-stone-400 mt-0.5 tracking-wide">{labelEn}</div>
      <div className={`mt-3 text-3xl font-bold tabular-nums ${VALUE_COLOR[sentiment]}`}>
        {value}
      </div>
      {subValue && (
        <div className="mt-1.5 text-xs text-stone-400">{subValue}</div>
      )}
    </div>
  )
}
