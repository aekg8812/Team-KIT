const STEPS = ['キャンセル発生', 'RESCUE出品', '予約成立', '売上回収']

interface StepIndicatorProps {
  activeStep: number // 0-3; -1 = none highlighted
}

export default function StepIndicator({ activeStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start">
      {STEPS.map((label, i) => {
        const isDone = i < activeStep
        const isActive = i === activeStep

        return (
          <div key={label} className="flex flex-1 items-start">
            <div className="flex flex-col items-center gap-1 w-14 shrink-0">
              <div
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-200 text-stone-400',
                ].join(' ')}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span
                className={[
                  'text-center text-[9px] leading-tight',
                  isActive
                    ? 'font-bold text-orange-600'
                    : isDone
                    ? 'font-medium text-emerald-600'
                    : 'text-stone-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={[
                  'mt-3 flex-1 h-px mx-1',
                  i < activeStep ? 'bg-emerald-400' : 'bg-stone-200',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
