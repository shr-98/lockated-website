import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

const SNAG_NAV_OFFSET_PX = 68
const SNAG_TEAM_STORY_SCROLL_PER_TAB_VH = 1.2

function initSnagTeamsGsap(
  root: HTMLElement,
  opts: { teamTabs: HTMLElement[]; switchTeamAt: (idx: number) => void },
): ScrollTrigger | null {
  const pin = root.querySelector<HTMLElement>('#teamsStoryPin')
  if (!pin) return null

  const n = opts.teamTabs.length
  if (n < 1) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (!window.matchMedia('(min-width: 768px)').matches) return null

  const progressFill = root.querySelector<HTMLElement>('#teamsStoryProgress')
  let lastIdx = -1

  return ScrollTrigger.create({
    id: 'snag-teams-use-cases',
    trigger: pin,
    start: `top ${SNAG_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * SNAG_TEAM_STORY_SCROLL_PER_TAB_VH}`,
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
        opts.switchTeamAt(idx)
      }
      if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
    },
  })
}

type Snag360Window = Window & typeof globalThis & {
  toggleUSP?: (item: HTMLElement, idx: number) => void
  switchTab?: (idx: number) => void
  openModal?: (id: string) => void
  closeModal?: (e: MouseEvent, id: string, force?: boolean) => void
  switchTeam?: (idx: number) => void
}

/**
 * `public/snag-360.html` uses standalone reveal rules and section ordering.
 * In-app we align the behavior with the Vendor Management integration pattern,
 * keep the route fully light-mode, and remove sections that should not render.
 */
