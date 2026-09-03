import { MONTHLY_RECOVERY } from '@/lib/rescue/data'
import { formatYen } from '@/lib/rescue/kpi'

const MAX = Math.max(...MONTHLY_RECOVERY.map((d) => d.value))
const BAR_MAX_PX = 64

export default function MonthlyChart() {
  return (
    <div>
      {/* Bar area */}
      <div className="flex items-end gap-1.5 h-16">
        {MONTHLY_RECOVERY.map((d, i) => (
          <div
            key={d.month}
            className={[
              'flex-1 rounded-t-sm',
              i === MONTHLY_RECOVERY.length - 1 ? 'bg-emerald-500' : 'bg-emerald-100',
            ].join(' ')}
            style={{ height: `${Math.round((d.value / MAX) * BAR_MAX_PX)}px` }}
          />
        ))}
      </div>

      {/* Month labels */}
      <div className="flex gap-1.5 mt-1.5">
        {MONTHLY_RECOVERY.map((d, i) => (
          <div key={d.month} className="flex-1 text-center">
            <span
              className={[
                'text-[9px]',
                i === MONTHLY_RECOVERY.length - 1
                  ? 'font-bold text-emerald-600'
                  : 'text-stone-400',
              ].join(' ')}
            >
              {d.month}
            </span>
          </div>
        ))}
      </div>

      {/* Latest value caption */}
      <p className="mt-2 text-right text-[10px] text-stone-400">
        今月 {formatYen(MONTHLY_RECOVERY[MONTHLY_RECOVERY.length - 1].value)}
      </p>
    </div>
  )
}
