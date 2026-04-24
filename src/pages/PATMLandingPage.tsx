import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/** Fixed nav height in `public/patm.html` — pin start + scroll padding must match. */
const PATM_NAV_OFFSET_PX = 68
/** Pinned two-column team story only at this width+ (matches public/patm.html stacked breakpoint). */
const PATM_TEAMS_PIN_MIN_WIDTH_PX = 1101
/** Team use cases: viewport heights of scroll per tab (higher = more time to read each team while scrolling). */
const TEAM_STORY_SCROLL_PER_TAB_VH = 1.0

/** Scoped overrides so app Tailwind / global styles do not force white shells, buttons, or forms. */
const PATM_ISOLATION_CSS = `
.patm-root {
  position: relative;
  isolation: isolate;
}
html:has(.patm-root) {
  scroll-padding-top: ${PATM_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
  overflow-anchor: none;
}
.patm-root .teams-section,
.patm-root #teamsStoryPin,
.patm-root .pin-spacer {
  overflow-anchor: none;
}
.patm-root section[id],
.patm-root .teams-section#teams {
  scroll-margin-top: ${PATM_NAV_OFFSET_PX + 4}px;
}
.patm-root #navbar {
  z-index: 10050;
}
/* Progress bar: outer wrapper + track + fill (same pattern as Snag360 / loyalty-rule-engine). */
.patm-root #teamsStoryPin > .teams-story-progress {
  display: block !important;
  width: 100% !important;
  max-width: 480px !important;
  margin: 28px auto 0 !important;
  padding: 0 20px !important;
  box-sizing: border-box !important;
  height: auto !important;
  min-height: 0 !important;
  background: transparent !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
  visibility: visible !important;
  opacity: 1 !important;
}
.patm-root #teamsStoryPin .teams-story-progress-track {
  display: block !important;
  height: 4px !important;
  border-radius: 100px !important;
  background: rgba(44, 44, 44, 0.12) !important;
  overflow: hidden !important;
}
.patm-root #teamsStoryPin #teamsStoryProgress,
.patm-root #teamsStoryPin .teams-story-progress-fill {
  display: block !important;
  min-height: 4px !important;
  height: 100% !important;
  width: 100% !important;
  background: var(--primary, #da7756) !important;
  border-radius: 100px !important;
  transform-origin: left center !important;
}
/* Two-column + GSAP pin only on wide viewports. Below 1100px the HTML stacks — fixed pin height
   was clipping the tab rail, headings, and progress (768px was stuck between 767/768 media rules). */
@media (min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px) {
  .patm-root #teamsStoryPin {
    z-index: 1 !important;
    will-change: auto !important;
    display: flex !important;
    flex-direction: column !important;
    height: calc(100dvh - ${PATM_NAV_OFFSET_PX}px) !important;
    max-height: calc(100dvh - ${PATM_NAV_OFFSET_PX}px) !important;
    min-height: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    overflow-x: hidden !important;
  }
  .patm-root #teamsStoryPin > .teams-header {
    flex: 0 0 auto !important;
  }
  .patm-root #teamsStoryPin .teams-layout {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    min-width: 0 !important;
    display: grid !important;
    grid-template-columns: minmax(0, 304px) minmax(0, 1fr) !important;
    grid-template-rows: minmax(0, 1fr) !important;
    gap: 40px !important;
    align-items: stretch !important;
    margin-top: 0 !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .teams-tabs {
    min-height: 0 !important;
    align-self: start !important;
    max-height: 100% !important;
    box-sizing: border-box !important;
    padding-bottom: 10px !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-gutter: stable;
    touch-action: pan-y !important;
  }
  .patm-root #teamsStoryPin .teams-tabs::-webkit-scrollbar {
    display: block !important;
    width: 6px;
  }
  .patm-root #teamsStoryPin .teams-tabs::-webkit-scrollbar-thumb {
    background: rgba(44, 44, 44, 0.28);
    border-radius: 4px;
  }
  .patm-root #teamsStoryPin .teams-panels {
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .team-content.active {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) minmax(0, min(420px, 50%)) !important;
    align-items: start !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-info {
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-visual {
    align-self: start !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
  }
}
.patm-root .pin-spacer {
  background: var(--cream, #F6F4EE) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.patm-root .team-content.active {
  align-items: start !important;
}
.patm-root .team-content.active > .team-visual {
  height: auto !important;
  align-self: start !important;
  justify-self: end !important;
  width: 100% !important;
  max-width: min(100%, var(--team-visual-max-w, 300px)) !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  aspect-ratio: auto !important;
}
.patm-root .team-content.active .team-visual-body {
  flex: 0 0 auto !important;
}
/* Stacked layout (≤1100px): document scroll; no fixed-height pin. Matches patm.html @media 1100px. */
@media (max-width: 1100px) {
  .patm-root .teams-section#teams,
  .patm-root .teams-section#teams .teams-inner {
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin {
    height: auto !important;
    max-height: none !important;
    display: block !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .teams-layout,
  .patm-root #teamsStoryPin .teams-panels,
  .patm-root #teamsStoryPin .team-content.active {
    display: block !important;
    flex: none !important;
    max-height: none !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-info,
  .patm-root #teamsStoryPin .team-content.active > .team-visual {
    max-height: none !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .teams-tabs {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin > .teams-story-progress,
  .patm-root .teams-section .teams-story-progress {
    display: block !important;
    width: 100% !important;
    max-width: 480px !important;
    margin: 28px auto 0 !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}
@media (max-width: 768px) {
  .patm-root #teams .teams-header {
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  .patm-root #teams .section-title,
  .patm-root #teams .section-sub {
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
  }
}
.patm-root #teamsStoryProgress {
  transform-origin: left center !important;
}
.patm-root,
.patm-root * {
  color-scheme: only light !important;
}
.patm-root h1,
.patm-root h2,
.patm-root h3,
.patm-root h4,
.patm-root h5,
.patm-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.patm-root nav {
  background: rgba(246, 244, 238, 0.92) !important;
}
.patm-root nav.scrolled {
  background: rgba(246, 244, 238, 0.97) !important;
}
.patm-root .hero,
.patm-root .walkthrough-section,
.patm-root .teams-section,
.patm-root .usps-section,
.patm-root .contact-section,
.patm-root footer {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .section#pain {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .usecases-section {
  background-color: var(--band, #E8E2D6) !important;
}
.patm-root .clients-section {
  background: rgba(232, 226, 214, 0.55) !important;
}
.patm-root .usp-visual {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .usp-visual-header {
  background: rgba(240, 234, 225, 0.92) !important;
}
.patm-root .screen-sovereignty,
.patm-root .screen-tasks,
.patm-root .screen-analytics,
.patm-root .screen-mom,
.patm-root .screen-kanban,
.patm-root .screen-allinone {
  background: rgba(240, 234, 225, 0.96) !important;
}
.patm-root .feature-screen {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .feature-screen-header {
  background: rgba(240, 234, 225, 0.88) !important;
}
.patm-root .feature-screen-body {
  background-color: var(--cream, #F6F4EE) !important;
}
/* Team mock: compact card (max width from --team-visual-max-w in patm.html) */
.patm-root .team-visual {
  background-color: var(--surface, #F0EAE1) !important;
  border: 1px solid #c4b89d !important;
  box-shadow: 0 8px 28px rgba(44, 44, 44, 0.08) !important;
  border-radius: 16px !important;
  max-width: min(100%, var(--team-visual-max-w, 300px)) !important;
}
.patm-root .team-visual-header {
  background: var(--cream, #F6F4EE) !important;
  border-bottom: 1px solid #c4bcad !important;
}
.patm-root .team-visual-body {
  background: var(--cream, #F6F4EE) !important;
}
.patm-root .float-card {
  background: rgba(240, 234, 225, 0.94) !important;
}
.patm-root .modal-inner {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .modal-close {
  background: rgba(240, 234, 225, 0.96) !important;
}
.patm-root .modal-close:hover {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .end-banner {
  background-color: var(--band, #E8E2D6) !important;
}
.patm-root .pain-card {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .trust-badge {
  background: rgba(240, 234, 225, 0.92) !important;
}
.patm-root .usecase-card {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .glass {
  background: rgba(246, 244, 238, 0.72) !important;
  border-color: rgba(196, 184, 157, 0.45) !important;
}
.patm-root button.feature-tab {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .feature-tabs {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .teams-tabs {
  background: transparent !important;
}
.patm-root .teams-layout button.team-tab {
  color: var(--dark, #2c2c2c) !important;
  border: 1.5px solid transparent !important;
}
.patm-root .teams-layout button.team-tab:not(.active) {
  background: var(--surface, #f0eae1) !important;
}
.patm-root .teams-layout button.team-tab.active {
  background: rgba(218, 119, 86, 0.05) !important;
  border-color: var(--primary, #da7756) !important;
}
.patm-root .teams-layout .team-tab-text {
  color: rgba(44, 44, 44, 0.6) !important;
}
.patm-root .teams-layout .team-tab.active .team-tab-text {
  color: var(--dark, #2c2c2c) !important;
}
.patm-root .teams-layout .team-tab-icon {
  background: var(--cream, #f6f4ee) !important;
  border: 1px solid var(--divider, rgba(196, 184, 157, 0.55)) !important;
}
.patm-root .teams-layout .team-tab.active .team-tab-icon {
  background: var(--primary, #da7756) !important;
  border-color: var(--primary, #da7756) !important;
}
.patm-root .teams-layout .team-tab.active .team-tab-icon svg {
  color: var(--on-primary, #f6f4ee) !important;
  opacity: 1 !important;
}
.patm-root .teams-layout .team-tab-icon svg {
  color: rgba(44, 44, 44, 0.5) !important;
  opacity: 1 !important;
}
/* Larger team tabs (tap targets) + bottom padding so the last item clears the screen / home indicator. */
.patm-root #teams .teams-tabs {
  gap: 10px !important;
  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px)) !important;
}
.patm-root #teams .teams-layout button.team-tab {
  min-height: 58px !important;
  padding: 18px 20px !important;
  border-radius: 14px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  font-size: 15px !important;
  line-height: 1.35 !important;
}
.patm-root #teams .teams-layout .team-tab-text {
  font-size: 15px !important;
  line-height: 1.35 !important;
}
.patm-root #teams .teams-layout .team-tab-icon {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  border-radius: 12px !important;
}
.patm-root #teams .teams-layout .team-tab-icon svg {
  width: 22px !important;
  height: 22px !important;
  flex-shrink: 0 !important;
}
.patm-root .btn-primary,
.patm-root .btn-hero-primary,
.patm-root .form-submit {
  color: var(--on-primary, #F6F4EE) !important;
}
.patm-root .form-input,
.patm-root .form-select,
.patm-root textarea.form-input {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .form-input:focus,
.patm-root textarea.form-input:focus {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .form-input:-webkit-autofill,
.patm-root .form-input:-webkit-autofill:hover,
.patm-root .form-input:-webkit-autofill:focus,
.patm-root .form-select:-webkit-autofill,
.patm-root .form-select:-webkit-autofill:hover,
.patm-root .form-select:-webkit-autofill:focus,
.patm-root textarea.form-input:-webkit-autofill,
.patm-root textarea.form-input:-webkit-autofill:hover,
.patm-root textarea.form-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface, #F0EAE1) inset !important;
  box-shadow: 0 0 0 1000px var(--surface, #F0EAE1) inset !important;
  -webkit-text-fill-color: var(--dark, #2C2C2C) !important;
}
`

