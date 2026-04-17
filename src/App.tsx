import { useEffect, useMemo, useState } from 'react'

function App() {
  const [openMenu, setOpenMenu] = useState<
    null | 'clientTypes' | 'propertyType' | 'solutionType'
  >(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              Lockated
            </a>
            <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium hover:text-slate-900"
                  onClick={() =>
                    setOpenMenu((v) => (v === 'clientTypes' ? null : 'clientTypes'))
                  }
                >
                  By Client Types <span className="text-slate-400">▾</span>
                </button>
                {openMenu === 'clientTypes' && (
                  <div
                    className="absolute left-0 mt-3 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                  >
                    {[
                      'Offices',
                      'Commercial Buildings',
                      'Hotels',
                      'Residential Communities',
                      'Real Estate Developer',
                    ].map((t) => (
                      <a
                        key={t}
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                      >
                        {t}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium hover:text-slate-900"
                  onClick={() =>
                    setOpenMenu((v) =>
                      v === 'propertyType' ? null : 'propertyType',
                    )
                  }
                >
                  By Property Type <span className="text-slate-400">▾</span>
                </button>
                {openMenu === 'propertyType' && (
                  <div
                    className="absolute left-0 mt-3 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                  >
                    {['Commercial Property', 'Residential Property'].map((t) => (
                      <a
                        key={t}
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                      >
                        {t}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium hover:text-slate-900"
                  onClick={() =>
                    setOpenMenu((v) =>
                      v === 'solutionType' ? null : 'solutionType',
                    )
                  }
                >
                  By Solution Type <span className="text-slate-400">▾</span>
                </button>
                {openMenu === 'solutionType' && (
                  <div
                    className="absolute left-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                  >
                    {[
                      'Community Management Offices',
                      'Community Management Building',
                      'Residential Community Management',
                      'Lead Management',
                      'Site Management',
                      'Brokers Management',
                      'Snagging & QC Management',
                      'Handover Management',
                    ].map((t) => (
                      <a
                        key={t}
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                      >
                        {t}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="#about" className="font-medium hover:text-slate-900">
                About
              </a>
              <a href="#contact" className="font-medium hover:text-slate-900">
                Contact Us
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <span aria-hidden>☰</span>
            </button>
            <a
              href="#login"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              LOGIN
            </a>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute left-0 right-0 top-0 max-h-dvh overflow-auto rounded-b-2xl border-b border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-base font-semibold tracking-tight">Menu</div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => setMobileNavOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-2 px-4 pb-5">
              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                  By Client Types
                </summary>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {[
                    'Offices',
                    'Commercial Buildings',
                    'Hotels',
                    'Residential Communities',
                    'Real Estate Developer',
                  ].map((t) => (
                    <a
                      key={t}
                      href="#"
                      className="block rounded-lg px-2 py-2 hover:bg-slate-50"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </details>

              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                  By Property Type
                </summary>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {['Commercial Property', 'Residential Property'].map((t) => (
                    <a
                      key={t}
                      href="#"
                      className="block rounded-lg px-2 py-2 hover:bg-slate-50"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </details>

              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                  By Solution Type
                </summary>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {[
                    'Community Management Offices',
                    'Community Management Building',
                    'Residential Community Management',
                    'Lead Management',
                    'Site Management',
                    'Brokers Management',
                    'Snagging & QC Management',
                    'Handover Management',
                  ].map((t) => (
                    <a
                      key={t}
                      href="#"
                      className="block rounded-lg px-2 py-2 hover:bg-slate-50"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </details>

              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href="#about"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  onClick={() => setMobileNavOpen(false)}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_-10%,rgba(99,102,241,0.22),transparent_45%),radial-gradient(900px_circle_at_100%_0%,rgba(168,85,247,0.18),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Return to the Workplace with Confidence
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Return to the Workplace with Confidence
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              A modern visitor and community management platform designed for
              offices, commercial buildings, residential communities, and real
              estate teams.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#video"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto"
              >
                Play Video <span aria-hidden>▶</span>
              </a>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 sm:w-auto"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                    ▶
                  </div>
                  <p className="mt-3 text-sm text-white/70">Video placeholder</p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Community Management */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Community Management
            </h2>
            <p className="mt-3 text-slate-600">
              A new way to welcome your employees, visitors, and operations back
              to the workplace
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { title: 'Commercial Community', desc: 'One platform for offices and buildings.' },
              { title: 'Residential Community', desc: 'Connect and manage your community on the go.' },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.desc}
                </p>
                <div className="mt-6 h-40 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Why leading companies choose Lockated
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'First-Class Support',
                desc: 'Count on our industry-leading Customer Success team based across the globe.',
              },
              {
                title: 'Powerful Access Control Integrations',
                desc: 'Explore the depth and volume of possibilities with first-rate systems.',
              },
              {
                title: 'Best-of-breed Applications',
                desc: 'Work with tools your team already uses for seamless implementations.',
              },
              {
                title: 'Data Privacy',
                desc: 'Trust in a VMS with strong privacy and compliance posture.',
              },
              {
                title: 'Proven and Innovative',
                desc: 'Rely on the team that’s supported millions of visits at thousands of locations.',
              },
              {
                title: 'Truly Unlimited',
                desc: 'Scale with workflows across visitors, hosts, and kiosks.',
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-10 w-10 rounded-xl bg-indigo-600/10" />
                <h3 className="text-base font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Industry Solutions
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Corporate Office',
              'Commercial Buildings',
              'Hotels',
              'Warehouses',
              'Residential Communities',
              'Real Estate Developer',
            ].map((t) => (
              <div
                key={t}
                className="group rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="h-12 w-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-600/10" />
                <h3 className="mt-4 text-base font-semibold text-slate-900">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Explore workflows tailored to your property and team.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients + Stack */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Some of our Clients
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  The Lockated Stack
                </h2>
                <a
                  href="#stack-video"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Play Video <span aria-hidden>▶</span>
                </a>
              </div>
              <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm" />
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Solutionwise Videos
              </h2>
              <a
                href="#videos"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Play Video <span aria-hidden>▶</span>
              </a>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Commercial Office',
                  desc: 'A new way to welcome your employees, visitors, and operations back to the workplace',
                },
                {
                  title: 'Commercial Building',
                  desc: 'One platform to deliver exceptional tenant experience and drive better ROI',
                },
                {
                  title: 'Residential Community',
                  desc: 'Connect and manage your residential community on the go with the more secure and reliable community management app.',
                },
                {
                  title: 'Real Estate Company',
                  desc: 'An integrated solution serving across project lifecycle focusing on delivering value with data backed intelligence.',
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="aspect-video rounded-xl bg-slate-100" />
                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    {x.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {x.desc}
                  </p>
                  <div className="mt-5">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Play Video <span aria-hidden>▶</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="text-lg font-semibold">Lockated</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Got questions? our teams are here to help.
              </p>
              <div className="mt-5 space-y-1 text-sm text-slate-700">
                <div>
                  Customer Care:{' '}
                  <a className="font-semibold" href="tel:+917303434567">
                    +91 730 343 4567
                  </a>
                </div>
                <div>
                  Email:{' '}
                  <a
                    className="font-semibold"
                    href="mailto:customercare@lockated.com"
                  >
                    customercare@lockated.com
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    By Client Types
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {[
                      'Offices',
                      'Commercial Buildings',
                      'Hotels',
                      'Residential Communities',
                      'Real Estate Developer',
                    ].map((t) => (
                      <li key={t}>
                        <a className="hover:text-slate-900" href="#">
                          {t}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    By Property Type
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {['Commercial Property', 'Residential Property'].map((t) => (
                      <li key={t}>
                        <a className="hover:text-slate-900" href="#">
                          {t}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    By Solution Type
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {[
                      'Community Management Offices',
                      'Community Management Buildings',
                      'Residential Community Management',
                      'Lead Management',
                      'Site Management',
                    ].map((t) => (
                      <li key={t}>
                        <a className="hover:text-slate-900" href="#">
                          {t}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>© Copyright {year} by Haven Infoline Pvt. Ltd.</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                'Sitemap',
                'Disclaimer',
                'Privacy Policy',
                'Terms & Conditions',
                'Refund Policy',
              ].map((t) => (
                <a key={t} href="#" className="hover:text-slate-700">
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
