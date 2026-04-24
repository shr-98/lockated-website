import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/** Pinned nav offset — match vendor-management / post-sales.html `#navbar`. */
const POST_SALES_NAV_OFFSET_PX = 68
/** Team Use Cases: scroll distance per tab (same as Vendor Management). */
const TEAM_STORY_SCROLL_PER_TAB_VH = 1.2

type TeamUseCasesGsapOpts = {
  teamTabs: HTMLElement[]
  teamIds: string[]
  switchTeam: (teamId: string, tabEl?: HTMLElement) => void
}

/**
 * “Built for Every Team” — pin section and advance tabs from scroll (desktop; reduced motion / narrow: click only).
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
    id: 'post-sales-teams-use-cases',
    trigger: pin,
    start: `top ${POST_SALES_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * TEAM_STORY_SCROLL_PER_TAB_VH}`,
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

/** Warm tokens in `post-sales.html` + Tailwind preflight — match Post Possession / Snag integration. */
const POST_SALES_ISOLATION_CSS = `
.post-sales-root {
  position: relative;
  isolation: isolate;
}
html:has(.post-sales-root) {
  scroll-padding-top: ${POST_SALES_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.post-sales-root section[id],
.post-sales-root .teams-section#teams {
  scroll-margin-top: ${POST_SALES_NAV_OFFSET_PX + 4}px;
}
.post-sales-root #navbar {
  z-index: 10050;
}
.post-sales-root #teamsStoryPin {
  z-index: 1 !important;
  background: var(--bg, #F6F4EE) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
  min-height: 0 !important;
  max-height: calc(100dvh - ${POST_SALES_NAV_OFFSET_PX}px) !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
.post-sales-root #teamsStoryPin > .container:first-of-type {
  flex: 0 0 auto !important;
}
.post-sales-root #teamsStoryPin > .container:nth-of-type(2) {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
.post-sales-root #teamsStoryPin .teams-main {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  -webkit-overflow-scrolling: touch !important;
  padding-bottom: 32px !important;
  scroll-padding-bottom: 24px !important;
}
.post-sales-root #teamsStoryPin .teams-story-progress {
  flex: 0 0 auto !important;
}
.post-sales-root .pin-spacer {
  background: var(--bg) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.post-sales-root h1,
.post-sales-root h2,
.post-sales-root h3,
.post-sales-root h4,
.post-sales-root h5,
.post-sales-root h6 {
  font-family: var(--font-display, 'Poppins'), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.post-sales-root button.wt-tab {
  font-family: var(--font-body), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
  background: transparent !important;
}
.post-sales-root button.wt-tab:hover {
  background: var(--bg-card) !important;
  color: var(--text) !important;
}
.post-sales-root button.wt-tab.active {
  background: rgba(218, 119, 86, 0.1) !important;
  color: var(--brand) !important;
}
/* Teams: compact mock card like vendor (no vertical stretch / empty frame) */
.post-sales-root .teams-panel.active {
  align-items: start !important;
}
.post-sales-root .teams-panel.active > .team-info,
.post-sales-root .teams-panel.active > .team-visual {
  height: auto !important;
  min-width: 0;
}
.post-sales-root .team-visual {
  display: flex !important;
  flex-direction: column !important;
  align-self: start !important;
  justify-self: end !important;
  width: 100% !important;
  max-width: min(100%, var(--team-visual-max-w, 380px)) !important;
  min-height: 0 !important;
  aspect-ratio: auto !important;
}
@media (max-width: 767px) {
  /* No GSAP pin below 768px — undo viewport cap + inner scroll. */
  .post-sales-root #teamsStoryPin {
    max-height: none !important;
    display: block !important;
    overflow: visible !important;
  }
  .post-sales-root #teamsStoryPin > .container:first-of-type,
  .post-sales-root #teamsStoryPin > .container:nth-of-type(2) {
    flex: none !important;
    display: block !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .post-sales-root #teamsStoryPin .teams-main {
    flex: none !important;
    overflow: visible !important;
    padding-bottom: 0 !important;
  }
  .post-sales-root .teams-panel.active .team-visual {
    justify-self: center !important;
  }
}
.post-sales-root .teams-layout {
  min-width: 0;
}
.post-sales-root .form-input,
.post-sales-root select.form-input,
.post-sales-root textarea.form-input {
  background-color: var(--bg-alt) !important;
  color: var(--text) !important;
}
.post-sales-root .form-input:focus {
  background-color: var(--bg-card) !important;
}
.post-sales-root .btn-primary {
  color: var(--on-primary) !important;
}
.post-sales-root .pain-card,
.post-sales-root .testi-card,
.post-sales-root .usp-visual,
.post-sales-root .wt-screen,
.post-sales-root .tf-row,
.post-sales-root .uc-card,
.post-sales-root .contact-form-card,
.post-sales-root .trust-row {
  background-color: var(--bg-card) !important;
}
/* Team mock: same as vendor-management .wt-ui-card / .wt-ui-header / .wt-ui-body */
.post-sales-root .team-visual {
  background-color: var(--bg-card, #F0EAE1) !important;
  border: 1px solid #c4b89d !important;
  box-shadow: 0 16px 48px rgba(44, 44, 44, 0.1) !important;
}
.post-sales-root .team-visual-header {
  background-color: var(--bg, #F6F4EE) !important;
  border-bottom: 1px solid #c4bcad !important;
}
.post-sales-root .team-visual-body {
  background-color: var(--bg, #F6F4EE) !important;
}
.post-sales-root .teams-section .team-info {
  max-height: none !important;
  overflow: visible !important;
}
.post-sales-root #walkthrough .wt-info {
  max-height: min(72vh, calc(100vh - 200px));
  overflow-y: auto;
  overscroll-behavior: contain;
}
`