type PatmTeamStoryGsapOpts = {
  teamTabs: HTMLElement[]
  teamIds: string[]
  switchTeam: (teamId: string, tabEl?: HTMLElement) => void
}

/**
 * #teams — pin + scroll story only on wide two-column layout (min-width: 1101px).
 * Below that: use initPatmTeamProgressBarOnly. Reduced motion: no ST.
 */
function initPatmTeamStoryGsap(
  root: HTMLElement,
  opts: PatmTeamStoryGsapOpts,
): ScrollTrigger | null {
  const pin = root.querySelector<HTMLElement>('#teamsStoryPin')
  if (!pin) return null

  const n = opts.teamIds.length
  if (n < 1) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (!window.matchMedia(`(min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px)`).matches) return null

  const progressFill = root.querySelector<HTMLElement>('#teamsStoryProgress')
  let lastIdx = -1

  const applyProgress = (self: ScrollTrigger) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(self.progress * n)))
    if (idx !== lastIdx) {
      lastIdx = idx
      const id = opts.teamIds[idx]
      if (id) opts.switchTeam(id, opts.teamTabs[idx])
    }
    if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
  }

  return ScrollTrigger.create({
    id: 'patm-teams-use-cases',
    trigger: pin,
    start: `top ${PATM_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * TEAM_STORY_SCROLL_PER_TAB_VH}`,
    pin: true,
    pinSpacing: true,
    pinType: 'fixed',
    anticipatePin: 0,
    fastScrollEnd: false,
    invalidateOnRefresh: true,
    onEnter: (self) => applyProgress(self),
    onEnterBack: (self) => applyProgress(self),
    onRefresh: (self) => {
      lastIdx = -1
      applyProgress(self)
    },
    onUpdate: (self) => applyProgress(self),
  })
}

