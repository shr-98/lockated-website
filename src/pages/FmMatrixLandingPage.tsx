import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void gsap.registerPlugin(ScrollTrigger)

/** Pinned sections + #navbar must stay below a fixed 68px header. */
const FM_NAV_OFFSET_PX = 68
/** Team Use Cases: scroll distance per tab (smaller = faster progression). */
const FM_TEAM_STORY_SCROLL_PER_TAB_VH = 0.7

function initFmTeamUseCasesGsap(
  root: HTMLElement,
  opts: { teamTabs: HTMLElement[]; teamIds: string[]; switchTeam: (teamId: string, tabEl?: HTMLElement) => void },
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
    id: 'fm-teams-use-cases',
    trigger: pin,
    start: `top ${FM_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * FM_TEAM_STORY_SCROLL_PER_TAB_VH}`,
    pin: true,
    pinSpacing: true,
    pinType: 'transform',
    anticipatePin: 0,
    fastScrollEnd: true,
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
 * `public/fm-matrix.html` ships its own `.reveal` animation. The app `index.css`
 * adds a global blur reveal — scope overrides + Tailwind/UA fixes (same structure
 * as Vendor Management).
 */
const FM_MATRIX_ISOLATION_CSS = `
.fm-matrix-root {
  position: relative;
  isolation: isolate;
}
/* Window scroll + anchor jumps should land below fixed nav (Vendor-style). */
html:has(.fm-matrix-root) {
  scroll-padding-top: ${FM_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.fm-matrix-root section[id],
.fm-matrix-root .teams-section#teams {
  scroll-margin-top: ${FM_NAV_OFFSET_PX + 4}px;
}
/* Keep the fixed nav above pinned content (ScrollTrigger may set z-index on pin). */
.fm-matrix-root #navbar {
  z-index: 10050;
}
.fm-matrix-root #teamsStoryPin {
  z-index: 1 !important;
}
/* Pin-spacer background: avoid “gap” seams while pinned. */
.fm-matrix-root .pin-spacer {
  background: var(--band, #E8E2D6) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.fm-matrix-root #teamsStoryPin {
  background: var(--band, #E8E2D6) !important;
  min-height: calc(100vh - ${FM_NAV_OFFSET_PX}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.fm-matrix-root .teams-layout {
  align-items: stretch !important;
  flex: 1;
}
.fm-matrix-root .fm-matrix-teams-panel.active {
  align-items: stretch !important;
}
.fm-matrix-root .fm-matrix-teams-panel.active > div {
  height: 100%;
}

.fm-matrix-root .reveal {
  opacity: 0 !important;
  transform: translateY(40px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.fm-matrix-root .reveal.visible,
.fm-matrix-root .reveal.reveal--in {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
.fm-matrix-root h1,
.fm-matrix-root h2,
.fm-matrix-root h3,
.fm-matrix-root h4,
.fm-matrix-root h5,
.fm-matrix-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
@media (prefers-reduced-motion: reduce) {
  .fm-matrix-root .reveal,
  .fm-matrix-root .reveal.visible,
  .fm-matrix-root .reveal.reveal--in {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.fm-matrix-root .walkthrough-section {
  background-color: var(--bg-cream) !important;
}
.fm-matrix-root .features-section {
  background-color: var(--bg-cream) !important;
}
.fm-matrix-root .teams-section {
  background-color: var(--band) !important;
}
.fm-matrix-root .contact-section {
  background-color: var(--bg-cream) !important;
}
.fm-matrix-root .usecase-card {
  background-color: var(--surface) !important;
}
.fm-matrix-root .visual-dashboard {
  background-color: var(--surface) !important;
}
.fm-matrix-root .solutions-visual {
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg-cream) 100%) !important;
}
.fm-matrix-root .form-group input,
.fm-matrix-root .form-group select,
.fm-matrix-root .form-group textarea {
  background-color: var(--surface) !important;
  color: var(--dark) !important;
}
.fm-matrix-root .form-group input:-webkit-autofill,
.fm-matrix-root .form-group input:-webkit-autofill:hover,
.fm-matrix-root .form-group input:-webkit-autofill:focus,
.fm-matrix-root .form-group textarea:-webkit-autofill,
.fm-matrix-root .form-group textarea:-webkit-autofill:hover,
.fm-matrix-root .form-group textarea:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface) inset !important;
  box-shadow: 0 0 0 1000px var(--surface) inset !important;
  -webkit-text-fill-color: var(--dark) !important;
}
.fm-matrix-root button.btn-primary,
.fm-matrix-root .btn-primary {
  color: var(--on-primary) !important;
}
.fm-matrix-root button.btn-outline {
  background-color: transparent !important;
}
.fm-matrix-root .walk-tab {
  background-color: var(--bg-cream) !important;
}
.fm-matrix-root .fm-matrix-team-tab {
  background-color: var(--surface) !important;
}
.fm-matrix-root .fm-matrix-team-tab.active {
  background-color: rgba(218, 119, 86, 0.05) !important;
}
.fm-matrix-root .pain-section {
  background-color: var(--bg-cream) !important;
}
.fm-matrix-root #end-banner.cta-banner {
  background-color: var(--band) !important;
}
.fm-matrix-root footer {
  background-color: var(--bg-cream) !important;
}
.fm-matrix-root .btn-banner-primary {
  color: var(--on-primary) !important;
}
`

export default function FmMatrixLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/fm-matrix.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /fm-matrix.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')
        const style = doc.querySelector('style')?.textContent ?? ''
        const body = doc.body?.innerHTML ?? ''

        if (!style.trim() || !body.trim()) {
          throw new Error('`public/fm-matrix.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
        setCssText(`${style}\n${FM_MATRIX_ISOLATION_CSS}`)
        setBodyHtml(body)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load FM Matrix content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl) return
    if (!bodyHtml) return
    const root = rootEl

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal on scroll (also add `reveal--in` to avoid global blur reveal)
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
        }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )
    root.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

    // Counters
    function animateCounters() {
      root.querySelectorAll<HTMLElement>('[data-target]').forEach((el) => {
        const t = Number.parseInt(el.dataset.target || '', 10)
        const s = el.dataset.suffix || ''
        if (!Number.isFinite(t)) return
        let c = 0
        const inc = t / 60
        const timer = window.setInterval(() => {
          c += inc
          if (c >= t) {
            c = t
            window.clearInterval(timer)
          }
          el.textContent = `${Math.floor(c)}${s}`
        }, 25)
      })
    }
    const metrics = root.querySelector('.hero-metrics')
    const countersObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          animateCounters()
          countersObserver.unobserve(e.target)
        })
      },
      { threshold: 0.5 },
    )
    if (metrics) countersObserver.observe(metrics)

    // Solutions accordion
    root.querySelectorAll<HTMLElement>('.solution-item').forEach((item) => {
      const header = item.querySelector<HTMLElement>('.solution-header')
      header?.addEventListener('click', () => {
        root.querySelectorAll<HTMLElement>('.solution-item').forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
      })
    })

    // Team use-case tabs
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.fm-matrix-team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.fm-matrix-teams-panel'))
    const switchFmTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => t.classList.remove('active'))
      teamPanels.forEach((p) => p.classList.remove('active'))
      tabEl?.classList.add('active')
      root.querySelector<HTMLElement>(`#fm-team-${CSS.escape(teamId)}`)?.classList.add('active')
    }
    const teamTabsAbort = new AbortController()
    const { signal: teamTabsSignal } = teamTabsAbort
    teamTabs.forEach((tab) => {
      const teamId = tab.dataset.team
      if (!teamId) return
      const activate = (e: Event) => {
        e.preventDefault()
        switchFmTeam(teamId, tab)
      }
      tab.addEventListener('click', activate, { signal: teamTabsSignal })
      tab.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'Enter' || e.key === ' ') activate(e)
        },
        { signal: teamTabsSignal },
      )
    })
    const initialTeam = teamTabs.find((t) => t.classList.contains('active'))
    if (initialTeam?.dataset.team) switchFmTeam(initialTeam.dataset.team, initialTeam)

    // Vendor-style: pin #teams and advance tabs via scroll
    const teamIds = teamTabs.map((t) => t.dataset.team || '').filter(Boolean)
    const teamsStoryTrigger = initFmTeamUseCasesGsap(root, { teamTabs, teamIds, switchTeam: switchFmTeam })

    // Walkthrough tabs
    type WalkthroughDatum = { title: string; name: string; desc: string; highlights: string[] }
    const wd: WalkthroughDatum[] = [
      {
        title: 'Helpdesk — Live Ticket Dashboard',
        name: 'Intelligent Helpdesk',
        desc: 'Every maintenance request lands in a single, intelligent queue — auto-categorised, auto-assigned, and tracked through five escalation levels. No ticket stagnates. No technician is overloaded.',
        highlights: [
          '5-level auto-escalation with configurable TAT per level',
          'Smart assignment based on skill, location, and workload',
          'Integrated cost approval for spend above threshold',
          'Real-time SLA dashboard with breach prediction',
        ],
      },
      {
        title: 'CAM Billing — Invoice Generator',
        name: 'Automated CAM Billing',
        desc: 'Auto-calculate Common Area Maintenance charges from tenant occupancy data, generate invoices in one click, and track payments in real-time. No spreadsheets. No disputes. No 12-day billing cycles.',
        highlights: [
          'Auto-calculation from occupancy data and billing rules',
          'One-click invoice generation and distribution',
          'Payment tracking with automated reminders',
          'Complete audit trail for every charge',
        ],
      },
      {
        title: 'Compliance — Certificate Tracker',
        name: 'Compliance Automation',
        desc: 'Every fire NOC, lift inspection, AMC renewal, and statutory certificate tracked in one registry with multi-channel alerts to FM teams, admin staff, and vendors — well before renewal deadlines hit.',
        highlights: [
          'Automated multi-channel renewal alerts',
          'Direct email triggers to AMC vendors',
          'Real-time compliance status dashboard',
          'Full audit trail for regulatory submissions',
        ],
      },
      {
        title: 'Visitor & Gate — Access Control',
        name: 'Visitor & Gate Management',
        desc: 'Face-scan entry for pre-approved staff, digital passes for visitors, QR checkpoint patrolling with missed-scan alerts, and complete vehicle tracking — all in a single, tamper-proof security module.',
        highlights: [
          'Face-scan gate entry for approved staff',
          'Digital visitor passes with pre-registration',
          'QR checkpoint patrolling with accountability alerts',
          'Registered and guest vehicle tracking',
        ],
      },
      {
        title: 'Asset — Lifecycle Management',
        name: 'Asset Lifecycle Management',
        desc: 'Register, tag, and track every asset from installation to disposal. Link components with EBOM, monitor warranties, calculate total cost of ownership, and make data-driven repair-vs-replace decisions.',
        highlights: [
          'EBOM — Engineering Bill of Materials per asset',
          'Warranty & AMC alert management',
          'Total cost of ownership tracking',
          'Associated assets linking for dependency awareness',
        ],
      },
      {
        title: 'Utility — Energy & Water Dashboard',
        name: 'Energy & Utility Monitoring',
        desc: 'Track electricity consumption, detect water leaks, log waste generation by type, and monitor STP operations — all from a single Utility dashboard that makes ESG reporting effortless.',
        highlights: [
          'Energy anomaly detection and alerts',
          'Water management with leak detection',
          'Waste categorisation — organic, recyclable, hazardous',
          'Green Inventory for ESG compliance reporting',
        ],
      },
    ]

    root.querySelectorAll<HTMLElement>('.walk-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        root.querySelectorAll<HTMLElement>('.walk-tab').forEach((t) => t.classList.remove('active'))
        tab.classList.add('active')
        const i = Number.parseInt(tab.dataset.walk || '0', 10)
        const d = wd[i] ?? wd[0]
        const title = root.querySelector<HTMLElement>('#walkScreenTitle')
        const name = root.querySelector<HTMLElement>('#walkFeatureName')
        const desc = root.querySelector<HTMLElement>('#walkFeatureDesc')
        const highlights = root.querySelector<HTMLElement>('#walkHighlights')
        if (title) title.textContent = d.title
        if (name) name.textContent = d.name
        if (desc) desc.textContent = d.desc
        if (highlights) {
          highlights.innerHTML = d.highlights
            .map(
              (h: string) =>
                `<div class="walk-highlight-item"><div class="walk-highlight-check"><i class="fas fa-check"></i></div><span>${h}</span></div>`,
            )
            .join('')
        }
      })
    })

    // Smooth anchor scroll for in-page links (with fixed-nav offset).
    // Some browsers ignore scroll-margin-top for scrollIntoView; do manual positioning.
    const smoothScrollTo = (id: string) => {
      const target = root.querySelector<HTMLElement>(id)
      if (!target) return false
      const top = target.getBoundingClientRect().top + window.scrollY - FM_NAV_OFFSET_PX - 4
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      return true
    }

    const anchorHandlers: Array<{ el: HTMLAnchorElement; fn: (e: MouseEvent) => void }> = []
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const fn = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href || href === '#') return
        if (!href.startsWith('#')) return
        if (!root.querySelector<HTMLElement>(href)) return
        e.preventDefault()
        smoothScrollTo(href)
      }
      a.addEventListener('click', fn)
      anchorHandlers.push({ el: a, fn })
    })

    // If route loads with a hash, apply the same offset once content exists.
    if (window.location.hash) {
      window.requestAnimationFrame(() => smoothScrollTo(window.location.hash))
    }
    const onHashChange = () => {
      if (window.location.hash) smoothScrollTo(window.location.hash)
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('scroll', onScroll)
      revealObserver.disconnect()
      countersObserver.disconnect()
      teamTabsAbort.abort()
      teamsStoryTrigger?.kill(true)
      window.removeEventListener('hashchange', onHashChange)
      anchorHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="fm-matrix-root min-h-dvh bg-[#F6F4EE]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>FM Matrix error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