export default function PostSalesLandingPage() {
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
        const res = await fetch(`/post-sales.html?ts=${Date.now()}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load /post-sales.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/post-sales.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${POST_SALES_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Post Sales content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !bodyHtml) return

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Counter animation (matches original script)
    const metricNums = Array.from(root.querySelectorAll<HTMLElement>('.metric-num[data-target]'))
    const counterTimers: number[] = []
    const animateCounter = (el: HTMLElement) => {
      const target = parseInt(el.getAttribute('data-target') ?? '0', 10)
      const suffix = el.getAttribute('data-suffix') ?? ''
      let current = 0
      const step = Math.max(1, Math.floor(target / 60))
      const timer = window.setInterval(() => {
        current = Math.min(current + step, target)
        el.textContent = `${current}${suffix}`
        if (current >= target) window.clearInterval(timer)
      }, 20)
      counterTimers.push(timer)
    }

    // Intersection observer for fade-in (matches original script)
    const fadeEls = Array.from(root.querySelectorAll<HTMLElement>('.fade-in'))
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('visible')
          if ((e.target as HTMLElement).closest('#hero')) {
            metricNums.forEach((el) => window.setTimeout(() => animateCounter(el), 400))
          }
        })
      },
      { threshold: 0.1 },
    )
    fadeEls.forEach((el) => fadeObserver.observe(el))
    const onLoadStartCounters = window.setTimeout(() => {
      metricNums.forEach((el) => animateCounter(el))
    }, 800)

    // USP accordion + dots (openUsp)
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspVisuals = Array.from(root.querySelectorAll<HTMLElement>('[id^="usp-vis-"]'))
    const uspDots = Array.from(root.querySelectorAll<HTMLElement>('#uspDots .testi-dot'))
    const openUsp = (idx: number) => {
      uspItems.forEach((it, i) => it.classList.toggle('active', i === idx))
      uspVisuals.forEach((vis, i) => vis.classList.toggle('visible', i === idx))
      uspDots.forEach((d, i) => d.classList.toggle('active', i === idx))
    }
    ;(window as any).openUsp = openUsp
    openUsp(0)

    // Hero subtext carousel
    const heroSlides = Array.from(root.querySelectorAll<HTMLElement>('.hero-sub-slide'))
    let heroSlideIdx = 0
    const heroSlideTimer =
      heroSlides.length > 1
        ? window.setInterval(() => {
            heroSlides[heroSlideIdx]?.classList.remove('active')
            heroSlideIdx = (heroSlideIdx + 1) % heroSlides.length
            heroSlides[heroSlideIdx]?.classList.add('active')
          }, 3000)
        : null

    // Walkthrough tabs (selectWtTab)
    const wtTabs = Array.from(root.querySelectorAll<HTMLButtonElement>('#wtTabs .wt-tab'))
    const featPanels = Array.from(root.querySelectorAll<HTMLElement>('.feat-panel'))
    const wtScreenTitle = root.querySelector<HTMLElement>('#wtScreenTitle')
    const wtInfoLabel = root.querySelector<HTMLElement>('#wtInfoLabel')
    const wtInfoTitle = root.querySelector<HTMLElement>('#wtInfoTitle')
    const wtInfoDesc = root.querySelector<HTMLElement>('#wtInfoDesc')
    const wtFeatList = root.querySelector<HTMLElement>('#wtFeatList')
    const wtData = [
      {
        label: 'postsales.app · Home',
        featureNum: 'Feature 1 of 7',
        title: 'Everything a buyer needs. Right on the home screen.',
        desc: "The Home screen gives buyers instant access to their unit, account, documents, support, loan assistance, and loyalty program — all from a single personalised dashboard with their property project front and centre.",
        feats: [
          'Personalised welcome with unit and project details',
          'Quick-access tiles: My Account, My Unit, Support, Loan Assistance, Documents, Loyalty',
          'Payment Milestone summary with View All shortcut',
          'Property carousel with new launch highlights',
        ],
      },
      {
        label: 'postsales.app · My Journey',
        featureNum: 'Feature 2 of 7',
        title: 'Every buyer. Every milestone. No missed steps.',
        desc: 'The Customer Journey Dashboard guides buyers from booking to possession with live milestones, pending action alerts, and next-step prompts. Buyers who see their journey trust you more and refer you more.',
        feats: [
          'Live milestone tracking from Booking to Possession',
          'Pending action alerts with one-tap resolution',
          'Multi-project view for multiple unit holders',
          'Referral prompts triggered at every completed milestone',
        ],
      },
      {
        label: 'postsales.app · Support',
        featureNum: 'Feature 3 of 7',
        title: 'Every query tracked. Every issue resolved.',
        desc: "Buyers raise support tickets directly from the app. Each ticket is categorised, assigned, and tracked to closure. No more missed WhatsApp messages or lost email chains — every issue has a status, an owner, and a resolution timeline.",
        feats: [
          'In-app ticket raising with category selection',
          'Real-time ticket status updates for the buyer',
          'RM-assigned tickets with escalation workflows',
          'CSAT rating collected automatically on closure',
        ],
      },
      {
        label: 'postsales.app · Referral Hub',
        featureNum: 'Feature 4 of 7',
        title: 'Turn every happy buyer into a brand advocate.',
        desc: 'Gamified referral hub with tier-based rewards, shareable referral cards for WhatsApp and Instagram, real-time reward tracking, and leaderboard. Referral bookings replace broker-sourced leads at 95% lower cost.',
        feats: [
          'Gamified referral hub with tier rewards',
          'Shareable referral cards for WhatsApp and Instagram',
          'Real-time reward tracking and leaderboard',
          'AI propensity engine identifies high-intent referrers',
        ],
      },
      {
        label: 'postsales.app · Payments',
        featureNum: 'Feature 5 of 7',
        title: 'Zero payment confusion. Zero collection friction.',
        desc: 'Full payment schedule, demand letters, account statement, and online payments in one screen. Buyers see exactly what they owe and when. Payment defaults drop by 35% when buyers have this visibility.',
        feats: [
          'Milestone-based payment schedule with due dates',
          'In-app payment gateway with no external redirection',
          'Real-time account statement and receipt download',
          'EMI calculator and TDS knowledge support',
        ],
      },
      {
        label: 'postsales.app · Construction',
        featureNum: 'Feature 6 of 7',
        title: "Show them. Don't tell them. Trust follows.",
        desc: 'Real-time construction updates with verified images, videos, and milestone reports. Buyer anxiety drops 60% when they can see verified progress. High-trust buyers refer at 4x the rate of disengaged ones.',
        feats: [
          'Verified photo and video updates per milestone',
          'Floor-wise and tower-wise progress tracking',
          'Possession timeline with schedule updates',
          'Snag list management pre-handover',
        ],
      },
      {
        label: 'postsales.app · My Account',
        featureNum: 'Feature 7 of 7',
        title: 'Complete financial and booking overview. One screen.',
        desc: 'Centralized account view with total demanded, received, outstanding amounts, booking overview, NCF status, stamp duty, registration tracking, and customer profile details.',
        feats: [
          'Financial summary with total demanded and outstanding',
          'Booking overview with status tracking',
          'NCF, Stamp Duty, and Registration milestones',
          'Customer profile and unit details at a glance',
        ],
      },
    ] as const

    // Walkthrough images in the HTML are local file paths (e.g. /Users/...),
    // so in a web app they won't load. Replace them with crisp placeholders
    // unless real assets are provided in `public/`.
    type PhoneMockConfig = {
      label: string
      guidelineTitle: string
      guidelineText: string
      accentFrom: string
      accentTo: string
      chips: string[]
    }

    const escapeXml = (s: string) =>
      s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')

    const makePhonePlaceholderDataUri = (cfg: PhoneMockConfig) => {
      const chipSvgs = cfg.chips
        .slice(0, 3)
        .map((c, i) => {
          const x = 180 + i * 178
          return `
  <rect x="${x}" y="380" width="160" height="44" rx="22" fill="#F0EAE1" stroke="#C4B89D" stroke-width="2"/>
  <text x="${x + 80}" y="409" text-anchor="middle" font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial" font-size="18" font-weight="700" fill="#2C2C2C">${escapeXml(c)}</text>`
        })
        .join('\n')

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1800" viewBox="0 0 900 1800">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${cfg.accentFrom}"/>
      <stop offset="1" stop-color="${cfg.accentTo}"/>
    </linearGradient>
    <linearGradient id="shell" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#151923"/>
      <stop offset="1" stop-color="#0f121a"/>
    </linearGradient>
  </defs>
  <!-- Transparent canvas so no white edges -->
  <rect x="0" y="0" width="900" height="1800" fill="transparent"/>
  <rect x="90" y="120" width="720" height="1560" rx="90" fill="url(#shell)" stroke="#0b0d13" stroke-width="10"/>
  <rect x="130" y="200" width="640" height="1400" rx="58" fill="#F6F4EE" stroke="#C4B89D" stroke-width="4"/>
  <rect x="320" y="150" width="260" height="34" rx="17" fill="#0b0d13" opacity="0.9"/>
  <circle cx="450" cy="168" r="10" fill="#2b2f3a"/>

  <!-- header -->
  <text x="180" y="280" text-anchor="start" font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial" font-size="34" font-weight="800" fill="#111827">Post Sales</text>
  <text x="180" y="330" text-anchor="start" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="20" letter-spacing="1.2" fill="#6b7280">${escapeXml(cfg.label)}</text>

  <!-- chips -->