/**
 * Below min pin width: no pin (document scroll). Scrub the horizontal bar only; tabs are click-only.
 */
function initPatmTeamProgressBarOnly(
  root: HTMLElement,
  opts: PatmTeamStoryGsapOpts,
): ScrollTrigger | null {
  const pin = root.querySelector<HTMLElement>('#teamsStoryPin')
  if (!pin) return null

  const n = opts.teamIds.length
  if (n < 1) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (window.matchMedia(`(min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px)`).matches) return null

  const progressFill = root.querySelector<HTMLElement>('#teamsStoryProgress')
  const applyBar = (self: ScrollTrigger) => {
    if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
  }

  return ScrollTrigger.create({
    id: 'patm-teams-progress-mobile',
    trigger: pin,
    start: `top ${PATM_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * TEAM_STORY_SCROLL_PER_TAB_VH}`,
    pin: false,
    scrub: 0.2,
    invalidateOnRefresh: true,
    onEnter: (self) => applyBar(self),
    onEnterBack: (self) => applyBar(self),
    onRefresh: (self) => applyBar(self),
    onUpdate: (self) => applyBar(self),
  })
}

const BACKDROP_FILTER_FIX_CSS = `
/* PATM integration fix:
   Some browsers/pages can end up with unintended backdrop-filter layers
   that visually blur content. Disable globally inside PATM and re-enable
   only for the intended components. */
.patm-root * {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
.patm-root nav {
  -webkit-backdrop-filter: blur(20px) !important;
  backdrop-filter: blur(20px) !important;
}
.patm-root .usecase-modal {
  -webkit-backdrop-filter: blur(8px) !important;
  backdrop-filter: blur(8px) !important;
}
.patm-root .float-card {
  -webkit-backdrop-filter: blur(20px) !important;
  backdrop-filter: blur(20px) !important;
}
.patm-root .glass {
  -webkit-backdrop-filter: blur(24px) !important;
  backdrop-filter: blur(24px) !important;
}

.patm-root {
  color-scheme: only light;
}

/* Hard-disable transform-based reveal helpers (prevents any residual soft rendering) */
.patm-root .reveal,
.patm-root .fade-up {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
  transition: none !important;
}
.patm-root .reveal.in-view { opacity: 1 !important; transform: none !important; }
.patm-root #walkthrough .feature-info {
  max-height: min(72vh, calc(100vh - 200px));
  overflow-y: auto;
  overscroll-behavior: contain;
}
`

