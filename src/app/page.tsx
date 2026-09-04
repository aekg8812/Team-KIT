import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl text-3xl font-black tracking-tight">救席</div>
      </header>

      <section className="bg-orange-50 px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mb-5 text-4xl font-black text-orange-500">救席</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-stone-900 sm:text-5xl">
            キャンセルで消える売上を、<br />もう一度、予約に変える。
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-stone-500 sm:text-base">
            飲食店のキャンセル枠を直前再販売して、<br />本来失われる予定だった売上を回収するサービスです。
          </p>
          <Link href="/role-select" className="mt-10 inline-flex min-w-56 justify-center rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-orange-600">
            はじめる
          </Link>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-3xl gap-6 text-center sm:grid-cols-3">
          {[
            ['⚠', 'キャンセル発生', '予約キャンセルで売上が失われる'],
            ['🔥', 'RESCUE出品', '空いた枠をすぐに再販売'],
            ['✓', '売上回収', '予約成立時だけ成功報酬10%'],
          ].map(([icon, title, text], index) => (
            <div key={title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="text-2xl">{icon}</div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-orange-500">Step {index + 1}</p>
              <h2 className="mt-1 font-bold">{title}</h2>
              <p className="mt-2 text-xs text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-100 px-4 py-6 text-center text-sm text-stone-600">
        売れなければ0円 — <strong className="text-stone-800">成功報酬10%</strong> / 初期費用・月額固定費 ¥0
      </section>
    </main>
  )
}
