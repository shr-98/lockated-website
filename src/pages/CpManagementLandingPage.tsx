import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

const CP_NAV_OFFSET_PX = 70
const CP_TEAM_STORY_SCROLL_PER_TAB_VH = 1.2

function initCpTeamsGsap(
  root: HTMLElement,
  opts: {
    teamTabs: HTMLElement[]
    teamIds: string[]
    switchTeam: (teamId: string, tabEl?: HTMLElement) => void
  },
): ScrollTrigger | null {
  const pin = root.querySelector<HTMLElement>('#teamsStoryPin')
  if (!pin) return null
  const n = opts.teamIds.length
  if (n < 1) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (!window.matchMedia('(min-width: 768px)').matches) return null
  const progressFill = root.querySelector<HTMLElement>('#teamsStoryProgress')
  let lastIdx = -1
  return ScrollTrigger.create({
    id: 'cp-teams-use-cases',
    trigger: pin,
    start: `top ${CP_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * CP_TEAM_STORY_SCROLL_PER_TAB_VH}`,
    pin: true,
    pinSpacing: true,
    pinType: 'fixed',
    anticipatePin: 0,
    fastScrollEnd: false,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(n - 1, Math.max(0, Math.floor(self.progress * n)))
      if (idx !== lastIdx) {
        lastIdx = idx
        const id = opts.teamIds[idx]
        if (id) opts.switchTeam(id, opts.teamTabs[idx])
      }
      if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
    },
  })
}

/**
 * `public/cp-management.html` uses `.reveal` animations. The app `index.css` adds a
 * global blur reveal — scope overrides + shell styling (same approach as FM Matrix).
 */
const CP_MANAGEMENT_ISOLATION_CSS = `
.cp-management-root {
  scroll-padding-top: 70px;
}
.cp-management-root .reveal,
.cp-management-root .reveal.pre {
  filter: none !important;
  will-change: auto !important;
}
.cp-management-root .reveal.pre {
  opacity: 0 !important;
  transform: translateY(30px) !important;
  transition: opacity 0.75s var(--ease, cubic-bezier(0.16, 1, 0.3, 1)), transform 0.75s var(--ease, cubic-bezier(0.16, 1, 0.3, 1)) !important;
}
.cp-management-root .reveal.pre.on {
  opacity: 1 !important;
  transform: none !important;
}
.cp-management-root h1,
.cp-management-root h2,
.cp-management-root h3,
.cp-management-root h4,
.cp-management-root h5,
.cp-management-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
@media (prefers-reduced-motion: reduce) {
  .cp-management-root .reveal.pre,
  .cp-management-root .reveal.pre.on {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.cp-management-root #contact {
  background-color: var(--bg) !important;
}
.cp-management-root footer {
  background-color: var(--bg) !important;
}
.cp-management-root .btn-fill,
.cp-management-root .f-sub {
  color: var(--on-primary, #F6F4EE) !important;
}
.cp-management-root button.wtab {
  font-family: 'Poppins', sans-serif !important;
  background-color: var(--surface) !important;
}
.cp-management-root button.wtab.on {
  background-color: var(--accent) !important;
  color: var(--on-primary) !important;
}
.cp-management-root .fg input,
.cp-management-root .fg select,
.cp-management-root .fg textarea {
  background-color: var(--surface) !important;
  color: var(--txt) !important;
}
/* Global .sec-hd p { margin-bottom: 56px } left a huge gap before the bento grid. */
.cp-management-root #uc .sec-hd p {
  margin-bottom: 16px !important;
}
.cp-management-root #uc .sec-hd .tag {
  margin-bottom: 10px !important;
}
.cp-management-root #uc .sec-hd h2 {
  margin-bottom: 8px !important;
}
.cp-management-root .fg input:-webkit-autofill,
.cp-management-root .fg input:-webkit-autofill:hover,
.cp-management-root .fg input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface) inset !important;
  box-shadow: 0 0 0 1000px var(--surface) inset !important;
  -webkit-text-fill-color: var(--txt) !important;
}
.cp-management-root .hero-pills,
.cp-management-root .modal,
.cp-management-root .ui.on {
  background-color: var(--surface) !important;
}
.cp-management-root #uc {
  background-color: var(--band, #E8E2D6) !important;
}
.cp-management-root .ucc {
  background-color: var(--surface, #F0EAE1) !important;
  border-color: rgba(196, 184, 157, 0.35) !important;
}
html:has(.cp-management-root) {
  scroll-padding-top: ${CP_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.cp-management-root section[id],
.cp-management-root .teams-section#teams {
  scroll-margin-top: ${CP_NAV_OFFSET_PX + 4}px;
}
.cp-management-root #teamsStoryPin {
  z-index: 1 !important;
  min-height: calc(100vh - ${CP_NAV_OFFSET_PX}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cp-management-root .pin-spacer {
  background: var(--bg) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.cp-management-root .teams-section .team-info {
  max-height: min(45vh, calc(100vh - 200px));
  overflow-y: auto;
  overscroll-behavior: contain;
}
/* No GSAP pin below 768px — avoid forced viewport-tall block + inner scroll on team copy. */
@media (max-width: 767px) {
  .cp-management-root #teamsStoryPin {
    min-height: 0 !important;
    display: block !important;
  }
  .cp-management-root .teams-section .team-info {
    max-height: none !important;
    overflow: visible !important;
  }
}
`

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

