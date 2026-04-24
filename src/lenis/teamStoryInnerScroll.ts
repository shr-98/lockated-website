/**
 * While the pointer is over a scrollport (`.teams-main`, `.team-info`, `.wt-info`), route
 * wheel deltas to that element first so users can read full content before Lenis advances
 * the pinned team / walkthrough. Prefer `.teams-main` when it overflows (inner scroller
 * for tab + copy + mock).
 */
export function attachTeamStoryInnerScroll(root: HTMLElement): () => void {
  const leafSelectors = ['.team-info', '.team-panel-info', '.wt-info', '.feature-info']

  const getTeamsMain = (t: EventTarget | null): HTMLElement | null => {
    const el = t instanceof Element ? t : null
    if (!el) return null
    const m = el.closest('.teams-main')
    return m && root.contains(m) ? (m as HTMLElement) : null
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
