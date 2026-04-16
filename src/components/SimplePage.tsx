import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function SimplePage(props: {
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; to: string }>
  children?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:py-14 lg:px-10">
      {props.breadcrumbs && props.breadcrumbs.length > 0 && (
        <nav className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            {props.breadcrumbs.map((b, idx) => (
              <li key={`${b.to}-${idx}`} className="flex items-center gap-2">
                <Link to={b.to} className="hover:text-slate-700">
                  {b.label}
                </Link>
                {idx < props.breadcrumbs!.length - 1 && <span>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {props.title}
      </h1>
      {props.description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {props.description}
        </p>
      )}

      <div className="mt-8">{props.children}</div>
    </div>
  )
}

