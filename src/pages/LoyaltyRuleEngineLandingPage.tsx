import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void gsap.registerPlugin(ScrollTrigger)

const LOYALTY_NAV_OFFSET_PX = 68
const LOYALTY_TEAM_STORY_SCROLL_PER_TAB_VH = 0.7

function initLoyaltyTeamsGsap(
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
    id: 'loyalty-teams-use-cases',
    trigger: pin,
    start: `top ${LOYALTY_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * LOYALTY_TEAM_STORY_SCROLL_PER_TAB_VH}`,
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

type IndustryDatum = {
  eyebrow: string
  title: string
  company: string
  body: string
  features: string[]
  metrics: { val: string; label: string }[]
}

type LoyaltyRuleWindow = Window & typeof globalThis & {
  openIndustry?: (id: string) => void
  closeIndustry?: (_e: unknown, force?: boolean) => void
  submitForm?: () => void
}

const LOYALTY_RULE_ISOLATION_CSS = `
.loyalty-rule-root {
  position: relative;
  isolation: isolate;
}
html:has(.loyalty-rule-root) {
  scroll-padding-top: ${LOYALTY_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.loyalty-rule-root section[id],
.loyalty-rule-root .teams-section#teams {
  scroll-margin-top: ${LOYALTY_NAV_OFFSET_PX + 4}px;
}
.loyalty-rule-root #navbar {
  z-index: 10050;
}
.loyalty-rule-root #teamsStoryPin {
  z-index: 1 !important;
}
.loyalty-rule-root .pin-spacer {
  background: var(--band, #E8E2D6) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.loyalty-rule-root #teamsStoryPin {
  background: var(--band, #E8E2D6) !important;
  min-height: calc(100vh - ${LOYALTY_NAV_OFFSET_PX}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.loyalty-rule-root .team-content-grid {
  align-items: stretch !important;
}
.loyalty-rule-root .team-panel.active {
  align-items: stretch !important;
}
.loyalty-rule-root .team-panel.active > div {
  height: 100%;
}
.loyalty-rule-root,
.loyalty-rule-root * {
  color-scheme: only light !important;
}
.loyalty-rule-root {
  color: #000 !important;
}
.loyalty-rule-root .reveal {
  opacity: 0 !important;
  transform: translateY(24px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.6s ease, transform 0.6s ease !important;
}
.loyalty-rule-root .reveal.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
.loyalty-rule-root h1,
.loyalty-rule-root h2,
.loyalty-rule-root h3,
.loyalty-rule-root h4,
.loyalty-rule-root h5,
.loyalty-rule-root h6 {
  font-family: var(--font, 'Poppins'), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.loyalty-rule-root .walkthrough-section,
.loyalty-rule-root .contact-section,
.loyalty-rule-root footer {
  background: var(--cream, #F6F4EE) !important;
}
.loyalty-rule-root .walkthrough-title,
.loyalty-rule-root .feature-name,
.loyalty-rule-root .feature-screen-title,
.loyalty-rule-root .cta-headline,
.loyalty-rule-root .footer-logo-text,
.loyalty-rule-root .footer-col-title,
.loyalty-rule-root .footer-copy,
.loyalty-rule-root .contact-info-headline,
.loyalty-rule-root .form-title,
.loyalty-rule-root .office-city {
  color: var(--dark, #2C2C2C) !important;
}
.loyalty-rule-root .walkthrough-sub,
.loyalty-rule-root .feature-desc,
.loyalty-rule-root .feature-bullet span,
.loyalty-rule-root .section-sub,
.loyalty-rule-root .cta-sub,
.loyalty-rule-root .hero-sub,
.loyalty-rule-root .cta-subtext,
.loyalty-rule-root .footer-brand-desc,
.loyalty-rule-root .footer-link,
.loyalty-rule-root .footer-legal a,
.loyalty-rule-root .contact-info-sub,
.loyalty-rule-root .office-address,
.loyalty-rule-root .form-sub,
.loyalty-rule-root .form-label {
  color: #000 !important;
}
.loyalty-rule-root .cta-subtext {
  opacity: 1 !important;
}
.loyalty-rule-root .hero-bento-card {
  opacity: 1 !important;
  background: var(--surface, #F0EAE1) !important;
  border-color: rgba(196, 184, 157, 0.55) !important;
  box-shadow: 0 14px 34px rgba(44, 44, 44, 0.08) !important;
}
.loyalty-rule-root .bento-mini-label,
.loyalty-rule-root .bento-mini-sub,
.loyalty-rule-root .client-name,
.loyalty-rule-root .countdown-label {
  color: #000 !important;
  opacity: 1 !important;
}
.loyalty-rule-root .bento-mini-label,
.loyalty-rule-root .countdown-label {
  color: rgba(0, 0, 0, 0.78) !important;
}
.loyalty-rule-root .client-name {
  color: rgba(0, 0, 0, 0.78) !important;
}
.loyalty-rule-root .hero-eyebrow,
.loyalty-rule-root .hero-headline,
.loyalty-rule-root .hero-sub,
.loyalty-rule-root .hero-ctas,
.loyalty-rule-root .hero-countdown {
  opacity: 1 !important;
  transform: none !important;
}
.loyalty-rule-root .feature-tabs {
  border-bottom-color: rgba(44, 44, 44, 0.1) !important;
}
.loyalty-rule-root .feature-tab {
  color: rgba(0, 0, 0, 0.7) !important;
}
.loyalty-rule-root .feature-tab.active {
  color: var(--dark, #2C2C2C) !important;
}
.loyalty-rule-root .feature-screen,
.loyalty-rule-root .feature-screen-body,
.loyalty-rule-root .wallet-screen-card,
.loyalty-rule-root .int-flow-card,
.loyalty-rule-root .team-visual,
.loyalty-rule-root .team-visual-body {
  background: var(--surface, #F0EAE1) !important;
  color: var(--dark, #2C2C2C) !important;
}
.loyalty-rule-root .feature-screen {
  border: 1px solid rgba(196, 184, 157, 0.45) !important;
  box-shadow: 0 20px 48px rgba(44, 44, 44, 0.09) !important;
}
.loyalty-rule-root .feature-screen-header,
.loyalty-rule-root .team-visual-header {
  background: rgba(255, 255, 255, 0.72) !important;
  border-bottom: 1px solid rgba(196, 184, 157, 0.28) !important;
}
.loyalty-rule-root .feature-screen-body *,
.loyalty-rule-root .team-visual-body * {
  color: inherit;
}
.loyalty-rule-root .feature-screen-body svg [stroke='white'],
.loyalty-rule-root .team-visual-body svg [stroke='white'] {
  stroke: var(--dark, #2C2C2C) !important;
}
.loyalty-rule-root .feature-screen-body svg [fill='white'],
.loyalty-rule-root .team-visual-body svg [fill='white'] {
  fill: var(--dark, #2C2C2C) !important;
}
.loyalty-rule-root .cta-banner {
  background: var(--band, #E8E2D6) !important;
}
.loyalty-rule-root .cta-eyebrow,
.loyalty-rule-root .accent {
  color: var(--primary, #DA7756) !important;
}
.loyalty-rule-root .btn-primary,
.loyalty-rule-root .btn-hero-primary,
.loyalty-rule-root .btn-cta-primary,
.loyalty-rule-root .btn-form-submit {
  background: var(--primary, #DA7756) !important;
  border-color: var(--primary, #DA7756) !important;
  color: #fff !important;
}
.loyalty-rule-root .btn-primary:hover,
.loyalty-rule-root .btn-hero-primary:hover,
.loyalty-rule-root .btn-cta-primary:hover,
.loyalty-rule-root .btn-form-submit:hover {
  filter: brightness(0.95) !important;
}
.loyalty-rule-root .btn-ghost,
.loyalty-rule-root .btn-hero-outline,
.loyalty-rule-root .btn-cta-outline {
  background: transparent !important;
}
.loyalty-rule-root .btn-cta-outline {
  background: var(--surface, #F0EAE1) !important;
  border-color: rgba(196, 184, 157, 0.75) !important;
  color: var(--dark, #2C2C2C) !important;
  opacity: 1 !important;
}
.loyalty-rule-root .btn-cta-outline:hover {
  background: var(--surface, #F0EAE1) !important;
  filter: brightness(0.96) !important;
}
.loyalty-rule-root .cta-feature-item {
  background: var(--surface, #F0EAE1) !important;
  border-color: rgba(196, 184, 157, 0.55) !important;
}
.loyalty-rule-root .cta-feature-text {
  color: rgba(0, 0, 0, 0.86) !important;
  opacity: 1 !important;
}
.loyalty-rule-root .cta-feature-check {
  background: rgba(218, 119, 86, 0.14) !important;
  border: 1px solid rgba(218, 119, 86, 0.28) !important;
}
.loyalty-rule-root .cta-feature-check svg,
.loyalty-rule-root .cta-feature-check svg * {
  stroke: var(--primary, #DA7756) !important;
}
.loyalty-rule-root .contact-form-area,
.loyalty-rule-root .form-input,
.loyalty-rule-root .form-select,
.loyalty-rule-root .form-textarea {
  background: var(--surface, #F0EAE1) !important;
  color: var(--dark, #2C2C2C) !important;
}
@media (prefers-reduced-motion: reduce) {
  .loyalty-rule-root .reveal,
  .loyalty-rule-root .reveal.visible {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

export default function LoyaltyRuleEngineLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/loyalty-rule-engine.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /loyalty-rule-engine.html (${res.status})`)
        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        doc.querySelector('.clients-section')?.remove()
        doc.querySelector('.testimonials-section')?.remove()
        doc.querySelector('a[href="#testimonials"]')?.closest('li')?.remove()

        const nav = doc.querySelector('#navbar')
        const navLinks = nav?.querySelector('.nav-links')
        if (navLinks) {
          const painLink = doc.createElement('li')
          painLink.innerHTML = '<a href="#pain-section">Pain Points</a>'
          const walkLink = navLinks.querySelector('a[href="#walkthrough"]')?.closest('li')
          const featuresLink = navLinks.querySelector('a[href="#features"]')?.closest('li')
          const teamsLink = doc.createElement('li')
          teamsLink.innerHTML = '<a href="#teams">Teams</a>'
          const useCasesLink = navLinks.querySelector('a[href="#use-cases"]')?.closest('li')
          const contactLink = navLinks.querySelector('a[href="#contact"]')?.closest('li')

          navLinks.innerHTML = ''
          ;[painLink, walkLink, featuresLink, teamsLink, useCasesLink, contactLink].forEach((item) => {
            if (item) navLinks.appendChild(item)
          })
        }

        const hero = doc.querySelector('.hero')
        const pain = doc.querySelector('#pain-section')
        const walkthrough = doc.querySelector('#walkthrough')
        const features = doc.querySelector('#features')
        const teams = doc.querySelector('#teams')
        const useCases = doc.querySelector('#use-cases')
        const popup = doc.querySelector('#industryPopup')
        const endingBanner = doc.querySelector('.cta-banner')
        const contact = doc.querySelector('#contact')
        const footer = doc.querySelector('footer')

        doc.body.innerHTML = ''
        ;[
          nav,
          hero,
          pain,
          walkthrough,
          features,
          teams,
          useCases,
          popup,
          endingBanner,
          contact,
          footer,
        ].forEach((node) => {
          if (node) doc.body.appendChild(node)
        })

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/loyalty-rule-engine.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
  setCssText(`${styles}\n${LOYALTY_RULE_ISOLATION_CSS}`)
        setBodyHtml(body)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Loyalty Rule Engine content')
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
    const loyaltyWindow: LoyaltyRuleWindow = window

    // NAV SCROLL
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // HERO ANIMATIONS
    const t1 = window.setTimeout(() => {
      const eyebrow = root.querySelector<HTMLElement>('#hero-eyebrow')
      if (!eyebrow) return
      eyebrow.style.transition = 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
      eyebrow.style.opacity = '1'
      eyebrow.style.transform = 'translateY(0)'
    }, 200)
    const t2 = window.setTimeout(() => {
      const h1 = root.querySelector<HTMLElement>('#hero-headline')
      if (!h1) return
      h1.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      h1.style.opacity = '1'
      h1.style.transform = 'translateY(0)'
    }, 400)
    const t3 = window.setTimeout(() => {
      const sub = root.querySelector<HTMLElement>('#hero-sub')
      if (!sub) return
      sub.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      sub.style.opacity = '1'
      sub.style.transform = 'translateY(0)'
    }, 600)
    const t4 = window.setTimeout(() => {
      const ctas = root.querySelector<HTMLElement>('#hero-ctas')
      if (!ctas) return
      ctas.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      ctas.style.opacity = '1'
      ctas.style.transform = 'translateY(0)'
    }, 750)
    const t5 = window.setTimeout(() => {
      const sub2 = root.querySelector<HTMLElement>('#hero-sub2')
      if (!sub2) return
      sub2.style.transition = 'all 0.8s ease'
      sub2.style.opacity = '1'
    }, 900)

    function animateCounters() {
      const counters = [
        { selector: '#cnt1', target: 30, duration: 1500, decimals: 0 },
        { selector: '#cnt2', target: 43, duration: 1800, decimals: 0 },
        { selector: '#cnt3', target: 3.2, duration: 1200, decimals: 1 },
        { selector: '#cnt4', target: 1, duration: 800, decimals: 0 },
      ] as const

      counters.forEach((c) => {
        const el = root.querySelector<HTMLElement>(c.selector)
        if (!el) return
        const start = Date.now()
        const timer = window.setInterval(() => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / c.duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const val = eased * c.target
          el.textContent = c.decimals ? val.toFixed(c.decimals) : String(Math.round(val))
          if (progress >= 1) window.clearInterval(timer)
        }, 16)
      })
    }

    const t6 = window.setTimeout(() => {
      const metrics = root.querySelector<HTMLElement>('#hero-metrics')
      if (!metrics) return
      metrics.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      metrics.style.opacity = '1'
      metrics.style.transform = 'translateY(0)'
      animateCounters()
    }, 1000)

    // USP ACCORDION + VISUAL
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    uspItems.forEach((item) => {
      item.addEventListener('click', () => {
        const screenId = item.getAttribute('data-screen')
        uspItems.forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
        uspScreens.forEach((s) => s.classList.remove('visible'))
        if (screenId) root.querySelector<HTMLElement>('#' + screenId)?.classList.add('visible')
      })
    })

    // WALKTHROUGH TABS
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    featureTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const feat = tab.getAttribute('data-feature')
        featureTabs.forEach((t) => t.classList.remove('active'))
        tab.classList.add('active')
        featurePanels.forEach((p) => p.classList.remove('active'))
        if (feat) root.querySelector<HTMLElement>('#fp-' + feat)?.classList.add('active')
      })
    })

    // TEAMS TABS (click + vendor-style pinned story on scroll)
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.team-panel'))
    const switchTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((x) => x.classList.remove('active'))
      teamPanels.forEach((p) => p.classList.remove('active'))
      tabEl?.classList.add('active')
      root.querySelector<HTMLElement>('#tp-' + teamId)?.classList.add('active')
    }
    const teamAbort = new AbortController()
    const { signal: teamSignal } = teamAbort
    teamTabs.forEach((tab) => {
      const teamId = tab.getAttribute('data-team') || ''
      if (!teamId) return
      const activate = (e: Event) => {
        e.preventDefault()
        switchTeam(teamId, tab)
      }
      tab.addEventListener('click', activate, { signal: teamSignal })
      tab.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'Enter' || e.key === ' ') activate(e)
        },
        { signal: teamSignal },
      )
    })
    const initialTeam = teamTabs.find((t) => t.classList.contains('active'))
    const initialId = initialTeam?.getAttribute('data-team') || ''
    if (initialId) switchTeam(initialId, initialTeam)
    const teamIds = teamTabs.map((t) => t.getAttribute('data-team') || '').filter(Boolean)
    const teamsStoryTrigger = initLoyaltyTeamsGsap(root, { teamTabs, teamIds, switchTeam })

    // INDUSTRY POPUP DATA + handlers (for inline onclick)
    const industryData: Record<string, IndustryDatum> = {
      realestate: {
        eyebrow: 'Real Estate & Property Development',
        title: 'Incentivise early payment. Automate your referral programme. Capture repeat buyer value.',
        company: 'Rank 1 — Highest relevance. Live in production with a major Indian developer.',
        body: "Real estate is where the platform was born. Demand note payment rules fire the moment a customer pays — no manual tracking, no delayed bonuses. Gold tier members who pay within 5 days of a demand note earn 6,000 points automatically. Your referral programme tracks three stages: referral logged, site visit, booking confirmed. Points credit on booking — not weeks later. Encashment lets customers offset points against outstanding instalments, which directly improves collections TAT.",
        features: ['Transaction Events', 'Referral Rules', 'Escrow Wallet', 'Encashment', 'CRM Integration'],
        metrics: [
          { val: '38→22', label: 'Days to collect (TAT)' },
          { val: '3.2x', label: 'Referral leads growth' },
          { val: '44%', label: 'Redemption rate' },
        ],
      },
      bfsi: {
        eyebrow: 'Banking, Financial Services & Insurance',
        title: 'Reduce delinquency. Drive cross-sell. Give your CFO escrow-grade controls.',
        company: 'Rank 2 — High urgency. RBI compliance angle opens enterprise doors.',
        body: 'BFSI is the second priority vertical. EMI on-time payment rules create a measurable delinquency reduction — 1% improvement on a ₹5,000Cr loan book reduces NPA provisioning by ₹50Cr. Cross-sell rules reward customers for taking a second product within 90 days. The escrow wallet aligns directly with RBI expectations for loyalty liability management, removing the compliance objection that kills most loyalty programme proposals in finance-regulated industries.',
        features: ['EMI Payment Rules', 'Cross-Sell Triggers', 'Escrow Wallet', 'Segments Engine', 'Compliance Reports'],
        metrics: [
          { val: '+84%', label: 'Cross-sell rate improvement' },
          { val: '₹50Cr', label: 'NPA reduction at 1% improvement' },
          { val: '25%', label: 'Mandatory escrow float' },
        ],
      },
      auto: {
        eyebrow: 'Automotive — OEMs & Dealer Groups',
        title: 'Bring customers back for service. Every service visit is revenue you own.',
        company: 'Rank 3 — High urgency. Aftersales loyalty is completely unaddressed.',
        body: 'Automotive aftersales revenue has 30–40% gross margin vs 3–5% on vehicle sales. A dealer losing service customers to multi-brand workshops is leaving its most profitable revenue on the table. First-service capture rules fire when a customer attends their first scheduled service — 2,000 points, plus 500 bonus if booked through the app. Insurance renewal rules trigger 45 days before expiry, creating a loyalty-driven retention moment. Three-year service streak milestones drive long-term aftersales relationships.',
        features: ['Service Visit Rules', 'Insurance Renewal', 'App Booking Rewards', 'Referral Tracking', 'Milestones'],
        metrics: [
          { val: '+55%', label: 'Aftersales revenue per vehicle' },
          { val: '3.5x', label: 'Service booking adoption (app)' },
          { val: '15%', label: 'Referral-sourced new sales' },
        ],
      },
      hospitality: {
        eyebrow: 'Hotels, Resorts & Members Clubs',
        title: 'Direct bookings over OTAs. Guest loyalty that drives RevPAR.',
        company: 'Rank 4 — Medium urgency. Mid-market opportunity outside enterprise chains.',
        body: 'Mid-market hotels lose 15–25% of room revenue to OTA commissions every year. A loyalty programme that rewards direct bookings — and gives guests a personalised mobile redemption experience at check-in — shifts that share back. Time-based rules auto-activate double-points weekends. Milestone rules fire at the 10th stay. Lounge access and experiences are native redemption categories. Marketing cannot change rules in the PMS without vendor support — our no-code interface solves this.',
        features: ['Direct Booking Rules', 'Stay Milestones', 'Time-Based Promos', 'Lounge Access', 'Mobile Redemption'],
        metrics: [
          { val: '22%', label: 'More spend per loyal guest stay' },
          { val: '60%', label: 'Lower acquisition cost vs OTA' },
          { val: '40%', label: 'Direct booking share improvement' },
        ],
      },
      retail: {
        eyebrow: 'Organised Retail & D2C Brands',
        title: 'Frequency rules, win-back triggers, and birthday multipliers that work.',
        company: 'Rank 5 — Medium urgency. Mid-market D2C outgrowing basic loyalty SaaS.',
        body: 'Retail loyalty fails when every customer earns the same rate regardless of spend. Our segment engine creates differentiated multipliers — premium members earn 2x, first-purchase customers get a 7-day window campaign. Win-back rules fire automatically on Day 90 of inactivity with provisional points that expire in 14 days. Birthday month rules deliver 3x points across the entire birth month — not just the birthday. These mechanics are configurable without IT in hours.',
        features: ['Purchase Frequency Rules', 'Win-Back Triggers', 'Birthday Multiplier', 'Segment Rules', 'Festive Windows'],
        metrics: [
          { val: '8x', label: 'CLV for 10+ purchase customers' },
          { val: '25%', label: 'Win-back activation rate' },
          { val: '40%', label: 'Birthday month engagement lift' },
        ],
      },
    }

    loyaltyWindow.openIndustry = (id: string) => {
      const data = industryData[id]
      if (!data) return
      const popupBody = root.querySelector<HTMLElement>('#popupBody')
      const popup = root.querySelector<HTMLElement>('#industryPopup')
      if (!popupBody || !popup) return
      const html = `
        <div class="popup-eyebrow">${data.eyebrow}</div>
        <div class="popup-title">${data.title}</div>
        <div class="popup-company">${data.company}</div>
        <div class="popup-body">${data.body}</div>
        <div class="popup-features">${data.features
          .map(
            (f) =>
              `<div class="popup-feature"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${f}</div>`,
          )
          .join('')}</div>
        <div class="popup-metrics">${data.metrics
          .map((m) => `<div class="popup-metric"><div class="popup-metric-val">${m.val}</div><div class="popup-metric-label">${m.label}</div></div>`)
          .join('')}</div>
      `
      popupBody.innerHTML = html
      popup.classList.add('open')
      document.body.style.overflow = 'hidden'
    }

    loyaltyWindow.closeIndustry = (_e: unknown, force?: boolean) => {
      const popup = root.querySelector<HTMLElement>('#industryPopup')
      if (!popup) return
      if (force) {
        popup.classList.remove('open')
        document.body.style.overflow = ''
      }
    }

    // FORM SUBMIT (inline onclick uses it)
    loyaltyWindow.submitForm = () => {
      const wrap = root.querySelector<HTMLElement>('#contactFormWrap')
      const success = root.querySelector<HTMLElement>('#formSuccess')
      if (wrap) wrap.style.display = 'none'
      success?.classList.add('visible')
    }

    // SCROLL REVEAL
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in') // avoid global blur reveal
          revealObserver.unobserve(el)
        })
      },
      { threshold: 0.12 },
    )
    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => revealObserver.observe(el))

    // WALKTHROUGH VISUAL PARALLAX
    const onScrollParallax = () => {
      root.querySelectorAll<HTMLElement>('.walkthrough-visual').forEach((v) => {
        const offset = window.scrollY * 0.15
        v.style.transform = `translateY(${offset}px)`
      })
    }
    window.addEventListener('scroll', onScrollParallax, { passive: true })

    // USP VISUAL PARALLAX
    const visual = root.querySelector<HTMLElement>('.usp-visual')
    const visualContent = root.querySelector<HTMLElement>('.usp-visual-content')
    let raf: number | null = null
    const updateParallax = () => {
      raf = null
      if (!visual || !visualContent) return
      const rect = visual.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      const offset = (0.5 - progress) * 42
      const innerOffset = (0.5 - progress) * 18
      visual.style.transform = `translate3d(0, ${offset}px, 0)`
      visualContent.style.setProperty('--parallax-y', `${innerOffset}px`)
    }
    const onScrollUsp = () => {
      if (raf !== null) return
      raf = window.requestAnimationFrame(updateParallax)
    }
    window.addEventListener('scroll', onScrollUsp, { passive: true })
    window.addEventListener('resize', onScrollUsp)
    updateParallax()

    // Smooth in-page anchors within this landing page (with fixed-nav offset).
    const smoothScrollTo = (id: string) => {
      const target = root.querySelector<HTMLElement>(id)
      if (!target) return false
      const top = target.getBoundingClientRect().top + window.scrollY - LOYALTY_NAV_OFFSET_PX - 4
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
    if (window.location.hash) {
      window.requestAnimationFrame(() => smoothScrollTo(window.location.hash))
    }
    const onHashChange = () => {
      if (window.location.hash) smoothScrollTo(window.location.hash)
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScrollParallax)
      window.removeEventListener('scroll', onScrollUsp)
      window.removeEventListener('resize', onScrollUsp)
      window.removeEventListener('hashchange', onHashChange)
      anchorHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
      window.clearTimeout(t5)
      window.clearTimeout(t6)
      revealObserver.disconnect()
      teamAbort.abort()
      teamsStoryTrigger?.kill(true)
      if (raf !== null) window.cancelAnimationFrame(raf)
      delete loyaltyWindow.openIndustry
      delete loyaltyWindow.closeIndustry
      delete loyaltyWindow.submitForm
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="loyalty-rule-root min-h-dvh bg-[#F6F4EE]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>Loyalty Rule Engine error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

