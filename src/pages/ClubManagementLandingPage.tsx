import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/** Fixed nav — pin start + scroll padding (match PATM / Vendor). */
const CLUB_NAV_OFFSET_PX = 68
const TEAM_STORY_SCROLL_PER_TAB_VH = 1.2

/** Scoped only inside the Club route — avoids wiping blur/filters for the rest of the app. */
const CLUB_MGMT_NO_BLUR_CSS = `
.club-mgmt-root,
.club-mgmt-root *::before,
.club-mgmt-root *::after {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
.club-mgmt-root * {
  filter: none !important;
}
.club-mgmt-root .img-icon-uc {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3)) !important;
}
.club-mgmt-root .usecase-modal {
  -webkit-backdrop-filter: blur(8px) !important;
  backdrop-filter: blur(8px) !important;
}
`

const CLUB_MANAGEMENT_ISOLATION_CSS = `
.club-mgmt-root {
  position: relative;
  isolation: isolate;
}
html:has(.club-mgmt-root) {
  scroll-padding-top: ${CLUB_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.club-mgmt-root section[id],
.club-mgmt-root .teams-section#teams {
  scroll-margin-top: ${CLUB_NAV_OFFSET_PX + 4}px;
}
.club-mgmt-root #navbar {
  z-index: 10050;
}
.club-mgmt-root #teamsStoryPin {
  z-index: 1 !important;
  background: var(--cream, #F6F4EE) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
  min-height: 0 !important;
  max-height: calc(100dvh - ${CLUB_NAV_OFFSET_PX}px) !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
.club-mgmt-root #teamsStoryPin .teams-header {
  flex: 0 0 auto !important;
}
.club-mgmt-root #teamsStoryPin .teams-main {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  -webkit-overflow-scrolling: touch !important;
  padding-bottom: 32px !important;
  scroll-padding-bottom: 24px !important;
}
.club-mgmt-root #teamsStoryPin .teams-story-progress {
  flex: 0 0 auto !important;
}
/* No GSAP pin below 768px — undo viewport cap + inner scroll. */
@media (max-width: 767px) {
  .club-mgmt-root #teamsStoryPin {
    max-height: none !important;
    display: block !important;
    overflow: visible !important;
  }
  .club-mgmt-root #teamsStoryPin .teams-main {
    flex: none !important;
    overflow: visible !important;
    padding-bottom: 0 !important;
  }
}
.club-mgmt-root .team-content.active > .team-info {
  height: auto !important;
  min-width: 0;
}
.club-mgmt-root .pin-spacer {
  background: var(--cream, #F6F4EE) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.club-mgmt-root .team-content.active {
  align-items: start !important;
}
.club-mgmt-root .team-content.active > .team-visual {
  height: auto !important;
  align-self: start !important;
  justify-self: end !important;
  width: 100% !important;
  max-width: min(100%, var(--team-visual-max-w, 380px)) !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}
.club-mgmt-root .team-content.active .team-visual-body {
  flex: 0 0 auto !important;
}
@media (max-width: 900px) {
  .club-mgmt-root .team-content.active > .team-visual {
    justify-self: center !important;
  }
}
.club-mgmt-root,
.club-mgmt-root * {
  color-scheme: only light !important;
}
.club-mgmt-root h1,
.club-mgmt-root h2,
.club-mgmt-root h3,
.club-mgmt-root h4,
.club-mgmt-root h5,
.club-mgmt-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.club-mgmt-root nav {
  background: rgba(246, 244, 238, 0.92) !important;
}
.club-mgmt-root nav.scrolled {
  background: rgba(246, 244, 238, 0.97) !important;
}
.club-mgmt-root .hero,
.club-mgmt-root .walkthrough-section,
.club-mgmt-root .teams-section,
.club-mgmt-root .usps-section,
.club-mgmt-root .contact-section,
.club-mgmt-root footer {
  background-color: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .section#pain {
  background-color: var(--surface, #F0EAE1) !important;
}
.club-mgmt-root .usecases-section {
  background-color: var(--band, #E8E2D6) !important;
}
.club-mgmt-root #end-banner {
  background-color: var(--band, #E8E2D6) !important;
}
.club-mgmt-root .usp-visual {
  background-color: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .usp-visual-header {
  background: rgba(240, 234, 225, 0.92) !important;
}
.club-mgmt-root .screen-fnb,
.club-mgmt-root .screen-loyalty {
  background: rgba(240, 234, 225, 0.96) !important;
}
.club-mgmt-root .feature-screen {
  background-color: var(--surface, #F0EAE1) !important;
}
.club-mgmt-root .feature-screen-header {
  background: rgba(240, 234, 225, 0.88) !important;
}
.club-mgmt-root .feature-screen-body {
  background-color: var(--cream, #F6F4EE) !important;
}
/* Team mock: vendor-management .wt-ui-card */
.club-mgmt-root .team-visual {
  background-color: var(--surface, #F0EAE1) !important;
  border: 1px solid #c4b89d !important;
  box-shadow: 0 16px 48px rgba(44, 44, 44, 0.1) !important;
}
.club-mgmt-root .team-visual-header {
  background: var(--cream, #F6F4EE) !important;
  border-bottom: 1px solid #c4bcad !important;
}
.club-mgmt-root .team-visual-body {
  background: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .hero-float-card {
  background: rgba(240, 234, 225, 0.88) !important;
}
.club-mgmt-root .modal-inner-uc {
  background-color: var(--surface, #F0EAE1) !important;
}
.club-mgmt-root .modal-close-uc {
  background: rgba(240, 234, 225, 0.96) !important;
}
.club-mgmt-root .modal-close-uc:hover {
  background-color: var(--surface, #F0EAE1) !important;
}
.club-mgmt-root button.feature-tab {
  background-color: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .feature-tabs {
  background-color: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .teams-tabs {
  background: transparent !important;
}
.club-mgmt-root .teams-layout button.team-tab {
  color: var(--dark, #2c2c2c) !important;
  border: 1.5px solid transparent !important;
  background-image: none !important;
}
.club-mgmt-root .teams-layout button.team-tab:not(.active) {
  background: var(--surface, #f0eae1) !important;
}
.club-mgmt-root .teams-layout button.team-tab.active {
  background: rgba(218, 119, 86, 0.05) !important;
  border-color: var(--primary, #da7756) !important;
}
.club-mgmt-root .teams-layout .team-tab-text {
  color: rgba(44, 44, 44, 0.6) !important;
}
.club-mgmt-root .teams-layout .team-tab.active .team-tab-text {
  color: var(--dark, #2c2c2c) !important;
}
.club-mgmt-root .teams-layout .team-tab-icon {
  background: var(--cream, #f6f4ee) !important;
  border: 1px solid rgba(196, 184, 157, 0.45) !important;
}
.club-mgmt-root .teams-layout .team-tab.active .team-tab-icon {
  background: var(--primary, #da7756) !important;
  border-color: var(--primary, #da7756) !important;
}
.club-mgmt-root .teams-layout .team-tab.active .team-tab-icon svg {
  color: var(--on-primary, #f6f4ee) !important;
  stroke: currentColor !important;
}
.club-mgmt-root .teams-layout .team-tab-icon svg {
  color: rgba(44, 44, 44, 0.5) !important;
  stroke: currentColor !important;
}
.club-mgmt-root .btn-primary,
.club-mgmt-root .btn-hero-primary,
.club-mgmt-root .form-submit,
.club-mgmt-root .cp-invite-btn {
  color: var(--on-primary, #F6F4EE) !important;
}
.club-mgmt-root .form-input,
.club-mgmt-root .form-select,
.club-mgmt-root textarea.form-input {
  background-color: var(--surface, #F0EAE1) !important;
}
.club-mgmt-root .form-input:focus,
.club-mgmt-root textarea.form-input:focus {
  background-color: var(--surface, #F0EAE1) !important;
}
.club-mgmt-root .form-input:-webkit-autofill,
.club-mgmt-root .form-input:-webkit-autofill:hover,
.club-mgmt-root .form-input:-webkit-autofill:focus,
.club-mgmt-root .form-select:-webkit-autofill,
.club-mgmt-root .form-select:-webkit-autofill:hover,
.club-mgmt-root .form-select:-webkit-autofill:focus,
.club-mgmt-root textarea.form-input:-webkit-autofill,
.club-mgmt-root textarea.form-input:-webkit-autofill:hover,
.club-mgmt-root textarea.form-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface, #F0EAE1) inset !important;
  box-shadow: 0 0 0 1000px var(--surface, #F0EAE1) inset !important;
  -webkit-text-fill-color: var(--dark, #2C2C2C) !important;
}
.club-mgmt-root .pain-card {
  background-color: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .usecase-card {
  background-color: var(--cream, #F6F4EE) !important;
}
.club-mgmt-root .teams-section .team-info {
  max-height: none !important;
  overflow: visible !important;
}
.club-mgmt-root #walkthrough .feature-info {
  max-height: min(72vh, calc(100vh - 200px));
  overflow-y: auto;
  overscroll-behavior: contain;
}
`

