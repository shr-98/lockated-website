/**
 * While the pointer is over a scrollport (`.team-info`, `.team-visual`, `.teams-main`, `.teams-tabs`, `.wt-info`, …
 * ) route wheel deltas to that element first so users can read full content before Lenis advances
 * the pinned team / walkthrough. Order: `.team-info` → `.team-visual` → `.teams-main` → `.teams-tabs` (tab rail) →
 * `#teamsStoryPin` when overflow-y auto, then other leaf hosts.
 */
export function attachTeamStoryInnerScroll(root: HTMLElement): () => void {
  const leafSelectors = [
    '.team-info',
    '.team-panel-info',
    '.team-panel-screen',
    '.wt-info',
    '.feature-info',
    // Lease/FmMatrix/Vendor: panel children have no class — match by structural selector.
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

    /* Build an ordered list of candidate scroll hosts under the pointer, from
     * most-specific (column the cursor is actually over) to least-specific
     * (outer wrappers). `consume()` returns false when the host can't actually
     * scroll (e.g. wrapper with overflow: hidden, or content fits) — in that
     * case we fall through to the next candidate so we never "trap" wheel on
     * a non-scrollable ancestor like `.teams-main`. This is what lets each of
     * the three columns (tabs / team-info / team-visual) scroll cleanly when
     * the cursor is over it, regardless of nesting order. */
    const candidates: HTMLElement[] = []
    const push = (el: HTMLElement | null) => {
      if (el && !candidates.includes(el)) candidates.push(el)
    }

    push(getTeamInfo(e.target))
    push(getTeamVisual(e.target))
    push(getTeamsTabs(e.target))
    push(getTeamsMain(e.target))
    push(getTeamsStoryPin(e.target))
    push(findLeafScrollHost(e.target))

    for (const host of candidates) {
      if (consume(host, e)) return
    }
  }

  root.addEventListener('wheel', onWheel, { passive: false, capture: true })
  return () => root.removeEventListener('wheel', onWheel, { capture: true })
}