type ModalDatum = {
  ico: string
  ttl: string
  sub: string
  imps: { v: string; l: string }[]
  body: string
}

export default function CpManagementLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor
    const prevBodyColor = document.body.style.color
    document.body.style.backgroundColor = '#F6F4EE'
    document.body.style.color = '#2C2C2A'
    return () => {
      document.body.style.backgroundColor = prevBodyBg
      document.body.style.color = prevBodyColor
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/cp-management.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /cp-management.html (${res.status})`)
        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/cp-management.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${CP_MANAGEMENT_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load CP Management content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useLayoutEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl) return
    if (!bodyHtml) return
    const root = rootEl

    // NAV shadow on scroll
    const nav = root.querySelector<HTMLElement>('#nav')
    const onScroll = () => nav?.classList.toggle('sd', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Counter animation (hero pills)
    function animN(el: HTMLElement) {
      const t = Number(el.dataset.t || 0)
      const s = el.dataset.s || ''
      if (!Number.isFinite(t)) return
      let c = 0
      const step = t / 55
      const tmr = window.setInterval(() => {
        c = Math.min(c + step, t)
        el.textContent = `${Math.round(c)}${s}`
        if (c >= t) window.clearInterval(tmr)
      }, 16)
    }
    const pillObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
            ; (e.target as HTMLElement).querySelectorAll<HTMLElement>('.pill-n').forEach(animN)
          pillObs.unobserve(e.target)
        })
      },
      { threshold: 0.5 },
    )
    root.querySelectorAll('.hero-pills').forEach((el) => pillObs.observe(el))

    // Scroll reveal
    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => el.classList.add('pre'))
    const rv = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          requestAnimationFrame(() => {
            el.classList.add('on')
            el.classList.add('reveal--in') // avoid global blur reveal
          })
          rv.unobserve(el)
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' },
    )
    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => rv.observe(el))

    // USP accordion
    root.querySelectorAll<HTMLElement>('.ui').forEach((item) => {
      const hd = item.querySelector<HTMLElement>('.ui-hd')
      hd?.addEventListener('click', () => {
        const was = item.classList.contains('on')
        root.querySelectorAll<HTMLElement>('.ui').forEach((i) => i.classList.remove('on'))
        if (!was) item.classList.add('on')
      })
    })

    // Walkthrough tabs
    root.querySelectorAll<HTMLElement>('.wtab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const p = tab.dataset.p
        root.querySelectorAll<HTMLElement>('.wtab').forEach((t) => t.classList.remove('on'))
        root.querySelectorAll<HTMLElement>('.wpanel').forEach((pnl) => pnl.classList.remove('on'))
        tab.classList.add('on')
        root.querySelector<HTMLElement>(`.wpanel[data-p="${p}"]`)?.classList.add('on')
      })
    })

    // Modal data (for inline onclick="openM('...')")
    const MD: Record<string, ModalDatum> = {
      residential: {
        ico: 'fa-city',
        ttl: 'Residential Real Estate',
        sub: 'All modules applicable — the primary use case',
        imps: [
          { v: '+55%', l: 'Lead-to-booking conversion' },
          { v: '−80%', l: 'Onboarding time' },
          { v: '−75%', l: 'Brokerage disputes' },
        ],
        body: `<h5>How developers use CP Management daily</h5><p>CP ops reviews new registrations and monitors walk-in activity. Finance receives digitally submitted invoices that push to SAP automatically. Marketing tracks which collateral drives site visits. Leadership monitors channel health on one dashboard.</p><h5>Key outcomes</h5><ul><li>CP activation rate rises from 30–40% to 52–65% within 90 days</li><li>Invoice processing TAT drops from 18–35 days to 5–10 days</li><li>Collateral reach per CP grows from 30 contacts/month to 60–120</li><li>Brokerage disputes fall from 12–20% to under 5% of monthly payouts</li><li>CP 12-month retention improves 20–35% with the loyalty engine</li></ul><h5>Who buys it</h5><p>VP Channel Sales or Head of CP Operations at Tier A or Tier B developers. Measured on CP activation rate, bookings from CP channel, and brokerage payable TAT.</p>`,
      },
      commercial: {
        ico: 'fa-building',
        ttl: 'Commercial Real Estate',
        sub: 'High deal-value precision — errors are disproportionately costly',
        imps: [
          { v: 'INR 5Cr+', l: 'Deal sizes tracked' },
          { v: '100%', l: 'Audit trail in SAP' },
          { v: '−65%', l: 'Invoice processing time' },
        ],
        body: `<h5>How commercial developers use CP Management</h5><p>Commercial developers manage fewer CPs but with significantly larger deal sizes. A single brokerage error on an INR 5Cr+ transaction is a financial and legal liability. CP Management gives full booking-level visibility, precise brokerage calculation, and a direct audit trail into SAP.</p><h5>Key use cases</h5><ul><li>Track high-value lease and sale transactions with CP-level brokerage breakdown</li><li>Manage NRI/OS transaction brokerage with different rate structures accurately</li><li>Provide brokers real-time invoice status on long-duration commercial deals</li><li>Generate analytics on CP performance by asset class and geography</li></ul><h5>Profile</h5><p>Mid to large commercial developer or REIT with 50–500 CPs. Deal values INR 5Cr+ per transaction. India metros and GCC.</p>`,
      },
      luxury: {
        ico: 'fa-gem',
        ttl: 'Luxury & Ultra-Luxury Residential',
        sub: 'Premium CP relationships demand premium recognition',
        imps: [
          { v: 'Gold', l: 'Airport lounge access' },
          { v: '20–150', l: 'Curated CP network' },
          { v: '+35%', l: 'Top CP retention' },
        ],
        body: `<h5>Why luxury developers need CP Management</h5><p>Luxury developers lose top CPs to competitors offering structured recognition programs. A broker generating crore-level commissions with no formal reward structure feels undervalued — and acts accordingly. CP Management changes that dynamic.</p><h5>Key use cases</h5><ul><li>Gold-tier CPs unlock airport lounge access, international experiences, and curated travel</li><li>Personalised collateral ensures brand consistency — no blurry WhatsApp screenshots of premium properties</li><li>Analytics enable CP segmentation by buyer profile — NRI, HNI, investor — for targeted outreach</li><li>Tier-based reward structure formally recognises the top 20% driving 80% of revenue</li></ul><h5>Profile</h5><p>Ultra-luxury developer with ASPs above INR 5Cr per unit. 20–150 active CPs. Mumbai, Delhi NCR, Dubai, Abu Dhabi.</p>`,
      },
      affordable: {
        ico: 'fa-house',
        ttl: 'Affordable Housing at Scale',
        sub: 'High volume, fast activation, zero lead loss',
        imps: [
          { v: '5,000+', l: 'CP network capacity' },
          { v: '2 hrs', l: 'Temp reg to first lead' },
          { v: '3×', l: 'Invoice throughput vs manual' },
        ],
        body: `<h5>How affordable housing developers use CP Management</h5><p>Affordable housing requires rapid CP activation at scale. With 500–5,000 CPs across Tier 1 and Tier 2 cities, manual onboarding is impossible to sustain. Temporary registration eliminates lead loss during the registration lag.</p><h5>Key use cases</h5><ul><li>Temporary registration lets walk-in CPs capture leads before RERA verification completes</li><li>Ladder schemes incentivise volume-based brokers — more bookings, higher tier, better rewards</li><li>Invoice automation handles high transaction throughput without increasing finance headcount</li><li>Broadcast notifications push new scheme updates to the entire CP network instantly</li></ul><h5>Profile</h5><p>Government-backed or private affordable developer. 5,000–50,000 units per year. 500–5,000 CPs. Tier 1 and Tier 2 Indian cities.</p>`,
      },
      gcc: {
        ico: 'fa-globe',
        ttl: 'GCC Expansion — UAE & Saudi Arabia',
        sub: 'Built and ready for GCC deployment — coming soon',
        imps: [
          { v: 'AED/SAR', l: 'Multi-currency wallet' },
          { v: 'Arabic', l: 'Full UI localisation' },
          { v: 'UAE RERA', l: 'Compliance framework' },
        ],
        body: `<h5>Why GCC is the highest-value market</h5><p>GCC developers manage large international CP networks across time zones, currencies, and regulatory frameworks with no structured tooling. Deal sizes are larger than India, NRI brokerage has different rates, and event management for roadshows has zero structured infrastructure today.</p><h5>Key use cases</h5><ul><li>Arabic-language interface for CP-facing app and admin dashboard</li><li>Multi-currency wallet and redemption in AED, SAR, QAR — no INR conversion</li><li>NRI/OS brokerage tracking with correct rate application and full audit trail</li><li>Event RSVP management for international developer roadshows and launch events</li><li>UAE RERA broker verification and PDPL-compliant data residency</li></ul><h5>Profile</h5><p>Developers with AED 500M–5B+ annual sales. UAE, Saudi Arabia, Qatar. High proportion of international and NRI buyers. USD 50,000–120,000 ACV at enterprise tier.</p>`,
      },
    }

    const mbd = root.querySelector<HTMLElement>('#mbd')
    const popupClose = (force?: boolean) => {
      if (!mbd) return
      if (force) {
        mbd.classList.remove('on')
        document.body.style.overflow = ''
      }
    }

      ; (window as any).openM = (k: string) => {
        const d = MD[k]
        if (!d || !mbd) return
        const mIco = root.querySelector<HTMLElement>('#mIco')
        const mTtl = root.querySelector<HTMLElement>('#mTtl')
        const mSub = root.querySelector<HTMLElement>('#mSub')
        const mImps = root.querySelector<HTMLElement>('#mImps')
        const mBody = root.querySelector<HTMLElement>('#mBody')
        if (mIco) mIco.innerHTML = `<i class="fa-solid ${d.ico}"></i>`
        if (mTtl) mTtl.textContent = d.ttl
        if (mSub) mSub.textContent = d.sub
        if (mImps) mImps.innerHTML = d.imps.map((i) => `<div class="m-ic"><div class="v">${i.v}</div><div class="l">${i.l}</div></div>`).join('')
        if (mBody) mBody.innerHTML = d.body
        mbd.classList.add('on')
        document.body.style.overflow = 'hidden'
      }
      ; (window as any).closeM = (e: MouseEvent) => {
        if (!mbd) return
        if (e.target === mbd) popupClose(true)
      }
      ; (window as any).closeMd = () => popupClose(true)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') popupClose(true)
    }
    document.addEventListener('keydown', onKeyDown)

    const lenisScroll = createLenisScrollSync()
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)

    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.teams-tabs .team-tab'))
    const switchTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => t.classList.remove('active'))
      root.querySelectorAll<HTMLElement>('.teams-panel').forEach((p) => p.classList.remove('active'))
      tabEl?.classList.add('active')
      root.querySelector<HTMLElement>(`#team-${CSS.escape(teamId)}`)?.classList.add('active')
    }
    const teamIds: string[] = []
    teamTabs.forEach((tab) => {
      const m = (tab.getAttribute('onclick') ?? '').match(/switchTeam\(this,\s*'([^']+)'\s*\)/)
      if (m?.[1]) teamIds.push(m[1])
    })
      ; (window as unknown as { switchTeam?: (el: HTMLElement, id: string) => void }).switchTeam = (
        _el: HTMLElement,
        id: string,
      ) => {
        const idx = teamIds.indexOf(id)
        if (idx >= 0 && teamTabs[idx]) switchTeam(id, teamTabs[idx]!)
        else switchTeam(id)
      }

    let teamStorySt: ScrollTrigger | null = null
    const scrollToTeamIndex = (idx: number) => {
      if (!teamIds[idx] || !teamTabs[idx]) return
      if (!teamStorySt) {
        switchTeam(teamIds[idx]!, teamTabs[idx]!)
        return
      }
      const st = teamStorySt
      const n = teamIds.length
      if (n <= 1) {
        switchTeam(teamIds[0]!, teamTabs[0]!)
        return
      }
      const p = idx / (n - 1)
      const y = st.start + p * (st.end - st.start)
      scrollDocumentToY(lenisScroll.instance, y)
    }

    const teamHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    teamTabs.forEach((tab) => {
      const m = (tab.getAttribute('onclick') ?? '').match(/switchTeam\(this,\s*'([^']+)'\s*\)/)
      const teamId = m?.[1]
      if (!teamId) return
      const fn = (e: Event) => {
        e.preventDefault()
        const idx = teamIds.indexOf(teamId)
        if (idx >= 0) scrollToTeamIndex(idx)
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })
    const initialTab = teamTabs.find((t) => t.classList.contains('active'))
    const im = (initialTab?.getAttribute('onclick') ?? '').match(/switchTeam\(this,\s*'([^']+)'\s*\)/)
    if (im?.[1]) switchTeam(im[1], initialTab)

    const refreshTeamScroll = () => {
      requestAnimationFrame(() => {
        lenisScroll.resize()
        ScrollTrigger.refresh()
      })
    }
    const gsapCtx = gsap.context(() => {
      teamStorySt = initCpTeamsGsap(root, { teamTabs, teamIds, switchTeam })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
    }, root)
    const onLayoutRefresh = () => refreshTeamScroll()
    if (document.readyState === 'complete') onLayoutRefresh()
    else window.addEventListener('load', onLayoutRefresh)
    const lateLayout = window.setTimeout(() => refreshTeamScroll(), 250)
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeTimer = undefined
        refreshTeamScroll()
      }, 100)
    }
    window.addEventListener('resize', onResize, { passive: true })

    const anchorHandlers: Array<{ el: HTMLAnchorElement; fn: (e: MouseEvent) => void }> = []
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const fn = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href || href === '#') return
        const t = root.querySelector<HTMLElement>(href)
        if (!t) return
        e.preventDefault()
        const top = t.getBoundingClientRect().top + window.scrollY - CP_NAV_OFFSET_PX - 4
        scrollDocumentToY(lenisScroll.instance, top)
      }
      a.addEventListener('click', fn)
      anchorHandlers.push({ el: a, fn })
    })

    return () => {
      innerScrollCleanup()
      gsapCtx.revert()
      lenisScroll.destroy()
      clearTimeout(lateLayout)
      window.removeEventListener('load', onLayoutRefresh)
      window.removeEventListener('resize', onResize)
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      anchorHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      delete (window as unknown as { switchTeam?: unknown }).switchTeam
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      pillObs.disconnect()
      rv.disconnect()
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="cp-management-root min-h-dvh bg-[#F6F4EE]">
      {headLinks.map((l) => (
        <link
          key={`${l.rel}:${l.href}`}
          rel={l.rel}
          href={l.href}
          crossOrigin={
            l.crossOrigin === 'anonymous'
              ? 'anonymous'
              : l.crossOrigin === 'use-credentials'
                ? 'use-credentials'
                : undefined
          }
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>CP Management error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}