type ClubTeamStoryGsapOpts = {
  teamTabs: HTMLElement[]
  teamIds: string[]
  switchTeam: (teamId: string, tabEl?: HTMLElement) => void
}

/** Pin “Built for every role” and advance tabs from scroll (desktop; reduced-motion / narrow: click only). */
function initClubTeamStoryGsap(
  root: HTMLElement,
  opts: ClubTeamStoryGsapOpts,
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
    id: 'club-teams-use-cases',
    trigger: pin,
    start: `top ${CLUB_NAV_OFFSET_PX}px`,
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

export default function ClubManagementLandingPage() {
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
        const res = await fetch('/club-management.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /club-management.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/club-management.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${CLUB_MGMT_NO_BLUR_CSS}\n${CLUB_MANAGEMENT_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Club Management content')
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

    const lenisScroll = createLenisScrollSync()
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)

    // NAVBAR SCROLL
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // HERO ANIMATIONS + COUNTERS
    const timers: number[] = []
    const setLater = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms))
    }

    const startCounters = () => {
      root.querySelectorAll<HTMLElement>('.count-up').forEach((el) => {
        const target = Number.parseInt(el.dataset.target || '0', 10)
        if (!Number.isFinite(target) || target <= 0) return
        let current = 0
        const increment = target / 50
        const id = window.setInterval(() => {
          current = Math.min(current + increment, target)
          el.textContent = String(Math.floor(current))
          if (current >= target) window.clearInterval(id)
        }, 35)
        timers.push(id)
      })
    }

    setLater(() => {
      root.querySelector<HTMLElement>('#hero-eyebrow')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
    }, 100)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-headline')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
    }, 300)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-sub')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
    }, 500)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-ctas')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
      const heroSubtext = root.querySelector<HTMLElement>('#hero-subtext')
      if (heroSubtext) heroSubtext.style.opacity = '1'
    }, 700)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-counters')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
      startCounters()
    }, 900)

    setLater(() => {
      root.querySelectorAll<HTMLElement>('.hero-float-card').forEach((c, i) => {
        setLater(() => c.classList.add('shown'), i * 250)
      })
    }, 1100)

    // SCROLL REVEAL
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('in-view')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    revealEls.forEach((el) => observer.observe(el))

    // USP ACCORDION
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    const uspHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    uspItems.forEach((item) => {
      const fn = () => {
        const screenId = item.dataset.screen
        uspItems.forEach((i) => i.classList.remove('active'))
        uspScreens.forEach((s) => s.classList.remove('visible'))
        item.classList.add('active')
        if (screenId) root.querySelector<HTMLElement>(`#${CSS.escape(screenId)}`)?.classList.add('visible')
      }
      item.addEventListener('click', fn)
      uspHandlers.push({ el: item, fn })
    })

    // FEATURE TABS
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    const featureHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    featureTabs.forEach((tab) => {
      const fn = () => {
        const panelId = tab.dataset.panel
        featureTabs.forEach((t) => t.classList.remove('active'))
        featurePanels.forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        if (!panelId) return
        const panel = root.querySelector<HTMLElement>(`#${CSS.escape(panelId)}`)
        if (!panel) return
        panel.classList.add('active')
        panel.style.animation = 'none'
        // force reflow to restart animation
        void panel.offsetHeight
        panel.style.animation = 'panelSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards'
      }
      tab.addEventListener('click', fn)
      featureHandlers.push({ el: tab, fn })
    })

    // USE CASE MODALS (must be global for inline onclick)
    const openUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (!modal) return
      modal.classList.add('open')
      document.body.style.overflow = 'hidden'
      lenisScroll.stop()
    }
    const closeUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (!modal) return
      modal.classList.remove('open')
      document.body.style.overflow = ''
      lenisScroll.start()
    }
    ;(window as any).openUCModal = openUCModal
    ;(window as any).closeUCModal = closeUCModal

    const modals = Array.from(root.querySelectorAll<HTMLElement>('.usecase-modal'))
    const modalHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    modals.forEach((modal) => {
      const fn = (e: Event) => {
        if (e.target === modal) {
          modal.classList.remove('open')
          document.body.style.overflow = ''
          lenisScroll.start()
        }
      }
      modal.addEventListener('click', fn)
      modalHandlers.push({ el: modal, fn })
    })
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      modals.forEach((m) => {
        if (m.classList.contains('open')) {
          m.classList.remove('open')
          document.body.style.overflow = ''
          lenisScroll.start()
        }
      })
    }
    document.addEventListener('keydown', onKeyDown)

    // TEAM TABS — scroll-pinned “Built for every role” (GSAP; same as PATM / Vendor)
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.teams-tabs .team-tab'))
    const teamContents = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const switchTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => {
        t.classList.remove('active')
        t.setAttribute('aria-selected', 'false')
      })
      teamContents.forEach((c) => c.classList.remove('active'))
      const tab = tabEl ?? teamTabs.find((t) => t.dataset.team === teamId)
      tab?.classList.add('active')
      tab?.setAttribute('aria-selected', 'true')
      const content = teamContents.find((c) => c.dataset.content === teamId)
      if (content) {
        content.classList.add('active')
        content.style.animation = 'none'
        void content.offsetHeight
        content.style.animation = 'panelSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards'
      }
    }
    const teamIds = teamTabs.map((t) => t.dataset.team).filter(Boolean) as string[]
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
      teamStorySt = initClubTeamStoryGsap(root, { teamTabs, teamIds, switchTeam })
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
    const onTeamResize = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeTimer = undefined
        refreshTeamScroll()
      }, 100)
    }
    window.addEventListener('resize', onTeamResize, { passive: true })

    // Panel slide animation + small hover fix
    const animStyle = document.createElement('style')
    animStyle.textContent = `
@keyframes panelSlideIn { from { opacity:0; transform: translateY(24px);} to { opacity:1; transform: translateY(0);} }
.club-mgmt-root .feature-panel.active { animation: panelSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
.btn-hero-primary:hover::before { opacity: 1 !important; }
`
    document.head.appendChild(animStyle)

    return () => {
      gsapCtx.revert()
      innerScrollCleanup()
      lenisScroll.destroy()
      clearTimeout(lateLayout)
      window.removeEventListener('load', onLayoutRefresh)
      window.removeEventListener('resize', onTeamResize)
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)

      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
      timers.forEach((t) => {
        // clears both timeouts and intervals safely
        window.clearTimeout(t)
        window.clearInterval(t)
      })
      uspHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      featureHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      document.removeEventListener('keydown', onKeyDown)
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn as EventListener))
      animStyle.remove()
      delete (window as any).openUCModal
      delete (window as any).closeUCModal
      document.body.style.overflow = ''
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="club-mgmt-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Club Management error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}

