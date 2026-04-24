/**
 * While the pointer is over long tab copy (`.team-info`, `.wt-info`), route wheel
 * deltas to that element first so users can read full content before Lenis advances
 * the pinned team/walkthrough story.
 */
export function attachTeamStoryInnerScroll(root: HTMLElement): () => void {
  const selectors = ['.team-info', '.wt-info', '.feature-info']

  const findScrollHost = (target: EventTarget | null): HTMLElement | null => {
    let el = target instanceof Element ? (target as Element) : null
    while (el && el !== root) {
      if (el instanceof HTMLElement) {
        for (const sel of selectors) {
          if (el.matches(sel)) return el
        }
      }
      el = el.parentElement
    }
    return null
  }

  const onWheel = (e: WheelEvent) => {
    const host = findScrollHost(e.target)
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
