import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { slugify } from '../lib/slug'

type MenuKey = null | 'clientTypes' | 'propertyType' | 'solutionType' | 'productsType'

const CLIENT_TYPES = [
  'Offices',
  'Commercial Buildings',
  'Hotels',
  'Residential Communities',
  'Real Estate Developer',
] as const

const PROPERTY_TYPES = ['Commercial Property', 'Residential Property'] as const

const PRODUCTS_TYPES = [
  'Customer App',
  'Lease Management',
  'FM Matrix',
  'Loyality Rule',
  'CP Management',
  'Snag 360',
  'Post Possession',
  'PATM',
  'Vendor Management',
  'Post Sales',
  'Visitor Management',
  'Community Management',
  'Workplace Management',
  'Access Control',
  'Helpdesk Management',
] as const

const CLIENT_TYPE_LINKS: Record<(typeof CLIENT_TYPES)[number], string> = {
  Offices: '/offices',
  'Commercial Buildings': '/commercial-buildings',
  Hotels: '/hotels',
  'Residential Communities': '/residential-communities',
  'Real Estate Developer': '/real-estate-developer',
}

const PROPERTY_TYPE_LINKS: Record<(typeof PROPERTY_TYPES)[number], string> = {
  'Commercial Property': '/commercial-property',
  'Residential Property': '/residential-property',
}

const PRODUCTS_TYPE_LINKS: Record<(typeof PRODUCTS_TYPES)[number], string> = {
  'Customer App': '/customer-app',
  'Lease Management': '/lease-management',
  'FM Matrix': '/fm-matrix',
  'Loyality Rule': '/loyalty-rule-engine',
  'CP Management': '/cp-management',
  'Snag 360': '/snag-360',
  'Post Possession': '/post-possession',
  PATM: '/patm',
  'Vendor Management': '/vendor-management',
  'Post Sales': '/post-sales',
  'Visitor Management': `/category/products-type/${slugify('Visitor Management')}`,
  'Community Management': `/category/products-type/${slugify('Community Management')}`,
  'Workplace Management': `/category/products-type/${slugify('Workplace Management')}`,
  'Access Control': `/category/products-type/${slugify('Access Control')}`,
  'Helpdesk Management': `/category/products-type/${slugify('Helpdesk Management')}`,
}

const SOLUTION_TYPES = [
  'Community Management Offices',
  'Community Management Building',
  'Residential Community Management',
  'Lead Management',
  'Site Management',
  'Brokers Management',
  'Snagging & QC Management',
  'Handover Management',
] as const

const SOLUTION_TYPE_LINKS: Record<(typeof SOLUTION_TYPES)[number], string> = {
  'Community Management Offices': '/offices',
  'Community Management Building': '/commercial-buildings',
  'Residential Community Management': '/residential-communities',
  'Lead Management': '/lead-management',
  'Site Management': '/site-management',
  'Brokers Management': '/brokers-management',
  'Snagging & QC Management': '/snagging-qc-management',
  'Handover Management': '/handover-management',
}

function MenuLink(props: { label: string; to: string; onClick?: () => void }) {
  return (
    <Link
      to={props.to}
      className="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
      onClick={props.onClick}
    >
      {props.label}
    </Link>
  )
}

/** Same chevron as GeneratePress `gp-icon icon-arrow` on india.lockated.co */
function DropdownChevron() {
  return (
    <span className="ml-1 inline-flex shrink-0 text-slate-900/75" aria-hidden>
      <svg viewBox="0 0 330 512" width="0.65em" height="0.65em" className="translate-y-px">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M305.913 197.085c0 2.266-1.133 4.815-2.833 6.514L171.087 335.593c-1.7 1.7-4.249 2.832-6.515 2.832s-4.815-1.133-6.515-2.832L26.064 203.599c-1.7-1.7-2.832-4.248-2.832-6.514s1.132-4.816 2.832-6.515l14.162-14.163c1.7-1.699 3.966-2.832 6.515-2.832 2.266 0 4.815 1.133 6.515 2.832l111.316 111.317 111.316-111.317c1.7-1.699 4.249-2.832 6.515-2.832s4.815 1.133 6.515 2.832l14.162 14.163c1.7 1.7 2.833 4.249 2.833 6.515z"
        />
      </svg>
    </span>
  )
}