${chipSvgs}

  <!-- subtle UI guideline card -->
  <rect x="180" y="450" width="540" height="140" rx="18" fill="#fff7f4" stroke="#f1c7ba" stroke-width="3"/>
  <text x="210" y="505" font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial" font-size="22" font-weight="800" fill="#7c2d12">${escapeXml(cfg.guidelineTitle)}</text>
  <text x="210" y="540" font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial" font-size="18" fill="#6b7280">${escapeXml(cfg.guidelineText)}</text>

  <!-- list skeleton -->
  <rect x="180" y="630" width="540" height="88" rx="18" fill="#F0EAE1" stroke="#C4B89D" stroke-width="3"/>
  <rect x="180" y="740" width="540" height="88" rx="18" fill="#F0EAE1" stroke="#C4B89D" stroke-width="3"/>
  <rect x="180" y="850" width="540" height="88" rx="18" fill="#F0EAE1" stroke="#C4B89D" stroke-width="3"/>
  <rect x="180" y="960" width="360" height="88" rx="18" fill="#F0EAE1" stroke="#C4B89D" stroke-width="3"/>
  <rect x="560" y="960" width="160" height="88" rx="18" fill="#F0EAE1" stroke="#C4B89D" stroke-width="3"/>

  <!-- CTA -->
  <rect x="240" y="1105" width="420" height="96" rx="28" fill="url(#brand)"/>
  <text x="450" y="1168" text-anchor="middle" font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial" font-size="28" font-weight="800" fill="#F6F4EE">View screen</text>