const SNAG360_ISOLATION_CSS = `
.snag360-root {
  position: relative;
  isolation: isolate;
}
html:has(.snag360-root) {
  scroll-padding-top: ${SNAG_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.snag360-root section[id],
.snag360-root .teams-section#teams {
  scroll-margin-top: ${SNAG_NAV_OFFSET_PX + 4}px;
}
.snag360-root #navbar {
  z-index: 10050;
}
.snag360-root #teamsStoryPin {
  z-index: 1 !important;
  min-height: calc(100vh - ${SNAG_NAV_OFFSET_PX}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}
.snag360-root .teams-story-progress {
  width: 100%;
  flex-shrink: 0;
  align-self: stretch;
  box-sizing: border-box;
}
.snag360-root #teamsStoryProgress {
  box-sizing: border-box;
}
.snag360-root .teams-tabs {
  flex-shrink: 0;
  align-self: stretch;
  background: transparent !important;
}
.snag360-root .teams-layout button.team-tab {
  color: var(--dark, #2c2c2c) !important;
  border: 1.5px solid transparent !important;
  background-image: none !important;
}
.snag360-root .teams-layout button.team-tab:not(.active) {
  background: var(--surface, #f0eae1) !important;
}
.snag360-root .teams-layout button.team-tab.active {
  background: rgba(218, 119, 86, 0.05) !important;
  border-color: var(--primary, #da7756) !important;
}
.snag360-root .teams-layout .team-tab-text {
  color: rgba(44, 44, 44, 0.6) !important;
}
.snag360-root .teams-layout .team-tab.active .team-tab-text {
  color: var(--dark, #2c2c2c) !important;
}
.snag360-root .teams-layout .team-tab-icon {
  background: var(--cream, #f6f4ee) !important;
  border: 1px solid var(--divider, rgba(196, 184, 157, 0.55)) !important;
}
.snag360-root .teams-layout .team-tab.active .team-tab-icon {
  background: var(--primary, #da7756) !important;
  border-color: var(--primary, #da7756) !important;
}
.snag360-root .teams-layout .team-tab.active .team-tab-icon svg {
  color: var(--on-primary, #f6f4ee) !important;
  stroke: currentColor !important;
}
.snag360-root .teams-layout .team-tab-icon svg {
  color: rgba(44, 44, 44, 0.5) !important;
  stroke: currentColor !important;
}
.snag360-root .pin-spacer {
  background: var(--cream, #F6F4EE) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
/* Team mock: compact frame like Vendor / Post Sales / PATM (no vertical stretch) */
.snag360-root .team-content.active {
  align-items: start !important;
}
.snag360-root .team-content.active > .team-info {
  height: auto !important;
  min-width: 0;
}
.snag360-root .team-content.active > .team-visual {
  height: auto !important;
  align-self: start !important;
  justify-self: end !important;
  width: 100% !important;
  max-width: min(100%, var(--team-visual-max-w, 380px)) !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  aspect-ratio: auto !important;
}
.snag360-root .team-content.active .team-visual-body {
  flex: 0 0 auto !important;
}
/* Team mock: vendor-management .wt-ui-card */
.snag360-root .team-visual {
  background: var(--surface, #F0EAE1) !important;
  border: 1px solid #c4b89d !important;
  box-shadow: 0 16px 48px rgba(44, 44, 44, 0.1) !important;
}
.snag360-root .team-visual-header {
  background: var(--cream, #F6F4EE) !important;
  border-bottom: 1px solid #c4bcad !important;
}
.snag360-root .team-visual-body {
  background: var(--cream, #F6F4EE) !important;
}
.snag360-root,
.snag360-root * {
  color-scheme: only light !important;
}
.snag360-root {
  color: #2C2C2C !important;
}
.snag360-root .usecase-card {
  background: var(--cream, #F6F4EE) !important;
}
.snag360-root .usecase-card-body {
  background: transparent !important;
}
.snag360-root .usecase-title,
.snag360-root .modal-title,
.snag360-root .modal-industry {
  color: var(--dark, #2C2C2C) !important;
}
.snag360-root .usecase-impact,
.snag360-root .usecase-industry-tag,
.snag360-root .usecase-link {
  color: var(--primary, #DA7756) !important;
}
.snag360-root .usecase-desc,
.snag360-root .usecase-impact-label,
.snag360-root .modal-body,
.snag360-root .modal-content {
  color: rgba(44, 44, 44, 0.62) !important;
}
.snag360-root .reveal {
  opacity: 0 !important;
  transform: translateY(24px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.6s ease, transform 0.6s ease !important;
}
.snag360-root .reveal.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
.snag360-root h1,
.snag360-root h2,
.snag360-root h3,
.snag360-root h4,
.snag360-root h5,
.snag360-root h6 {
  font-family: var(--font, 'Poppins'), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.snag360-root .walkthrough-section,
.snag360-root footer,
.snag360-root .contact-section {
  background: var(--cream, #F6F4EE) !important;
}
.snag360-root .walkthrough-title,
.snag360-root .feature-name,
.snag360-root .footer-logo-text,
.snag360-root .footer-col-title,
.snag360-root .footer-badge,
.snag360-root .footer-copyright,
.snag360-root .office-name,
.snag360-root .office-label,
.snag360-root .contact-form-wrap h3 {
  color: var(--dark, #2C2C2C) !important;
}
.snag360-root .walkthrough-sub,
.snag360-root .feature-desc,
.snag360-root .feature-bullets li,
.snag360-root .footer-brand-desc,
.snag360-root .footer-col-links a,
.snag360-root .office-address,
.snag360-root .form-group label {
  color: rgba(44, 44, 44, 0.62) !important;
}
.snag360-root .feature-tabs {
  border-bottom-color: rgba(44, 44, 44, 0.1) !important;
}
.snag360-root .feature-tab {
  color: rgba(44, 44, 44, 0.45) !important;
}
.snag360-root .feature-tab:hover {
  color: rgba(44, 44, 44, 0.72) !important;
}
.snag360-root .feature-tab.active {
  color: var(--dark, #2C2C2C) !important;
}
.snag360-root .feature-screen {
  background: var(--surface, #F0EAE1) !important;
  border: 1px solid rgba(196, 184, 157, 0.45) !important;
  box-shadow: 0 20px 48px rgba(44, 44, 44, 0.09) !important;
}
.snag360-root .feature-screen-header {
  background: rgba(240, 234, 225, 0.88) !important;
  border-bottom: 1px solid rgba(196, 184, 157, 0.28) !important;
}
.snag360-root .usp-visual-header {
  background: rgba(240, 234, 225, 0.92) !important;
}
.snag360-root .screen-base {
  background: var(--surface, #f0eae1) !important;
}
.snag360-root .feature-screen-header span,
.snag360-root .feature-screen-body,
.snag360-root .feature-screen-body * {
  color: var(--dark, #2C2C2C) !important;
}
.snag360-root .feature-screen-body {
  background: transparent !important;
}
.snag360-root .feature-screen-body svg [stroke='white'] {
  stroke: var(--dark, #2C2C2C) !important;
}
.snag360-root .feature-screen-body svg [fill='white'] {
  fill: var(--dark, #2C2C2C) !important;
}
.snag360-root .wt-tag.open {
  color: #E7848E !important;
}
.snag360-root .wt-tag.closed {
  color: #798C5E !important;
}
.snag360-root .wt-tag.progress {
  color: #BA7517 !important;
}
.snag360-root .end-banner {
  background: var(--band, #E8E2D6) !important;
}
.snag360-root .hero-eyebrow,
.snag360-root .hero-headline,
.snag360-root .hero-sub,
.snag360-root .hero-ctas,
.snag360-root .hero-metrics,
.snag360-root .banner-title,
.snag360-root .banner-sub {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
}
.snag360-root .banner-title {
  color: var(--dark, #2C2C2C) !important;
}
.snag360-root .banner-sub,
.snag360-root .banner-proof {
  color: rgba(44, 44, 44, 0.82) !important;
  opacity: 1 !important;
}
.snag360-root .end-banner .banner-grid {
  background-image:
    linear-gradient(rgba(44, 44, 44, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(44, 44, 44, 0.04) 1px, transparent 1px) !important;
}
.snag360-root .end-banner .banner-bg::before {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  background: rgba(246, 244, 238, 0.74) !important;
  pointer-events: none !important;
}
.snag360-root .hero-sub,
.snag360-root .cta-subtext,
.snag360-root .metric-label,
.snag360-root .metric-sublabel,
.snag360-root .section-sub {
  color: rgba(44, 44, 44, 0.82) !important;
  opacity: 1 !important;
}
.snag360-root .hero-bento-bg {
  opacity: 0.9 !important;
}
.snag360-root .btn-submit,
.snag360-root .btn-primary-nav,
.snag360-root .btn-hero-primary,
.snag360-root .btn-banner-primary {
  color: #F6F4EE !important;
}
.snag360-root .btn-primary-nav,
.snag360-root .btn-hero-primary,
.snag360-root .btn-banner-primary,
.snag360-root .btn-submit {
  background: var(--primary, #DA7756) !important;
  border-color: var(--primary, #DA7756) !important;
}
.snag360-root .btn-primary-nav::before,
.snag360-root .btn-hero-primary::before,
.snag360-root .btn-submit::before {
  background: rgba(0, 0, 0, 0.12) !important;
}
.snag360-root .btn-ghost-nav,
.snag360-root .btn-hero-outline,
.snag360-root .btn-banner-ghost {
  background: transparent !important;
  border-color: rgba(44, 44, 44, 0.28) !important;
  color: rgba(44, 44, 44, 0.9) !important;
  opacity: 1 !important;
}
.snag360-root .btn-ghost-nav:hover,
.snag360-root .btn-hero-outline:hover,
.snag360-root .btn-banner-ghost:hover {
  background: rgba(218, 119, 86, 0.08) !important;
  border-color: var(--primary, #DA7756) !important;
  color: var(--primary, #DA7756) !important;
}
.snag360-root .form-group input,
.snag360-root .form-group select,
.snag360-root .form-group textarea,
.snag360-root .contact-form-wrap {
  background-color: var(--surface, #F0EAE1) !important;
  color: var(--dark, #2C2C2C) !important;
}
@media (prefers-reduced-motion: reduce) {
  .snag360-root .reveal,
  .snag360-root .reveal.visible {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.snag360-root .teams-section .team-info,
.snag360-root #walkthrough .feature-info {
  max-height: min(72vh, calc(100vh - 200px));
  overflow-y: auto;
  overscroll-behavior: contain;
}
`

