import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import 'lenis/dist/lenis.css'

const DEFAULT_SCROLL_DURATION = 0.7
const LAG_SMOOTHING = [500, 33] as const

/**
 * Lenis + GSAP ScrollTrigger (official pattern) for smooth inertial scroll that stays
 * in sync with pins. Call `createLenisScrollSync()` once per route; `destroy()` in
 * the same effect’s cleanup. Skipped when `prefers-reduced-motion: reduce`.
 */
export function createLenisScrollSync(): {
  instance: Lenis | null
  resize: () => void
  stop: () => void
  start: () => void
  destroy: () => void
} {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      instance: null,
      resize: () => {},
      stop: () => {},
      start: () => {},
      destroy: () => {},
    }
  }
  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    /* When the cursor is over an inner scrollport that still has overflow
     * (team-use-case columns: tab rail, copy column, visual mock card,
     * walkthrough info panes), Lenis must NOT also consume the wheel — that
     * caused the pin to advance simultaneously with the inner column,
     * producing the "center div doesn't scroll properly" jitter on
     * Snag 360 / PATM / etc. The shared `attachTeamStoryInnerScroll`
     * handler on the page root then drives the inner scrollTop directly. At
     * column edge the inner host is no longer scrollable in the wheel
     * direction, so this returns false and Lenis advances the pin. */
    prevent: (node) => {
      if (!(node instanceof Element)) return false
      const sel =
        '.uc-modal-inner, .modal-inner, .modal-box, .team-info, .team-visual, .teams-tabs, .team-panel-info, .team-panel-screen, .wt-info, .feature-info'
      let el: Element | null = node
      while (el) {
        if (el instanceof HTMLElement && el.matches(sel)) {
          const cs = getComputedStyle(el)
          const oy = cs.overflowY
          if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') {
            if (el.scrollHeight > el.clientHeight + 2) return true
          }
        }
        el = el.parentElement
      }
      return false
    },
  })
  const onTick = (time: number) => {
    lenis.raf(time * 1000)
  }
  const offScroll = lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)
  return {
    instance: lenis,
    resize: () => {
      lenis.resize()
    },
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    destroy: () => {
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(LAG_SMOOTHING[0], LAG_SMOOTHING[1])
      offScroll()
      lenis.destroy()
    },
  }
}

export function scrollDocumentToY(
  instance: Lenis | null,
  y: number,
  duration = DEFAULT_SCROLL_DURATION,
) {
  const top = Math.max(0, y)
  if (instance) {
    instance.scrollTo(top, { duration })
  } else {
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