</svg>`
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
    }

    const wtMocks: PhoneMockConfig[] = [
      {
        label: 'Home',
        guidelineTitle: 'Quick access',
        guidelineText: 'Your unit, documents, support, and loyalty—one dashboard.',
        accentFrom: '#da7756',
        accentTo: '#ffb08b',
        chips: ['My Unit', 'Documents', 'Loyalty'],
      },
      {
        label: 'Journey',
        guidelineTitle: 'Milestone tracking',
        guidelineText: 'See the next step and complete actions without calls.',
        accentFrom: '#6d28d9',
        accentTo: '#a78bfa',
        chips: ['Booking', 'Registration', 'Possession'],
      },
      {
        label: 'Support',
        guidelineTitle: 'Ticket updates',
        guidelineText: 'Raise a query and track status to closure in-app.',
        accentFrom: '#2563eb',
        accentTo: '#93c5fd',
        chips: ['New ticket', 'In progress', 'Resolved'],
      },
      {
        label: 'Referral',
        guidelineTitle: 'Share & earn',
        guidelineText: 'Send referral cards and track rewards in real time.',
        accentFrom: '#059669',
        accentTo: '#6ee7b7',
        chips: ['Invite', 'Leaderboard', 'Rewards'],
      },
      {
        label: 'Payments',
        guidelineTitle: 'Due clarity',
        guidelineText: 'View schedule, pay online, and download receipts.',
        accentFrom: '#b45309',
        accentTo: '#fdba74',
        chips: ['Schedule', 'Pay now', 'Receipts'],
      },
      {
        label: 'Construction',
        guidelineTitle: 'Verified updates',
        guidelineText: 'Photos, videos, and progress—published by the team.',
        accentFrom: '#0f766e',
        accentTo: '#5eead4',
        chips: ['Photos', 'Videos', 'Progress'],
      },
      {
        label: 'My Account',
        guidelineTitle: 'One overview',
        guidelineText: 'Demanded, received, outstanding—always up to date.',
        accentFrom: '#7c3aed',
        accentTo: '#f0abfc',
        chips: ['Summary', 'Profile', 'Statements'],
      },
    ]

    featPanels.forEach((panel, idx) => {
      const img = panel.querySelector<HTMLImageElement>('img.wt-app-img')
      if (!img) return
      const src = img.getAttribute('src') ?? ''
      const looksLikeLocalAbsolutePath = src.includes('/Users/') || src.startsWith('file:')
      if (looksLikeLocalAbsolutePath || !src.trim()) {
        const cfg = wtMocks[idx] ?? wtMocks[0]
        img.setAttribute('src', makePhonePlaceholderDataUri(cfg))
      }
    })

    const selectWtTab = (idx: number) => {
      if (!wtData.length) return
      const i = Math.max(0, Math.min(wtData.length - 1, Math.floor(Number(idx) || 0)))
      wtTabs.forEach((t, j) => t.classList.toggle('active', j === i))
      featPanels.forEach((p, j) => p.classList.toggle('visible', j === i))
      const d = wtData[i]
      if (wtScreenTitle) wtScreenTitle.textContent = d.label
      if (wtInfoLabel) wtInfoLabel.textContent = d.featureNum
      if (wtInfoTitle) wtInfoTitle.textContent = d.title
      if (wtInfoDesc) wtInfoDesc.textContent = d.desc
      if (wtFeatList) {
        wtFeatList.innerHTML = d.feats
          .map((f) => {
            const safe = f.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            return `<div class="wt-feat-row"><i class="fa-solid fa-check"></i><span>${safe}</span></div>`
          })
          .join('')
      }
    }
    ;(window as any).selectWtTab = selectWtTab
    if (wtTabs.length) {
      const initial = wtTabs.findIndex((t) => t.classList.contains('active'))
      selectWtTab(initial >= 0 ? initial : 0)
    }

    // “Built for Every Team” — same tab / scroll / progress behavior as vendor-management
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
    const lenisScroll = createLenisScrollSync()
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)
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
      const onClickAttr = tab.getAttribute('onclick') ?? ''
      const match = onClickAttr.match(/switchTeam\(this,\s*'([^']+)'\s*\)/)
      const teamId = match?.[1]
      if (!teamId) return
      const fn = (e: Event) => {
        e.preventDefault()
        const idx = teamIds.indexOf(teamId)
        if (idx >= 0) scrollToTeamIndex(idx)
        else switchTeam(teamId, tab)
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })
    const initialTeamTab = teamTabs.find((t) => t.classList.contains('active'))
    if (initialTeamTab) {
      const match = (initialTeamTab.getAttribute('onclick') ?? '').match(
        /switchTeam\(this,\s*'([^']+)'\s*\)/,
      )
      if (match?.[1]) switchTeam(match[1], initialTeamTab)
    }

    const refreshTeamScroll = () => {
      requestAnimationFrame(() => {
        lenisScroll.resize()
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

    return () => {
      innerScrollCleanup()
      gsapCtx.revert()
      lenisScroll.destroy()
      clearTimeout(lateLayout)
      window.removeEventListener('load', onLayoutRefresh)
      window.removeEventListener('resize', onResize)
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)
      window.removeEventListener('scroll', onScroll)
      fadeObserver.disconnect()
      window.clearTimeout(onLoadStartCounters)
      counterTimers.forEach((t) => window.clearInterval(t))
      if (heroSlideTimer) window.clearInterval(heroSlideTimer)
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      delete (window as any).openUsp
      delete (window as any).selectWtTab
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="post-sales-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Post Sales error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}

