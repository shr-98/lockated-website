import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void gsap.registerPlugin(ScrollTrigger)

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/** Fixed nav clearance (matches `public/post-possession.html` bar height). */
const POST_POSSESSION_NAV_OFFSET_PX = 76
/** Team Use Cases: scroll distance per tab (aligned with vendor management route). */
const TEAM_STORY_SCROLL_PER_TAB_VH = 0.7

type TeamUseCasesGsapOpts = {
  teamTabs: HTMLElement[]
  teamIds: string[]
  switchTeam: (teamId: string, tabEl?: HTMLElement) => void
}

/**
 * Pin “Built for Every Team” and advance tabs from scroll (desktop SPA only).
 * Mobile / reduced motion: no pin; tabs stay click-only.
 */
function initTeamUseCasesGsap(
  root: HTMLElement,
  opts: TeamUseCasesGsapOpts,
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
    id: 'post-possession-teams-use-cases',
    trigger: pin,
    start: `top ${POST_POSSESSION_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * TEAM_STORY_SCROLL_PER_TAB_VH}`,
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

/** Tailwind preflight + global heading fonts — keep panels/tabs aligned with warm tokens in `post-possession.html`. */
const POST_POSSESSION_ISOLATION_CSS = `
.post-possession-root {
  position: relative;
  isolation: isolate;
}
html:has(.post-possession-root) {
  scroll-padding-top: ${POST_POSSESSION_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.post-possession-root section[id],
.post-possession-root #teams {
  scroll-margin-top: ${POST_POSSESSION_NAV_OFFSET_PX + 4}px;
}
.post-possession-root #navbar {
  z-index: 10050;
}
.post-possession-root #teamsStoryPin {
  z-index: 1 !important;
}
.post-possession-root .pin-spacer {
  background: var(--bg) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.post-possession-root .team-panel.active {
  align-items: stretch !important;
}
.post-possession-root .team-panel.active .team-visual {
  height: 100%;
  align-self: stretch;
  aspect-ratio: auto;
  min-height: 260px;
}
.post-possession-root h1,
.post-possession-root h2,
.post-possession-root h3,
.post-possession-root h4,
.post-possession-root h5,
.post-possession-root h6 {
  font-family: var(--font-display, 'Poppins'), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.post-possession-root button.wt-tab,
.post-possession-root button.team-tab {
  font-family: var(--font-body), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.post-possession-root button.wt-tab {
  background: transparent !important;
}
.post-possession-root button.wt-tab:hover {
  background: var(--bg-card) !important;
  color: var(--text) !important;
}
.post-possession-root button.wt-tab.active {
  background: rgba(218, 119, 86, 0.1) !important;
  color: var(--brand) !important;
}
.post-possession-root button.team-tab {
  background: transparent !important;
}
.post-possession-root button.team-tab:hover {
  background: var(--bg-card) !important;
}
.post-possession-root button.team-tab.active {
  background: var(--brand) !important;
  color: var(--on-primary) !important;
  border-color: var(--brand) !important;
}
.post-possession-root .form-input,
.post-possession-root select.form-input,
.post-possession-root textarea.form-input {
  background-color: var(--bg-alt) !important;
  color: var(--text) !important;
}
.post-possession-root .form-input:focus {
  background-color: var(--bg-card) !important;
}
.post-possession-root .btn-primary {
  color: var(--on-primary) !important;
}
.post-possession-root .pain-card,
.post-possession-root .testi-card,
.post-possession-root .usp-visual,
.post-possession-root .wt-screen,
.post-possession-root .tf-row,
.post-possession-root .team-visual,
.post-possession-root .uc-card,
.post-possession-root .contact-form-card {
  background-color: var(--bg-card) !important;
}
`

/** Mirrors `wtData` in `public/post-possession.html` — walkthrough tab copy (scripts in injected HTML do not run). */
const WT_DATA: { label: string; num: string; title: string; desc: string; feats: string[] }[] = [
  {
    label: 'postpossession.app · Home',
    num: 'Module 1 of 6',
    title: 'A home screen that runs their day.',
    desc: "The resident's command centre — visitor approvals, maintenance tickets, notices, billing, and community updates in one branded screen. Rolling developer banners keep your new launches front and centre.",
    feats: [
      'One-tap visitor approval from anywhere',
      'Live maintenance ticket status at a glance',
      'Personalised community announcements',
      'Developer banners for new project launches',
      'Quick access to payments, bookings, and services',
    ],
  },
  {
    label: 'postpossession.app · My Club',
    num: 'Module 2 of 6',
    title: 'Amenity booking. No phone calls.',
    desc: 'Residents book clubhouse, gym, pool, courts, and sub-facilities directly from the app. Every slot managed, every booking billed automatically. Club memberships tracked with auto-expiry alerts.',
    feats: [
      'Self-service facility booking with instant confirmation',
      'Sub-facility management (courts, lanes, rooms)',
      'Club membership with expiry alerts and auto-renewal',
      'Automated usage-based billing per session',
      'Unique resident QR code for contactless access',
    ],
  },
  {
    label: 'postpossession.app · Visitors',
    num: 'Module 3 of 6',
    title: 'Gate security that never sleeps.',
    desc: '25+ visitor management features replacing every paper register, phone call, and manual process at your gate. Pre-authorised entry to child safety alerts — all real time, all digital.',
    feats: [
      'Pre-authorise guests, cabs, and deliveries in advance',
      'OTP and IVR approval for unexpected visitors from anywhere',
      'Child safety alerts and exit pre-approvals',
      'Guard app with offline mode for low-connectivity zones',
      'e-Intercom HD video call from gate to resident phone',
    ],
  },
  {
    label: 'postpossession.app · Loyalty',
    num: 'Module 4 of 6',
    title: 'Turn residents into your sales channel.',
    desc: 'The referral and loyalty engine that makes your happiest residents your most effective salespeople. Every referral tracked, every reward automated, every conversion attributed.',
    feats: [
      'One-click referral sharing via WhatsApp and social',
      'Real-time referral tracking for residents and developer CRM',
      'Automated UPI payout when referral converts to booking',
      'Points, rewards, and loyalty tiers for engagement',
      'New project launches pushed as warm leads to community',
    ],
  },
  {
    label: 'postpossession.app · Services',
    num: 'Module 5 of 6',
    title: 'A curated marketplace in every community.',
    desc: 'Residents book approved on-premise services without leaving your app. Deep cleaning, laundry, pest control, salons — all vetted by you, billed by you, revenue tracked by you.',
    feats: [
      'Category-wise curated on-premise service marketplace',
      'Slot scheduling based on staff bandwidth',
      'In-app payment with auto-generated invoice',
      'Zero unauthorised third-party vendors or apps',
      'Revenue share configurable per service category',
    ],
  },
  {
    label: 'postpossession.app · Events',
    num: 'Module 6 of 6',
    title: 'Community that feels alive.',
    desc: 'Events, wellness sessions, polls, and announcements that turn neighbours into a community. Higher engagement means higher NPS, more referrals, and a brand residents are proud to advocate.',
    feats: [
      'Developer-published events with RSVP and waitlist management',
      'Wellness webinars with doctors, dieticians, yoga instructors',
      'Polls and announcements with delivery read receipts',
      'Community gallery — residents share and celebrate',
      'Offers and coupons to drive on-premise service adoption',
    ],
  },
]

export default function PostPossessionLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor
    const prevBodyColor = document.body.style.color
    document.body.style.backgroundColor = '#F6F4EE'
    document.body.style.color = '#2C2C2C'
    return () => {
      document.body.style.backgroundColor = prevBodyBg
      document.body.style.color = prevBodyColor
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/post-possession.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /post-possession.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/post-possession.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${POST_POSSESSION_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Post Possession content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!bodyHtml) return

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Fade-in reveal
    const fadeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
          fadeObs.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    root.querySelectorAll<HTMLElement>('.fade-in').forEach((el) => fadeObs.observe(el))

    // Hero counters (metric-num)
    const counterTimers: number[] = []
    const animateMetric = (el: HTMLElement) => {
      const target = Number.parseFloat(el.dataset.target || '0')
      const suffix = el.dataset.suffix || ''
      if (!Number.isFinite(target) || target <= 0) return

      let current = 0
      const duration = 1600
      const step = 16
      const inc = target / (duration / step)
      const t = window.setInterval(() => {
        current = Math.min(current + inc, target)
        const isInt = Number.isInteger(target)
        el.textContent = `${isInt ? Math.round(current) : current.toFixed(1)}${suffix}`
        if (current >= target) window.clearInterval(t)
      }, step)
      counterTimers.push(t)
    }

    let countersStarted = false
    const heroMetrics = root.querySelector<HTMLElement>('.hero-metrics')
    const counterObs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (countersStarted) return
        countersStarted = true
        root.querySelectorAll<HTMLElement>('.metric-num[data-target]').forEach(animateMetric)
        counterObs.disconnect()
      },
      { threshold: 0.45 },
    )
    if (heroMetrics) counterObs.observe(heroMetrics)

    // USP accordion (inline onclick="openUsp(idx)")
    const setUsp = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.usp-item').forEach((it, i) => {
        it.classList.toggle('active', i === idx)
      })
      root.querySelectorAll<HTMLElement>('.usp-visual-inner').forEach((it, i) => {
        it.classList.toggle('visible', i === idx)
      })
      const dots = root.querySelectorAll<HTMLElement>('#uspDots .testi-dot')
      dots.forEach((d, i) => d.classList.toggle('active', i === idx))
    }
    ;(window as any).openUsp = (idx: number) => setUsp(Number(idx) || 0)
    setUsp(0)

    // Walkthrough tabs (inline onclick="selectWtTab(idx)")
    const setWt = (idx: number) => {
      const i = Math.max(0, Math.min(WT_DATA.length - 1, Math.floor(Number(idx) || 0)))
      root.querySelectorAll<HTMLElement>('#wtTabs .wt-tab').forEach((t, j) => t.classList.toggle('active', j === i))
      root.querySelectorAll<HTMLElement>('.feat-panel').forEach((p, j) => p.classList.toggle('visible', j === i))
      const d = WT_DATA[i]
      const screenTitle = root.querySelector('#wtScreenTitle')
      const infoLabel = root.querySelector('#wtInfoLabel')
      const infoTitle = root.querySelector('#wtInfoTitle')
      const infoDesc = root.querySelector('#wtInfoDesc')
      const featList = root.querySelector('#wtFeatList')
      if (screenTitle) screenTitle.textContent = d.label
      if (infoLabel) infoLabel.textContent = d.num
      if (infoTitle) infoTitle.textContent = d.title
      if (infoDesc) infoDesc.textContent = d.desc
      if (featList) {
        featList.innerHTML = d.feats
          .map(
            (f) =>
              `<div class="wt-feat-row"><i class="fa-solid fa-check-circle"></i><span>${f.replace(/</g, '&lt;')}</span></div>`,
          )
          .join('')
      }
    }
    ;(window as any).selectWtTab = (idx: number) => setWt(Number(idx) || 0)
    setWt(0)

    // Team tabs — scroll-driven story (desktop) + click-to-scroll; static HTML <script> does not run here
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.teams-tabs .team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.team-panel'))
    const teamIds = teamTabs.map((_, i) => String(i))
    const switchTeam = (teamId: string) => {
      const idx = teamIds.indexOf(teamId)
      const i = idx >= 0 ? idx : 0
      teamTabs.forEach((t, j) => t.classList.toggle('active', j === i))
      teamPanels.forEach((p, j) => p.classList.toggle('active', j === i))
    }
    let teamStorySt: ScrollTrigger | null = null
    const scrollToTeamIndex = (idx: number) => {
      if (!teamIds[idx] || !teamTabs[idx]) return
      if (!teamStorySt) {
        switchTeam(teamIds[idx]!)
        return
      }
      const st = teamStorySt
      const n = teamIds.length
      if (n <= 1) {
        switchTeam(teamIds[0]!)
        return
      }
      const p = idx / (n - 1)
      const y = st.start + p * (st.end - st.start)
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    const teamHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    teamTabs.forEach((tab, idx) => {
      const fn = (e: Event) => {
        e.preventDefault()
        scrollToTeamIndex(idx)
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })
    const initialTeamIdx = teamTabs.findIndex((t) => t.classList.contains('active'))
    switchTeam(teamIds[initialTeamIdx >= 0 ? initialTeamIdx : 0]!)

    const selectTeamGlobal = (idx: number) => {
      const i = Math.max(0, Math.min(teamIds.length - 1, Math.floor(Number(idx) || 0)))
      scrollToTeamIndex(i)
    }
    ;(window as any).selectTeam = selectTeamGlobal
    ;(window as any).selectTeamTab = selectTeamGlobal

    const refreshTeamScroll = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }
    const gsapCtx = gsap.context(() => {
      teamStorySt = initTeamUseCasesGsap(root, { teamTabs, teamIds, switchTeam })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
        })
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

    // Smooth anchors
    const anchorHandlers: Array<{ a: HTMLAnchorElement; onClick: (e: MouseEvent) => void }> = []
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const onClick = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href) return
        const t = root.querySelector<HTMLElement>(href)
        if (!t) return
        e.preventDefault()
        t.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      a.addEventListener('click', onClick)
      anchorHandlers.push({ a, onClick })
    })

    return () => {
      gsapCtx.revert()
      clearTimeout(lateLayout)
      window.removeEventListener('load', onLayoutRefresh)
      window.removeEventListener('resize', onResize)
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)
      window.removeEventListener('scroll', onScroll)
      fadeObs.disconnect()
      counterObs.disconnect()
      counterTimers.forEach((t) => window.clearInterval(t))
      anchorHandlers.forEach(({ a, onClick }) => a.removeEventListener('click', onClick))
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      delete (window as any).openUsp
      delete (window as any).selectWtTab
      delete (window as any).selectTeam
      delete (window as any).selectTeamTab
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="post-possession-root min-h-dvh bg-[#F6F4EE]">
      {/* Ensure same external assets as the provided HTML */}
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
        <div style={{ padding: 24 }}>Post Possession error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

