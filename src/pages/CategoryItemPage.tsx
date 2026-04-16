import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { lockatedPages } from '../content/lockatedPages'

function titleCase(s: string) {
  return s
    .split('-')
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(' ')
}

export default function CategoryItemPage() {
  const params = useParams()
  const category = params.category ?? 'category'
  const item = params.item ?? 'item'

  const title = useMemo(() => titleCase(item), [item])
  const catTitle = useMemo(() => titleCase(category), [category])
  const key = `${category}/${item}`
  const page = lockatedPages[key]

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_10%_-20%,rgba(99,102,241,0.16),transparent_50%),radial-gradient(900px_circle_at_100%_0%,rgba(168,85,247,0.12),transparent_45%)]" />
        </div>
        <div className="relative mx-auto max-w-screen-2xl px-4 py-10 sm:py-12 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {catTitle}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {page?.title ?? title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {page?.subtitle ??
              'Lockated-style detail page. This is where we mirror the exact blocks for this item from the reference site.'}
          </p>
          <div className="mt-6">
            <Link
              to={`/category/${category}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              ← Back to {catTitle}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:py-14 lg:px-10">
          <div className="grid gap-6">
            <div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-100">
                  {page?.heroImage ? (
                    <img
                      src={page.heroImage}
                      alt=""
                      className="h-64 w-full object-cover sm:h-80"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-64 bg-[radial-gradient(700px_circle_at_20%_0%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(700px_circle_at_100%_20%,rgba(168,85,247,0.10),transparent_55%)] sm:h-80" />
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-slate-900">
                    Overview
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    We’ll now keep this page visually consistent with the Lockated
                    homepage style (same spacing, cards, and section backgrounds).
                    If this item has a dedicated layout on the reference site, we
                    can replicate it block-for-block.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading customer success team.',
                    icon: '/lockated/icon-support.png',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Strong privacy and compliance posture for your workflows.',
                    icon: '/lockated/icon-privacy.png',
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                      <img src={b.icon} alt="" className="h-8 w-8" loading="lazy" />
                    </div>
                    <div className="text-base font-semibold text-slate-900">
                      {b.title}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

