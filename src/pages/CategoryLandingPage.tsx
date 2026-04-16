import { Link, useParams } from 'react-router-dom'
import { lockatedPages } from '../content/lockatedPages'

function titleCase(s: string) {
  return s
    .split('-')
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(' ')
}

export default function CategoryLandingPage() {
  const params = useParams()
  const category = params.category ?? 'category'

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_10%_-20%,rgba(99,102,241,0.14),transparent_50%),radial-gradient(900px_circle_at_100%_0%,rgba(168,85,247,0.10),transparent_45%)]" />
        </div>
        <div className="relative mx-auto max-w-screen-2xl px-4 py-10 sm:py-12 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {titleCase(category)}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {titleCase(category)}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Choose an item to view its page.
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:py-14 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(lockatedPages)
              .filter((p) => p.key.startsWith(`${category}/`))
              .map((p) => (
                <Link
                  key={p.key}
                  to={`/category/${p.key}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50"
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {p.heroImage ? (
                      <img
                        src={p.heroImage}
                        alt=""
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-40 bg-[radial-gradient(500px_circle_at_20%_0%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(500px_circle_at_100%_20%,rgba(168,85,247,0.10),transparent_55%)]" />
                    )}
                  </div>
                  <div className="mt-4 text-base font-semibold text-slate-900">
                    {p.title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Open page <span aria-hidden>→</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

