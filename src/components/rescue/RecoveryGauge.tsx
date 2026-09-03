interface RecoveryGaugeProps {
  rate: number
  label?: string
}

export default function RecoveryGauge({ rate, label = '回収率' }: RecoveryGaugeProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">{label}</span>
        <span className="text-2xl font-bold tabular-nums text-emerald-600">{rate}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-stone-400">Recovery Rate</p>
    </div>
  )
}
