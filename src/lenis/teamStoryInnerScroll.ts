import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * While the pointer is over a scrollport (`.team-info`, `.team-visual`, `.teams-main`, `.teams-tabs`, `.wt-info`, …)
 * route wheel deltas to that element first so users can read full content before Lenis advances
 * the pinned team / walkthrough.
 */
export function attachTeamStoryInnerScroll(root: HTMLElement): () => void {
  const leafSelectors = [
    '.team-info',
    '.team-panel-info',
    '.team-panel-screen',
    '.wt-info',
    '.feature-info',
    '.team-panel.active > div',
    '.fm-matrix-teams-panel.active > div',
    '.teams-panel.active > div',
  ]

  const getTeamInfo = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t.closest('.team-info') : null
    return el && root.contains(el) ? (el as HTMLElement) : null
  }

  const getTeamVisual = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t.closest('.team-visual') : null
    return el && root.contains(el) ? (el as HTMLElement) : null
  }

  const getTeamsMain = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t : null
    if (!el) return null
    const m = el.closest('.teams-main')
    return m && root.contains(m) ? (m as HTMLElement) : null
  }

  const getTeamsTabs = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t : null
    if (!el) return null
    const r = el.closest('.teams-tabs')
    return r && root.contains(r) ? (r as HTMLElement) : null
  }

  const getTeamsStoryPin = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t : null
    if (!el) return null

    const p = el.closest('#teamsStoryPin')
    if (!p || !root.contains(p)) return null

    const pin = p as HTMLElement
    const oy = getComputedStyle(pin).overflowY

    if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return null

    return pin
  }

  const findLeafScrollHost = (target: EventTarget | null): HTMLElement | null => {
    let el = target instanceof Element ? target : null

    while (el && el !== root) {
      if (el instanceof HTMLElement) {
        for (const sel of leafSelectors) {
          if (el.matches(sel)) return el
        }
      }
      el = el.parentElement
    }

    return null
  }

  const EDGE_LOCK_MS = 380
  const PAUSE_MS = 180

  let lockedHost: HTMLElement | null = null
  let lastWheelAt = 0
  let lockUntil = 0

  const consume = (host: HTMLElement, e: WheelEvent): boolean => {
    const { scrollTop, scrollHeight, clientHeight } = host

    if (scrollHeight <= clientHeight + 2) return false

    const delta = e.deltaY
    const atTop = scrollTop <= 0
    const atBottom = scrollTop + clientHeight >= scrollHeight - 2
    const down = delta > 0
    const up = delta < 0
    const now = e.timeStamp || performance.now()

    const stillEngaged =
      lockedHost === host &&
      now - lastWheelAt < PAUSE_MS &&
      now < lockUntil

    if ((down && !atBottom) || (up && !atTop)) {
      e.preventDefault()
      e.stopPropagation()

      host.scrollTop += delta

      lockedHost = host
      lastWheelAt = now
      lockUntil = now + EDGE_LOCK_MS

      return true
    }

    if (stillEngaged) {
      e.preventDefault()
      e.stopPropagation()
      lastWheelAt = now
      return true
    }

    if (lockedHost === host) lockedHost = null

    return false
  }

  /** ✅ Dynamic pin detection using ScrollTrigger (works at any zoom %) */
  const isPinActive = (): boolean => {
    const st =
      ScrollTrigger.getById('loyalty-teams-use-cases') ||
      ScrollTrigger.getById('cp-teams-use-cases') ||
      ScrollTrigger.getById('snag-teams-use-cases') ||
      ScrollTrigger.getById('post-possession-teams-use-cases') ||
      ScrollTrigger.getById('teams-use-cases') ||
      ScrollTrigger.getById('post-sales-teams-use-cases') ||
      ScrollTrigger.getById('patm-teams-use-cases') ||
      ScrollTrigger.getById('club-teams-use-cases')
    return !!st?.isActive
  }

  const onWheel = (e: WheelEvent) => {
    const t = e.target

    // Allow native modal scrolling (works for .usecase-modal and .modal-overlay patterns)
    if (t instanceof Element && (t.closest('.usecase-modal.open') || t.closest('.modal-overlay.open'))) return

    const pin = root.querySelector('#teamsStoryPin') as HTMLElement | null
    const pinActive = isPinActive()

    const candidates: HTMLElement[] = []

    const push = (el: HTMLElement | null) => {
      if (el && !candidates.includes(el)) candidates.push(el)
    }

    /**
     * If pinned section is active:
     * route wheel automatically to active inner scroll areas first
     * (works for CP / Snag / Vendor / PATM layouts)
     */
    if (pinActive) {
      // Snag / newer layouts
      push(root.querySelector('.team-content.active .team-info') as HTMLElement)
      push(root.querySelector('.team-content.active .team-visual') as HTMLElement)

      // CP / other layouts
      push(root.querySelector('.teams-panel.active .team-info') as HTMLElement)
      push(root.querySelector('.teams-panel.active .team-visual') as HTMLElement)

      // Generic active panel children
      push(root.querySelector('.active .team-info') as HTMLElement)
      push(root.querySelector('.active .team-visual') as HTMLElement)

      // Rail + wrappers
      push(root.querySelector('.teams-tabs') as HTMLElement)
      push(root.querySelector('.teams-main') as HTMLElement)

      // Final fallback pinned container
      push(pin)
    } else {
      // Normal hover / pointer based routing outside pin state
      push(getTeamInfo(t))
      push(getTeamVisual(t))
      push(getTeamsTabs(t))
      push(getTeamsMain(t))
      push(getTeamsStoryPin(t))
      push(findLeafScrollHost(t))
    }

    for (const host of candidates) {
      if (consume(host, e)) return
    }
  }

  root.addEventListener('wheel', onWheel, {
    passive: false,
    capture: true,
  })

  return () =>
    root.removeEventListener('wheel', onWheel, {
      capture: true,
    })
}