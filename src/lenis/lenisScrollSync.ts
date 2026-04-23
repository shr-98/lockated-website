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
