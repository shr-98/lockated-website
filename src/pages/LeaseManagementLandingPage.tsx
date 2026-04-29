import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

const LEASE_NAV_OFFSET_PX = 68
const LEASE_TEAM_STORY_SCROLL_PER_TAB_VH = 0.7

function initLeaseTeamsGsap(
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
    id: 'lease-teams-use-cases',
    trigger: pin,
    start: `top ${LEASE_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * LEASE_TEAM_STORY_SCROLL_PER_TAB_VH}`,
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

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/**
 * Standalone `lease-management.html` matches Vendor Management tokens (cream / band / surface).
 * The app shell's `index.css` adds global `.reveal` blur and Tailwind preflight resets buttons/inputs —
 * mirror `VendorManagementLandingPage` scoping so the route matches the warm theme.
 */
const LEASE_ISOLATION_CSS = `
.lease-management-root {
  /* Ensure tokens exist even if :root is not applied as expected */
  --primary: #DA7756;
  --primary-15: rgba(218,119,86,0.15);
  --primary-8: rgba(218,119,86,0.08);
  --cream: #F6F4EE;
  --band: #E8E2D6;
  --surface: #F0EAE1;
  --dark: #2C2C2C;
  --border: #C4B89D;
  --on-primary: #F6F4EE;
  color-scheme: only light;
  background-color: var(--cream) !important;
}
html:has(.lease-management-root) {
  scroll-padding-top: ${LEASE_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.lease-management-root section[id],
.lease-management-root .teams-section#teams {
  scroll-margin-top: ${LEASE_NAV_OFFSET_PX + 4}px;
}
.lease-management-root #navbar {
  z-index: 10050;
}
/* Eyebrow + title + sub scroll; pin is tab rail + panels + progress (FM Matrix–style). */
.lease-management-root .teams-section .teams-section-header {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
.lease-management-root #teamsStoryPin {
  z-index: 1 !important;
  background: var(--cream, #F6F4EE) !important;
  min-height: calc(100vh - ${LEASE_NAV_OFFSET_PX}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 32px !important;
}
/* Bounded-height pin so center copy column (.team-panel-info) + screen column
   become their own scrollports — wheel router (attachTeamStoryInnerScroll)
   then routes deltas to them when cursor is over the column. Parity with
   Snag 360 / PATM. */
@media (min-width: 768px) {
  .lease-management-root #teamsStoryPin {
    height: calc(100dvh - ${LEASE_NAV_OFFSET_PX}px) !important;
    max-height: calc(100dvh - ${LEASE_NAV_OFFSET_PX}px) !important;
    box-sizing: border-box !important;
    justify-content: flex-start !important;
    overflow: hidden !important;
  }
  .lease-management-root #teamsStoryPin .teams-story-pin-inner {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .lease-management-root #teamsStoryPin .teams-layout {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
  .lease-management-root #teamsStoryPin .team-panels {
    min-width: 0 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .lease-management-root #teamsStoryPin .team-panel.active {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow: hidden !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
    grid-template-rows: minmax(0, 1fr) !important;
    align-items: stretch !important;
  }
  .lease-management-root #teamsStoryPin .team-panel.active > .team-panel-info,
  .lease-management-root #teamsStoryPin .team-panel.active > .team-panel-screen {
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
  }
}
.lease-management-root .teams-story-pin-inner {
  padding-top: 0 !important;
}
.lease-management-root .teams-story-progress--footer {
  margin-top: 32px !important;
  margin-bottom: 0 !important;
  max-width: 480px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  flex: 0 0 auto !important;
}
/* No GSAP pin below 768px — let Team Use Cases flow with document scroll. */
@media (max-width: 767px) {
  .lease-management-root #teamsStoryPin {
    min-height: 0 !important;
    display: block !important;
  }
}
.lease-management-root .teams-layout {
  margin-top: 0 !important;
  align-items: stretch !important;
  flex: 1;
}
.lease-management-root .pin-spacer {
  background: var(--cream, #F6F4EE) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.lease-management-root .reveal {
  opacity: 0 !important;
  transform: translateY(28px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.65s ease, transform 0.65s ease !important;
}
.lease-management-root .reveal.visible,
.lease-management-root .reveal.reveal--in {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
.lease-management-root h1,
.lease-management-root h2,
.lease-management-root h3,
.lease-management-root h4,
.lease-management-root h5,
.lease-management-root h6 {
  font-family: var(--font), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
@media (prefers-reduced-motion: reduce) {
  .lease-management-root .reveal,
  .lease-management-root .reveal.visible,
  .lease-management-root .reveal.reveal--in {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.lease-management-root .hero {
  background-color: var(--cream) !important;
}
.lease-management-root .pain-section,
.lease-management-root .usps-section,
.lease-management-root .usecase-section,
.lease-management-root .contact-section,
.lease-management-root footer {
  background-color: var(--cream) !important;
}
.lease-management-root .section {
  background-color: var(--cream) !important;
}
.lease-management-root .walkthrough-section {
  background-color: var(--band) !important;
}
.lease-management-root .wt-tabs {
  background-color: var(--band) !important;
}
.lease-management-root .wt-layout,
.lease-management-root .teams-layout,
.lease-management-root .usps-layout {
  background-color: transparent !important;
}
.lease-management-root .wt-tab {
  background-color: transparent !important;
  background-image: none !important;
}
.lease-management-root .wt-tab.active {
  background-color: rgba(218,119,86,0.12) !important;
}
.lease-management-root .teams-section {
  background-color: var(--cream) !important;
}
.lease-management-root .teams-section::before {
  display: none !important;
}
.lease-management-root .banner-section {
  background-color: var(--band) !important;
}
.lease-management-root .teams-tabs {
  background: transparent !important;
  box-shadow: none !important;
}
.lease-management-root .wt-tabs {
  box-shadow: none !important;
}
.lease-management-root .teams-layout .team-tab {
  color: var(--dark, #2c2c2c) !important;
  border: 1.5px solid transparent !important;
  background-image: none !important;
}
.lease-management-root .teams-layout .team-tab:not(.active) {
  background: var(--surface, #f0eae1) !important;
}
.lease-management-root .teams-layout .team-tab.active {
  background: rgba(218, 119, 86, 0.05) !important;
  border-color: var(--primary, #da7756) !important;
}
.lease-management-root .teams-layout .team-tab-name {
  color: rgba(44, 44, 44, 0.6) !important;
}
.lease-management-root .teams-layout .team-tab.active .team-tab-name {
  color: var(--dark, #2c2c2c) !important;
}
.lease-management-root .teams-layout .team-tab-icon {
  background: var(--cream, #f6f4ee) !important;
  border: 1px solid var(--divider, rgba(196, 184, 157, 0.55)) !important;
}
.lease-management-root .teams-layout .team-tab.active .team-tab-icon {
  background: var(--primary, #da7756) !important;
  border-color: var(--primary, #da7756) !important;
}
.lease-management-root .teams-layout .team-tab.active .team-tab-icon svg {
  color: var(--on-primary, #f6f4ee) !important;
}
.lease-management-root .teams-layout .team-tab-icon svg {
  color: rgba(44, 44, 44, 0.5) !important;
  stroke: currentColor !important;
}
.lease-management-root .usp-tabs,
.lease-management-root .role-switch {
  background-color: var(--band) !important;
}
.lease-management-root .usp-tab {
  background-color: transparent !important;
  background-image: none !important;
}
.lease-management-root .usp-tab.active,
.lease-management-root .usp-tab:hover {
  background-color: var(--primary-8) !important;
}
.lease-management-root button.role-btn {
  font-family: inherit !important;
  background-color: transparent !important;
  background-image: none !important;
  color: inherit !important;
}
.lease-management-root button.role-btn.active {
  background-color: var(--surface) !important;
  color: var(--dark) !important;
}
.lease-management-root .btn-primary,
.lease-management-root .btn-hero-primary,
.lease-management-root .btn-banner-primary,
.lease-management-root .hero-cta-primary,
.lease-management-root .banner-cta-primary,
.lease-management-root .form-submit {
  color: var(--on-primary) !important;
}
.lease-management-root a.btn-ghost,
.lease-management-root .btn-ghost,
.lease-management-root .hero-cta-secondary,
.lease-management-root .banner-cta-ghost {
  background-color: transparent !important;
}
.lease-management-root .form-group input,
.lease-management-root .form-group select,
.lease-management-root .form-group textarea {
  background-color: var(--surface) !important;
  color: var(--dark) !important;
}
.lease-management-root .form-group input:-webkit-autofill,
.lease-management-root .form-group input:-webkit-autofill:hover,
.lease-management-root .form-group input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface) inset !important;
  box-shadow: 0 0 0 1000px var(--surface) inset !important;
  -webkit-text-fill-color: var(--dark) !important;
}
.lease-management-root .contact-map {
  background-color: var(--surface) !important;
}
/* Panels / mocks: preflight or UA must not read as printer-white */
.lease-management-root .pain-card:hover {
  background-color: var(--surface) !important;
}
.lease-management-root .pain-card,
.lease-management-root .uc-card,
.lease-management-root .team-panel-screen,
.lease-management-root .usp-panel-card,
.lease-management-root .uc-modal-inner {
  background-color: var(--surface) !important;
}
.lease-management-root .uc-modal {
  position: fixed !important;
  z-index: 10100 !important;
}
.lease-management-root .uc-modal-inner {
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
  -webkit-overflow-scrolling: touch !important;
  max-height: 88vh !important;
}
.lease-management-root .team-panel-screen {
  border: 1px solid rgba(196, 184, 157, 0.42) !important;
  border-radius: 20px !important;
  box-shadow: none !important;
  overflow: hidden !important;
}
.lease-management-root .team-panel.active {
  align-items: stretch !important;
}
.lease-management-root .team-panel.active > div {
  height: 100%;
}
.lease-management-root .team-panel.active > .team-panel-screen {
  height: auto !important;
  align-self: start !important;
}
.lease-management-root .usp-panel-card,
.lease-management-root .mock-kpi,
.lease-management-root .mock-list-item,
.lease-management-root .mock-kanban-card,
.lease-management-root .wt-screen,
.lease-management-root .uc-modal-stat {
  background-color: var(--surface) !important;
}
.lease-management-root .team-panel-screen .mock-kpi,
.lease-management-root .team-panel-screen .mock-list-item,
.lease-management-root .team-panel-screen .mock-kanban-card {
  background-color: var(--cream, #F6F4EE) !important;
  border-color: rgba(196, 184, 157, 0.4) !important;
}
`

export default function LeaseManagementLandingPage() {
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
        const res = await fetch('/lease-management.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /lease-management.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/lease-management.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${LEASE_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Lease Management content')
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

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal on scroll
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
        }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    root.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

    // Countdown
    function animateCounter(el: Element) {
      const ht = el as HTMLElement
      const target = Number.parseInt(ht.dataset.target || '', 10)
      const suffix = ht.dataset.suffix || ''
      if (!Number.isFinite(target)) return
      let current = 0
      const increment = target / 60
      const timer = window.setInterval(() => {
        current = Math.min(current + increment, target)
        ht.textContent = `${Math.floor(current)}${suffix}`
        if (current >= target) window.clearInterval(timer)
      }, 16)
    }
    const countdown = root.querySelector('.hero-countdown')
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).querySelectorAll('[data-target]').forEach(animateCounter)
            counterObserver.unobserve(e.target)
          }
        })
      },
      { threshold: 0.5 },
    )
    if (countdown) counterObserver.observe(countdown)

    // Use-case modals: move all modals to document.body so they are never
    // clipped by GSAP's will-change:transform on the pin container.
    // Apply overflow styles directly (inline) because isolation CSS selectors
    // no longer match after the elements are moved outside .lease-management-root.
    root.querySelectorAll<HTMLElement>('.uc-modal').forEach((m) => {
      if (m.parentElement !== document.body) document.body.appendChild(m)
      const inner = m.querySelector<HTMLElement>('.uc-modal-inner')
      if (inner) {
        inner.style.overflowY = 'auto'
        inner.style.overflowX = 'hidden'
        inner.style.maxHeight = '88vh'
        inner.style.overscrollBehavior = 'contain'
        ;(inner.style as CSSStyleDeclaration & { webkitOverflowScrolling: string }).webkitOverflowScrolling = 'touch'
      }
    })

    // Use-case modals (HTML uses onclick="openUCModal('...')".)
    ;(window as unknown as { openUCModal: (id: string) => void }).openUCModal = (id: string) => {
      const modal = document.getElementById('modal-' + id)
      if (modal) {
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
        lenisScroll.stop()
      }
    }
    ;(window as unknown as { closeUCModal: (id: string) => void }).closeUCModal = (id: string) => {
      const modal = document.getElementById('modal-' + id)
      if (modal) {
        modal.classList.remove('open')
        document.body.style.overflow = ''
        lenisScroll.start()
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.querySelectorAll<HTMLElement>('.uc-modal.open').forEach((m) => m.classList.remove('open'))
        document.body.style.overflow = ''
        lenisScroll.start()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    const cleanups: Array<() => void> = []

    // Role switcher (Lessee / Lessor)
    root.querySelectorAll<HTMLButtonElement>('.role-btn').forEach((btn) => {
      const handler = () => {
        const role = btn.dataset.role
        if (!role) return
        root.querySelectorAll('.role-btn').forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        root.querySelectorAll<HTMLElement>('[data-role-layout]').forEach((layout) => {
          layout.style.display = layout.dataset.roleLayout === role ? 'grid' : 'none'
        })
      }
      btn.addEventListener('click', handler)
      cleanups.push(() => btn.removeEventListener('click', handler))
    })

    // USP tabs — scoped to each [data-role-layout] block
    root.querySelectorAll<HTMLElement>('.usp-tab').forEach((tab) => {
      const handler = () => {
        const panelId = tab.dataset.panel
        const layout = tab.closest<HTMLElement>('[data-role-layout]')
        if (!panelId || !layout) return
        layout.querySelectorAll('.usp-tab').forEach((t) => t.classList.remove('active'))
        layout.querySelectorAll('.usp-panel').forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        const panel = root.querySelector<HTMLElement>('#' + CSS.escape(panelId))
        panel?.classList.add('active')
        layout.querySelectorAll<HTMLElement>('.mock-progress-fill').forEach((bar) => {
          const w = bar.style.width
          bar.style.width = '0'
          window.setTimeout(() => {
            bar.style.width = w
          }, 50)
        })
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    // Walkthrough tabs
    root.querySelectorAll<HTMLElement>('.wt-tab').forEach((tab) => {
      const handler = () => {
        const panelId = tab.dataset.wt
        if (!panelId) return
        root.querySelectorAll('.wt-tab').forEach((t) => t.classList.remove('active'))
        root.querySelectorAll('.wt-panel').forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        root.querySelector<HTMLElement>('#' + CSS.escape(panelId))?.classList.add('active')
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    // Team tabs
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.team-panel'))
    const switchTeam = (panelId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => t.classList.remove('active'))
      teamPanels.forEach((p) => p.classList.remove('active'))
      tabEl?.classList.add('active')
      root.querySelector<HTMLElement>('#' + CSS.escape(panelId))?.classList.add('active')
    }

    teamTabs.forEach((tab) => {
      const handler = () => {
        const panelId = tab.dataset.team
        if (!panelId) return
        switchTeam(panelId, tab)
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    const teamIds = teamTabs.map((t) => t.dataset.team || '').filter(Boolean)
    const teamsStoryTrigger = initLeaseTeamsGsap(root, { teamTabs, teamIds, switchTeam })
    // Route wheel deltas to .team-info / .team-visual / .teams-tabs when cursor
    // is over them so users can read full inner content before Lenis advances
    // the pinned story (parity with PATM / Snag360 / Post Sales / etc.).
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)
    requestAnimationFrame(() => {
      lenisScroll.resize()
      ScrollTrigger.refresh()
    })

    // In-page anchor links (smooth scroll within app shell, with fixed-nav offset)
    const anchorAbort = new AbortController()
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const onClick = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href || href === '#') return
        const target = root.querySelector<HTMLElement>(href)
        if (!target) return
        e.preventDefault()
        const top = target.getBoundingClientRect().top + window.scrollY - LEASE_NAV_OFFSET_PX - 4
        scrollDocumentToY(lenisScroll.instance, top)
      }
      a.addEventListener('click', onClick, { signal: anchorAbort.signal })
    })

    return () => {
      cleanups.forEach((fn) => fn())
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      revealObserver.disconnect()
      counterObserver.disconnect()
      anchorAbort.abort()
      teamsStoryTrigger?.kill(true)
      innerScrollCleanup()
      lenisScroll.destroy()
      delete (window as unknown as { openUCModal?: unknown }).openUCModal
      delete (window as unknown as { closeUCModal?: unknown }).closeUCModal
      // Remove modals that were moved to document.body
      document.querySelectorAll<HTMLElement>('.uc-modal').forEach((m) => m.remove())
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="lease-management-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Lease Management error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}