export default function Snag360LandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
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
        const res = await fetch('/snag-360.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /snag-360.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')
        doc.querySelector('.clients-section')?.remove()
        doc.querySelector('.testimonials-section')?.remove()
        doc.querySelector('a[href="#testimonials"]')?.closest('li')?.remove()

        const nav = doc.querySelector('#navbar')
        const navLinks = nav?.querySelector('.nav-links')
        if (navLinks) {
          const painLink = navLinks.querySelector('a[href="#pain"]')?.closest('li')
          const walkLink = navLinks.querySelector('a[href="#walkthrough"]')?.closest('li')
          const featuresLink = navLinks.querySelector('a[href="#features"]')?.closest('li')
          const teamsLink = doc.createElement('li')
          teamsLink.innerHTML = '<a href="#teams">Teams</a>'
          const useCasesLink = navLinks.querySelector('a[href="#usecases"]')?.closest('li')

          navLinks.innerHTML = ''
          ;[painLink, walkLink, featuresLink, teamsLink, useCasesLink].forEach((item) => {
            if (item) navLinks.appendChild(item)
          })
        }

        const hero = doc.querySelector('.hero')
        const pain = doc.querySelector('#pain')
        const walkthrough = doc.querySelector('#walkthrough')
        const features = doc.querySelector('#features')
        const teams = doc.querySelector('#teams')
        const useCases = doc.querySelector('#usecases')
        const modals = Array.from(doc.querySelectorAll('.usecase-modal'))
        const endingBanner = doc.querySelector('.end-banner')
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
          ...modals,
          endingBanner,
          contact,
          footer,
        ].forEach((node) => {
          if (node) doc.body.appendChild(node)
        })

        const style = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!style.trim() || !body.trim()) {
          throw new Error('`public/snag-360.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
        setCssText(`${style}\n${SNAG360_ISOLATION_CSS}`)
        setBodyHtml(body)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Snag 360 content')
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
    const lenisScroll = createLenisScrollSync()
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)
    const snagWindow: Snag360Window = window

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal on scroll
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
          revealObs.unobserve(el)
        })
      },
      { threshold: 0.12 },
    )
    root.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el))

    // Hero counters
    function animateCounter(el: HTMLElement, target: number, suffix: string) {
      let start = 0
      const duration = 2200
      const step = 16
      const increment = target / (duration / step)
      const interval = window.setInterval(() => {
        start += increment
        if (start >= target) {
          start = target
          window.clearInterval(interval)
        }
        el.innerHTML = `${Math.floor(start)}<span class="accent">${suffix}</span>`
      }, step)
      return interval
    }

    let countersStarted = false
    const heroMetrics = root.querySelector('.hero-metrics')
    const counterTimers: number[] = []
    const counterObs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (countersStarted) return
        countersStarted = true
        window.setTimeout(() => {
          const m1 = root.querySelector<HTMLElement>('#m1')
          const m2 = root.querySelector<HTMLElement>('#m2')
          const m3 = root.querySelector<HTMLElement>('#m3')
          if (m1) counterTimers.push(animateCounter(m1, 60, '%'))
          if (m2) counterTimers.push(animateCounter(m2, 4, 'x'))
          if (m3) counterTimers.push(animateCounter(m3, 5, 'hr'))
        }, 200)
        counterObs.disconnect()
      },
      { threshold: 0.5 },
    )
    if (heroMetrics) counterObs.observe(heroMetrics)

    // Bento background cells
    const bg = root.querySelector<HTMLElement>('#bentoBg')
    if (bg && bg.childElementCount === 0) {
      for (let i = 0; i < 30; i++) {
        const c = document.createElement('div')
        c.className = 'bento-bg-cell'
        bg.appendChild(c)
      }
    }
    const bentoTimer = window.setInterval(() => {
      if (!bg) return
      const cells = Array.from(bg.querySelectorAll<HTMLElement>('.bento-bg-cell'))
      if (!cells.length) return
      cells.forEach((c) => c.classList.remove('lit'))
      const count = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < count; i++) {
        cells[Math.floor(Math.random() * cells.length)]?.classList.add('lit')
      }
    }, 2400)

    // USP accordion (HTML uses inline onclick="toggleUSP(this, idx)")
    const showScreen = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.usp-screen').forEach((s, i) => {
        s.classList.toggle('visible', i === idx)
      })
    }
    snagWindow.toggleUSP = (item: HTMLElement, idx: number) => {
      const isActive = item.classList.contains('active')
      root.querySelectorAll<HTMLElement>('.usp-item').forEach((i) => i.classList.remove('active'))
      if (!isActive) {
        item.classList.add('active')
        showScreen(idx)
      }
    }
    const firstUsp = root.querySelector<HTMLElement>('.usp-item')
    if (firstUsp) {
      firstUsp.classList.add('active')
      showScreen(0)
    }

    // Walkthrough tabs (HTML uses inline onclick="switchTab(idx)")
    snagWindow.switchTab = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.feature-tab').forEach((t, i) => {
        t.classList.toggle('active', i === idx)
      })
      root.querySelectorAll<HTMLElement>('.feature-panel').forEach((p, i) => {
        p.classList.toggle('active', i === idx)
      })
    }

    // Use case modals (HTML uses inline onclick="openModal('id')" and closeModal(...))
    snagWindow.openModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>('#modal-' + id)
      if (!modal) return
      modal.classList.add('open')
      document.body.style.overflow = 'hidden'
      lenisScroll.stop()
    }
    snagWindow.closeModal = (e: MouseEvent, id: string, force?: boolean) => {
      const modal = root.querySelector<HTMLElement>('#' + id)
      if (!modal) return
      const shouldClose = Boolean(force) || (e?.target && e.target === modal)
      if (!shouldClose) return
      modal.classList.remove('open')
      document.body.style.overflow = ''
      lenisScroll.start()
    }

    // Team tabs (HTML uses inline onclick="switchTeam(idx)") + pinned story on scroll.
    // Tab clicks must scroll to the matching segment — otherwise #teamsStoryProgress stays at the old scaleX(scroll).
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const progressFillEl = root.querySelector<HTMLElement>('#teamsStoryProgress')
    const switchTeamAt = (idx: number) => {
      teamTabs.forEach((t, i) => t.classList.toggle('active', i === idx))
      teamPanels.forEach((c, i) => c.classList.toggle('active', i === idx))
    }
    let teamsStoryTrigger: ScrollTrigger | null = null
    const scrollToTeamIndex = (idx: number) => {
      const n = teamTabs.length
      if (!Number.isFinite(idx) || idx < 0 || idx >= n) return
      if (!teamsStoryTrigger) {
        switchTeamAt(idx)
        if (progressFillEl) {
          progressFillEl.style.transform =
            n <= 1 ? 'scaleX(1)' : `scaleX(${idx / (n - 1)})`
        }
        return
      }
      const st = teamsStoryTrigger
      if (n <= 1) {
        switchTeamAt(0)
        return
      }
      const p = idx / (n - 1)
      const y = st.start + p * (st.end - st.start)
      scrollDocumentToY(lenisScroll.instance, y)
    }
    teamsStoryTrigger = initSnagTeamsGsap(root, { teamTabs, switchTeamAt })
    requestAnimationFrame(() => {
      lenisScroll.resize()
      ScrollTrigger.refresh()
    })
    snagWindow.switchTeam = (idx: number) => scrollToTeamIndex(idx)

    // Smooth in-page anchors inside this landing page (with fixed-nav offset).
    const anchorHandlers: Array<{
      a: HTMLAnchorElement
      onClick: (e: MouseEvent) => void
    }> = []
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const onClick = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href) return
        const t = root.querySelector<HTMLElement>(href)
        if (!t) return
        e.preventDefault()
        const top = t.getBoundingClientRect().top + window.scrollY - SNAG_NAV_OFFSET_PX - 4
        scrollDocumentToY(lenisScroll.instance, top)
      }
      a.addEventListener('click', onClick)
      anchorHandlers.push({ a, onClick })
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      root.querySelectorAll<HTMLElement>('.usecase-modal.open').forEach((m) => m.classList.remove('open'))
      document.body.style.overflow = ''
      lenisScroll.start()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      revealObs.disconnect()
      counterObs.disconnect()
      window.clearInterval(bentoTimer)
      counterTimers.forEach((t) => window.clearInterval(t))
      anchorHandlers.forEach(({ a, onClick }) => a.removeEventListener('click', onClick))
      teamsStoryTrigger?.kill(true)
      innerScrollCleanup()
      lenisScroll.destroy()
      teamsStoryTrigger = null
      delete snagWindow.toggleUSP
      delete snagWindow.switchTab
      delete snagWindow.openModal
      delete snagWindow.closeModal
      delete snagWindow.switchTeam
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="snag360-root min-h-dvh bg-[#F6F4EE]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>Snag 360 error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}