export function Layout() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null)
  const [pinnedMenu, setPinnedMenu] = useState<MenuKey>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const year = useMemo(() => new Date().getFullYear(), [])
  const location = useLocation()
  const desktopNavRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setOpenMenu(null)
    setPinnedMenu(null)
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setPinnedMenu(null)
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    function onPointerDown(e: MouseEvent | PointerEvent) {
      if (!pinnedMenu) return
      const nav = desktopNavRef.current
      const target = e.target as Node | null
      if (!nav || !target) return
      if (!nav.contains(target)) {
        setPinnedMenu(null)
        setOpenMenu(null)
      }
    }
    window.addEventListener('pointerdown', onPointerDown, { capture: true })
    return () => window.removeEventListener('pointerdown', onPointerDown, { capture: true } as any)
  }, [pinnedMenu])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="sticky top-0 z-50 bg-[#f7f8f9] shadow-[0_2px_2px_-2px_rgba(0,0,0,0.2)]">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-2 sm:px-6 md:px-10">
          <Link to="/" className="shrink-0">
            <img
              src="/lockated/lockated-logo-nw.png"
              alt="Lockated"
              className="h-[32px] w-auto sm:h-[34px] md:h-[36px]"
            />
          </Link>

          <div className="flex min-w-0 items-center gap-3">
            <nav
              ref={desktopNavRef as any}
              className="hidden min-w-0 flex-wrap items-center justify-end gap-x-7 gap-y-2 font-heading text-[16px] font-normal text-black md:flex"
            >
              <div
                className="relative"
                onMouseEnter={() => {
                  if (!pinnedMenu) setOpenMenu('clientTypes')
                }}
                onMouseLeave={() => {
                  if (pinnedMenu !== 'clientTypes') setOpenMenu(null)
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center whitespace-nowrap bg-transparent font-normal text-black hover:text-black"
                  onFocus={() => setOpenMenu('clientTypes')}
                  onClick={() => {
                    setPinnedMenu((v) => (v === 'clientTypes' ? null : 'clientTypes'))
                    setOpenMenu('clientTypes')
                  }}
                >
                  By Client Types
                  <DropdownChevron />
                </button>
                {openMenu === 'clientTypes' && (
                  <div className="absolute left-0 top-full z-50 pt-2">
                    <div className="min-w-[240px] border border-slate-200 bg-white py-1 shadow-md">
                      {CLIENT_TYPES.map((t) => (
                        <MenuLink
                          key={t}
                          label={t}
                          to={CLIENT_TYPE_LINKS[t]}
                          onClick={() => {
                            setPinnedMenu(null)
                            setOpenMenu(null)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => {
                  if (!pinnedMenu) setOpenMenu('propertyType')
                }}
                onMouseLeave={() => {
                  if (pinnedMenu !== 'propertyType') setOpenMenu(null)
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center whitespace-nowrap bg-transparent font-normal text-black hover:text-black"
                  onFocus={() => setOpenMenu('propertyType')}
                  onClick={() => {
                    setPinnedMenu((v) => (v === 'propertyType' ? null : 'propertyType'))
                    setOpenMenu('propertyType')
                  }}
                >
                  By Property Type
                  <DropdownChevron />
                </button>
                {openMenu === 'propertyType' && (
                  <div className="absolute left-0 top-full z-50 pt-2">
                    <div className="min-w-[240px] border border-slate-200 bg-white py-1 shadow-md">
                      {PROPERTY_TYPES.map((t) => (
                        <MenuLink
                          key={t}
                          label={t}
                          to={PROPERTY_TYPE_LINKS[t]}
                          onClick={() => {
                            setPinnedMenu(null)
                            setOpenMenu(null)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => {
                  if (!pinnedMenu) setOpenMenu('productsType')
                }}
                onMouseLeave={() => {
                  if (pinnedMenu !== 'productsType') setOpenMenu(null)
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center whitespace-nowrap bg-transparent font-normal text-black hover:text-black"
                  onFocus={() => setOpenMenu('productsType')}
                  onClick={() => {
                    setPinnedMenu((v) => (v === 'productsType' ? null : 'productsType'))
                    setOpenMenu('productsType')
                  }}
                >
                  By Products
                  <DropdownChevron />
                </button>
                {openMenu === 'productsType' && (
                  <div className="absolute left-0 top-full z-50 pt-2">
                    <div className="min-w-[240px] border border-slate-200 bg-white py-1 shadow-md">
                      {PRODUCTS_TYPES.map((t) => (
                        <MenuLink
                          key={t}
                          label={t}
                          to={PRODUCTS_TYPE_LINKS[t]}
                          onClick={() => {
                            setPinnedMenu(null)
                            setOpenMenu(null)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => {
                  if (!pinnedMenu) setOpenMenu('solutionType')
                }}
                onMouseLeave={() => {
                  if (pinnedMenu !== 'solutionType') setOpenMenu(null)
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center whitespace-nowrap bg-transparent font-normal text-black hover:text-black"
                  onFocus={() => setOpenMenu('solutionType')}
                  onClick={() => {
                    setPinnedMenu((v) => (v === 'solutionType' ? null : 'solutionType'))
                    setOpenMenu('solutionType')
                  }}
                >
                  By Solution Type
                  <DropdownChevron />
                </button>
                {openMenu === 'solutionType' && (
                  <div className="absolute left-0 top-full z-50 pt-2">
                    <div className="min-w-[280px] border border-slate-200 bg-white py-1 shadow-md">
                      {SOLUTION_TYPES.map((t) => (
                        <MenuLink
                          key={t}
                          label={t}
                          to={SOLUTION_TYPE_LINKS[t]}
                          onClick={() => {
                            setPinnedMenu(null)
                            setOpenMenu(null)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/about" className="whitespace-nowrap hover:text-black">
                About
              </Link>
              <Link to="/contact" className="whitespace-nowrap hover:text-black">
                Contact Us
              </Link>
              <Link to="/login" className="whitespace-nowrap font-normal uppercase tracking-wide hover:text-black">
                LOGIN
              </Link>
            </nav>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <span aria-hidden>☰</span>
            </button>
          </div>
        </div>
      </header>

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
                  {CLIENT_TYPES.map((t) => (
                    <MenuLink
                      key={t}
                      label={t}
                      to={CLIENT_TYPE_LINKS[t]}
                      onClick={() => setMobileNavOpen(false)}
                    />
                  ))}
                </div>
              </details>

              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                  By Property Type
                </summary>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {PROPERTY_TYPES.map((t) => (
                    <MenuLink
                      key={t}
                      label={t}
                      to={PROPERTY_TYPE_LINKS[t]}
                      onClick={() => setMobileNavOpen(false)}
                    />
                  ))}
                </div>
              </details>

              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                  By Solution Type
                </summary>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {SOLUTION_TYPES.map((t) => (
                    <MenuLink
                      key={t}
                      label={t}
                      to={SOLUTION_TYPE_LINKS[t]}
                      onClick={() => setMobileNavOpen(false)}
                    />
                  ))}
                </div>
              </details>

              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                  By Products
                </summary>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {PRODUCTS_TYPES.map((t) => (
                    <MenuLink
                      key={t}
                      label={t}
                      to={PRODUCTS_TYPE_LINKS[t]}
                      onClick={() => setMobileNavOpen(false)}
                    />
                  ))}
                </div>
              </details>

              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  to="/about"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
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
                    {CLIENT_TYPES.map((t) => (
                      <li key={t}>
                        <Link
                          className="hover:text-slate-900"
                          to={CLIENT_TYPE_LINKS[t]}
                        >
                          {t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    By Property Type
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {PROPERTY_TYPES.map((t) => (
                      <li key={t}>
                        <Link
                          className="hover:text-slate-900"
                          to={PROPERTY_TYPE_LINKS[t]}
                        >
                          {t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    By Solution Type
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {SOLUTION_TYPES.slice(0, 5).map((t) => (
                      <li key={t}>
                        <Link
                          className="hover:text-slate-900"
                          to={`/category/solution-type/${slugify(t)}`}
                        >
                          {t}
                        </Link>
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
                <Link
                  key={t}
                  to="#"
                  className="hover:text-slate-700"
                  onClick={(e) => e.preventDefault()}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

