/**
 * While the pointer is over a scrollport (`.team-info`, `.team-visual`, `.teams-main`, `.teams-tabs`, `.wt-info`, …
 * ) route wheel deltas to that element first so users can read full content before Lenis advances
 * the pinned team / walkthrough. Order: `.team-info` → `.team-visual` → `.teams-main` → `.teams-tabs` (tab rail) →
 * `#teamsStoryPin` when overflow-y auto, then other leaf hosts.
 */
export function attachTeamStoryInnerScroll(root: HTMLElement): () => void {
  const leafSelectors = ['.team-info', '.team-panel-info', '.wt-info', '.feature-info']

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

  /** Left tab rail (e.g. PATM): scroll before Lenis or last tabs look “cut off”. */
  const getTeamsTabs = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t : null
    if (!el) return null
    const r = el.closest('.teams-tabs')
    return r && root.contains(r) ? (r as HTMLElement) : null
  }

  /** Pages without `.teams-main` (e.g. PATM) scroll the whole pin (`#teamsStoryPin`) when it has overflow-y: auto. */
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
    let el = target instanceof Element ? (target as Element) : null
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

  /* Edge-lock: when a scrollport is actively consuming wheel deltas, we keep
     absorbing inertial/momentum deltas for a brief grace period AFTER it
     reaches an edge — so trackpad fling doesn't immediately advance the
     pinned story to the next tab while the user is still reading. The lock
     resets the moment the user pauses (no wheel event for ~180ms). */
  const EDGE_LOCK_MS = 380
  const PAUSE_MS = 180
  let lockedHost: HTMLElement | null = null
  let lastWheelAt = 0
  let lockUntil = 0

  /** Try to consume a wheel delta on `host`. Returns true if the wheel event
   * should be absorbed (preventDefault'd) — either because the host scrolled,
   * or because the edge-lock is still active. Returns false to let outer
   * (Lenis / pin) handle it. */
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
      lockedHost === host && now - lastWheelAt < PAUSE_MS && now < lockUntil

    if ((down && !atBottom) || (up && !atTop)) {
      e.preventDefault()
      e.stopPropagation()
      host.scrollTop += delta
      lockedHost = host
      lastWheelAt = now
      lockUntil = now + EDGE_LOCK_MS
      return true
    }
    // At an edge in the direction of motion — only absorb if still engaged
    // (i.e. trackpad momentum from a recent in-port scroll). Otherwise let
    // Lenis advance.
    if (stillEngaged) {
      e.preventDefault()
      e.stopPropagation()
      lastWheelAt = now
      return true
    }
    // User has paused or wheeled fresh at the edge → release.
    if (lockedHost === host) lockedHost = null
    return false
  }

  const onWheel = (e: WheelEvent) => {
    // Industry / use-case modals (Snag 360, Post Possession, etc.): use native
    // scrolling inside `.modal-body` / `.modal-inner` — do not route wheel to Lenis targets.
    const t = e.target
    if (t instanceof Element && t.closest('.usecase-modal.open')) {
      return
    }

    const teamInfo = getTeamInfo(e.target)
    if (teamInfo) {
      consume(teamInfo, e)
      return
    }

    const teamVisual = getTeamVisual(e.target)
    if (teamVisual) {
      consume(teamVisual, e)
      return
    }

    const main = getTeamsMain(e.target)
    if (main) {
      consume(main, e)
      return
    }

    const tabRail = getTeamsTabs(e.target)
    if (tabRail) {
      consume(tabRail, e)
      return
    }

    const storyPin = getTeamsStoryPin(e.target)
    if (storyPin) {
      consume(storyPin, e)
      return
    }

    const host = findLeafScrollHost(e.target)
    if (!host) return
    consume(host, e)
  }

  root.addEventListener('wheel', onWheel, { passive: false, capture: true })
  return () => root.removeEventListener('wheel', onWheel, { capture: true })
}
