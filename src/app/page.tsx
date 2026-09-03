import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-lg font-black tracking-tight text-stone-900">Fill Food</span>
          <nav className="flex items-center gap-4">
            <Link href="/marketplace" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              空き枠を探す
            </Link>
            <Link href="/store" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              飲食店向け
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-orange-50 px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-5 text-[10px] font-black tracking-[0.4em] text-orange-500 uppercase">
            Fill Food
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-stone-900 sm:text-5xl">
            キャンセルで空いた人気店を、
            <br />
            今すぐ予約。
          </h1>
          <p className="mt-4 text-xl font-medium text-stone-600">
            お店は、失うはずだった売上を取り戻す。
          </p>
          <p className="mt-6 text-sm leading-relaxed text-stone-500">
            Fill Food は、飲食店のキャンセル枠を再販売して
            <br />
            本来失われる予定だった売上を回収するサービスです。
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/marketplace"
              className="w-full rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-emerald-600 sm:w-auto"
            >
              キャンセル枠を探す
            </Link>
            <Link
              href="/store"
              className="w-full rounded-xl border-2 border-orange-400 bg-white px-8 py-4 text-base font-bold text-orange-600 transition-colors hover:bg-orange-50 sm:w-auto"
            >
              キャンセル損失を回収する
            </Link>
          </div>
        </div>
      </section>

      {/* 3 steps */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="mb-10 text-center text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
            仕組み
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">

            <div className="flex flex-1 flex-col items-center text-center px-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                ⚠
              </div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Step 1</p>
              <h3 className="mt-1 font-bold text-stone-900">キャンセル発生</h3>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                予約がキャンセルされ、売上が失われる
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center pt-7 text-stone-300 text-xl">
              →
            </div>
            <div className="flex items-center justify-center sm:hidden text-stone-300">↓</div>

            <div className="flex flex-1 flex-col items-center text-center px-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🔥
              </div>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Step 2</p>
              <h3 className="mt-1 font-bold text-stone-900">キャンセル枠を再出品</h3>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                すぐにマーケットプレイスへ掲載
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center pt-7 text-stone-300 text-xl">
              →
            </div>
            <div className="flex items-center justify-center sm:hidden text-stone-300">↓</div>

            <div className="flex flex-1 flex-col items-center text-center px-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                ✓
              </div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Step 3</p>
              <h3 className="mt-1 font-bold text-stone-900">予約成立で売上回収</h3>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                成功報酬型。売れた時だけ 10%
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Business model banner */}
      <section className="bg-stone-100 border-y border-stone-200 px-4 py-6 text-center">
        <p className="text-sm text-stone-600">
          料金は売れた時だけ —{' '}
          <span className="font-bold text-stone-800">成功報酬 10%</span>
          <span className="mx-3 text-stone-300">|</span>
          初期費用{' '}
          <span className="font-bold text-stone-800">¥0</span>
          <span className="mx-3 text-stone-300">|</span>
          月額固定費{' '}
          <span className="font-bold text-stone-800">¥0</span>
        </p>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-xs text-stone-400">© 2026 Fill Food — Gavison Hackathon 2026 Summer</p>
      </footer>

    </div>
  )
}
