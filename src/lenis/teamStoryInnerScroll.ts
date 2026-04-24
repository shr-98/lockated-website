/**
 * While the pointer is over a scrollport (`.team-info`, `.teams-main`, `.wt-info`), route
 * wheel deltas to that element first so users can read full content before Lenis advances
 * the pinned team / walkthrough. If `.team-info` can scroll, use it first; then `.teams-main`;
 * then `#teamsStoryPin` when it uses overflow-y auto (e.g. PATM, no `.teams-main`).
 */
export function attachTeamStoryInnerScroll(root: HTMLElement): () => void {
  const leafSelectors = ['.team-info', '.team-panel-info', '.wt-info', '.feature-info']

  const getTeamInfo = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t.closest('.team-info') : null
    return el && root.contains(el) ? (el as HTMLElement) : null
  }

  const getTeamsMain = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t : null
    if (!el) return null
    const m = el.closest('.teams-main')
    return m && root.contains(m) ? (m as HTMLElement) : null
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

  const onWheel = (e: WheelEvent) => {
    const teamInfo = getTeamInfo(e.target)
    if (teamInfo) {
      const { scrollTop, scrollHeight, clientHeight } = teamInfo
      if (scrollHeight > clientHeight + 2) {
        const delta = e.deltaY
        const atTop = scrollTop <= 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2
        const down = delta > 0
        const up = delta < 0
        if ((down && !atBottom) || (up && !atTop)) {
          e.preventDefault()
          teamInfo.scrollTop += delta
        }
        return
      }
    }

    const main = getTeamsMain(e.target)
    if (main) {
      const { scrollTop, scrollHeight, clientHeight } = main
      if (scrollHeight > clientHeight + 2) {
        const delta = e.deltaY
        const atTop = scrollTop <= 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2
        const down = delta > 0
        const up = delta < 0
        if ((down && !atBottom) || (up && !atTop)) {
          e.preventDefault()
          main.scrollTop += delta
        }
        return
      }
    }

    const storyPin = getTeamsStoryPin(e.target)
    if (storyPin) {
      const { scrollTop, scrollHeight, clientHeight } = storyPin
      if (scrollHeight > clientHeight + 2) {
        const delta = e.deltaY
        const atTop = scrollTop <= 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2
        const down = delta > 0
        const up = delta < 0
        if ((down && !atBottom) || (up && !atTop)) {
          e.preventDefault()
          storyPin.scrollTop += delta
        }
        return
      }
    }

    const host = findLeafScrollHost(e.target)
    if (!host) return
    const { scrollTop, scrollHeight, clientHeight } = host
    if (scrollHeight <= clientHeight + 2) return
    const delta = e.deltaY
    const atTop = scrollTop <= 0
    const atBottom = scrollTop + clientHeight >= scrollHeight - 2
    const down = delta > 0
    const up = delta < 0
    if ((down && !atBottom) || (up && !atTop)) {
      e.preventDefault()
      host.scrollTop += delta
    }
  }

  root.addEventListener('wheel', onWheel, { passive: false, capture: true })
  return () => root.removeEventListener('wheel', onWheel, { capture: true })
}