export default function PATMLandingPage() {
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
        const res = await fetch('/patm.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /patm.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/patm.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${BACKDROP_FILTER_FIX_CSS}\n${PATM_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load PATM content')
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
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Scroll reveal (adds `in-view` to `.reveal`)
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    const markRevealsInView = () => {
      const vh = window.innerHeight || 0
      revealEls.forEach((el) => {
        if (el.classList.contains('in-view')) return
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.92) el.classList.add('in-view')
      })
    }
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('in-view')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    revealEls.forEach((el) => revealObserver.observe(el))
    // Fallback: ensure nothing stays "pre-reveal" (which can look soft/blurred)
    markRevealsInView()
    window.addEventListener('scroll', markRevealsInView, { passive: true })
    window.addEventListener('resize', markRevealsInView, { passive: true })
    // Some elements appear via tabs/carousels without scrolling; re-check after interactions
    const onAnyClick = () => window.requestAnimationFrame(markRevealsInView)
    root.addEventListener('click', onAnyClick, true)
    // Also re-check briefly after mount (covers late layout/paint)
    const revealWarmup = (() => {
      let n = 0
      const id = window.setInterval(() => {
        markRevealsInView()
        n += 1
        if (n >= 20) window.clearInterval(id) // ~6s
      }, 300)
      return id
    })()
    // Absolute fallback: if any are still not revealed, reveal them all.
    const forceRevealAll = window.setTimeout(() => {
      revealEls.forEach((el) => el.classList.add('in-view'))
    }, 1200)

    // Counter animation (hero metrics)
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.counter'))
    let countersStarted = false
    const counterTimers: number[] = []

    const startCounters = () => {
      if (countersStarted) return
      countersStarted = true
      counters.forEach((counter) => {
        const target = Number.parseFloat(counter.dataset.target || '0')
        if (!Number.isFinite(target)) return
        const prefix = counter.dataset.prefix || ''
        const suffix = counter.dataset.suffix || ''
        const isDecimal = counter.dataset.decimal === 'true'
        const duration = 2000
        const steps = 60
        const stepTime = duration / steps
        let current = 0
        const increment = target / steps
        const timer = window.setInterval(() => {
          current += increment
          if (current >= target) current = target
          const display = isDecimal ? current.toFixed(1) : String(Math.floor(current))
          counter.textContent = `${prefix}${display}${suffix}`
          if (current >= target) window.clearInterval(timer)
        }, stepTime)
        counterTimers.push(timer)
      })
    }

    const metricsEl = root.querySelector<HTMLElement>('#hero-metrics')
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) startCounters()
        })
      },
      { threshold: 0.3 },
    )
    if (metricsEl) metricsObserver.observe(metricsEl)

    // USP accordion (switch `.usp-item.active` and `.usp-screen.visible`)
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    const uspClickHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    uspItems.forEach((item) => {
      const header = item.querySelector<HTMLElement>('.usp-header')
      if (!header) return
      const onClick = () => {
        const targetScreen = item.dataset.screen || ''
        uspItems.forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
        uspScreens.forEach((s) => s.classList.remove('visible'))
        const target = root.querySelector<HTMLElement>(`#${CSS.escape(targetScreen)}`)
        if (target) target.classList.add('visible')
      }
      header.addEventListener('click', onClick)
      uspClickHandlers.push({ el: header, fn: onClick })
    })

    // Feature tabs
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    const featureHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    featureTabs.forEach((tab) => {
      const fn = () => {
        const feature = tab.dataset.feature || ''
        featureTabs.forEach((t) => t.classList.remove('active'))
        featurePanels.forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        const panel = root.querySelector<HTMLElement>(`[data-panel="${CSS.escape(feature)}"]`)
        if (panel) panel.classList.add('active')
      }
      tab.addEventListener('click', fn)
      featureHandlers.push({ el: tab, fn })
    })

    // Pain card hover glow
    const painCards = Array.from(root.querySelectorAll<HTMLElement>('.pain-card'))
    const painHandlers: Array<{ el: HTMLElement; onMove: (e: MouseEvent) => void; onLeave: () => void }> = []
    painCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(218,119,86,0.04) 0%, #F0EAE1 60%)`
      }
      const onLeave = () => {
        card.style.background = ''
      }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      painHandlers.push({ el: card, onMove, onLeave })
    })

    // Animate progress bars (USP analytics + feature screens)
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).querySelectorAll<HTMLElement>('.progress-bar-fill').forEach((bar) => {
            const width = bar.style.width
            if (!width) return
            bar.style.width = '0%'
            window.setTimeout(() => {
              bar.style.width = width
            }, 100)
          })
        })
      },
      { threshold: 0.3 },
    )
    root.querySelectorAll<HTMLElement>('.screen-analytics, .feature-screen-body').forEach((el) => progressObserver.observe(el))

    // Teams: slide-in keyframes + scroll-pinned “Built for every team” (GSAP; same behavior as Vendor Management)
    const slideStyle = document.createElement('style')
    slideStyle.textContent = `
      @keyframes patmSlideIn {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .patm-root .team-content.active { animation: patmSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
    `
    document.head.appendChild(slideStyle)

    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.teams-tabs .team-tab'))
    const teamContents = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const switchTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => t.classList.remove('active'))
      teamContents.forEach((c) => c.classList.remove('active'))
      const tab = tabEl ?? teamTabs.find((t) => t.dataset.team === teamId)
      tab?.classList.add('active')
      const content = teamContents.find((c) => c.dataset.content === teamId)
      if (content) {
        content.classList.add('active')
        content.style.animation = 'none'
        void content.offsetHeight
        content.style.animation = ''
      }
    }
    const teamIds = teamTabs.map((t) => t.dataset.team).filter(Boolean) as string[]
    const lenisScroll = createLenisScrollSync()
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)
    let teamStorySt: ScrollTrigger | null = null
    const scrollToTeamIndex = (idx: number) => {
      if (!teamIds[idx] || !teamTabs[idx]) return
      if (!teamStorySt) {
        switchTeam(teamIds[idx]!, teamTabs[idx]!)
        return
      }
      /* Stacked / narrow: no pin; keep tab switches instant (no Lenis jump). */
      if (window.matchMedia('(max-width: 1100px)').matches) {
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
      const teamId = tab.dataset.team || ''
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
    if (initialTeamTab?.dataset.team) switchTeam(initialTeamTab.dataset.team, initialTeamTab)

    const refreshTeamScroll = () => {
      requestAnimationFrame(() => {
        lenisScroll.resize()
        ScrollTrigger.refresh()
      })
    }
    const gsapCtx = gsap.context(() => {
      teamStorySt = window.matchMedia(`(min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px)`).matches
        ? initPatmTeamStoryGsap(root, { teamTabs, teamIds, switchTeam })
        : initPatmTeamProgressBarOnly(root, { teamTabs, teamIds, switchTeam })
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

    // Use case modals
    const openModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (modal) {
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
        lenisScroll.stop()
      }
    }
    const closeModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (modal) {
        modal.classList.remove('open')
        document.body.style.overflow = ''
        lenisScroll.start()
      }
    }
    ;(window as any).closeModal = closeModal

    const usecaseCards = Array.from(root.querySelectorAll<HTMLElement>('.usecase-card'))
    const usecaseCardHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    usecaseCards.forEach((card) => {
      const fn = () => {
        const modalId = card.dataset.modal || ''
        if (modalId) openModal(modalId)
      }
      card.addEventListener('click', fn)
      usecaseCardHandlers.push({ el: card, fn })
    })

    const modalBackdrops = Array.from(root.querySelectorAll<HTMLElement>('.usecase-modal'))
    const modalBackdropHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    modalBackdrops.forEach((modal) => {
      const fn = (e: MouseEvent) => {
        if (e.target === modal) {
          modal.classList.remove('open')
          document.body.style.overflow = ''
          lenisScroll.start()
        }
      }
      modal.addEventListener('click', fn)
      modalBackdropHandlers.push({ el: modal, fn })
    })

    const modalInners = Array.from(root.querySelectorAll<HTMLElement>('.modal-inner'))
    const modalInnerHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    modalInners.forEach((inner) => {
      const fn = (e: MouseEvent) => e.stopPropagation()
      inner.addEventListener('click', fn)
      modalInnerHandlers.push({ el: inner, fn })
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      root.querySelectorAll<HTMLElement>('.usecase-modal.open').forEach((m) => m.classList.remove('open'))
      document.body.style.overflow = ''
      lenisScroll.start()
    }
    document.addEventListener('keydown', onKeyDown)

    // Hover glow vars on usecase cards
    const usecaseHoverHandlers: Array<{ el: HTMLElement; onMove: (e: MouseEvent) => void }> = []
    usecaseCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mx', `${x}%`)
        card.style.setProperty('--my', `${y}%`)
      }
      card.addEventListener('mousemove', onMove)
      usecaseHoverHandlers.push({ el: card, onMove })
    })

    // Animate bar fills on scroll (teams visuals + end banner)
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement)
            .querySelectorAll<HTMLElement>('.bar-fill, .float-progress-fill')
            .forEach((bar) => {
              const w = bar.style.width
              if (!w) return
              bar.style.width = '0%'
              bar.style.transition = 'width 1.2s cubic-bezier(0.23,1,0.32,1)'
              window.setTimeout(() => {
                bar.style.width = w
              }, 100)
            })
        })
      },
      { threshold: 0.3 },
    )
    root
      .querySelectorAll<HTMLElement>('.team-visual-body, .end-banner, #cta-banner')
      .forEach((el) => barObserver.observe(el))

    // Contact submit
    const submitBtn = root.querySelector<HTMLButtonElement>('.form-submit')
    const onSubmit = (e: Event) => {
      e.preventDefault()
      if (!submitBtn) return
      const span = submitBtn.querySelector('span')
      if (span) span.textContent = 'Message Sent!'
      submitBtn.style.background = '#798C5E'
      window.setTimeout(() => {
        if (span) span.textContent = 'Send Message'
        submitBtn.style.background = ''
      }, 3000)
    }
    submitBtn?.addEventListener('click', onSubmit)

    return () => {
      gsapCtx.revert()
      innerScrollCleanup()
      lenisScroll.destroy()
      clearTimeout(lateLayout)
      window.removeEventListener('load', onLayoutRefresh)
      window.removeEventListener('resize', onResize)
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)

      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', markRevealsInView)
      window.removeEventListener('resize', markRevealsInView)
      root.removeEventListener('click', onAnyClick, true)
      window.clearInterval(revealWarmup)
      window.clearTimeout(forceRevealAll)
      revealObserver.disconnect()
      metricsObserver.disconnect()
      progressObserver.disconnect()
      barObserver.disconnect()
      counterTimers.forEach((t) => window.clearInterval(t))

      uspClickHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      featureHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      painHandlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      usecaseCardHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalBackdropHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalInnerHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      usecaseHoverHandlers.forEach(({ el, onMove }) => el.removeEventListener('mousemove', onMove))
      submitBtn?.removeEventListener('click', onSubmit)
      document.removeEventListener('keydown', onKeyDown)
      slideStyle.remove()
      delete (window as any).closeModal
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="patm-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>PATM error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}

