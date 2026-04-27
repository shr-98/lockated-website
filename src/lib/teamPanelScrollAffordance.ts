/**
 * Shared "smart scroll affordance" for landing-page team-use-case sections.
 *
 * Each landing page pins a tabs+panels grid where the active panel's left copy
 * (`.team-info`) and right visual (`.team-visual`) scroll independently inside
 * a viewport-height pin. Without affordance, users do not realise these
 * columns scroll — they assume the pin is "stuck" and bounce off the page.
 *
 * This module renders four reinforcing cues for every active panel:
 *   1. Chunky always-visible orange scrollbar (12px webkit, scrollbar-width: auto)
 *   2. Top + bottom fade gradient overlays that flip on/off as content slides
 *   3. Bouncing "Scroll to read more" pill — auto-hides the moment the user
 *      scrolls 1px (so it never feels naggy)
 *   4. One-time programmatic scrollTop nudge (~28px down then back) when a
 *      tab activates, so the user SEES content move and the scrollbar thumb
 *      travel — strongest possible "this scrolls" signal
 *
 * Each landing page calls `getTeamPanelScrollAffordanceCSS` to embed scoped
 * styles, then `attachTeamPanelScrollAffordance` from inside its main effect
 * to inject overlays + listeners. The `panelSelector` differs per page
 * (e.g. `.team-content`, `.team-panel`, `.teams-panel`) — pass the matching
 * one. Both functions are pure side-effect-free helpers; cleanup function is
 * returned and must be called from the effect's teardown.
 */

export type TeamPanelScrollAffordanceOpts = {
  /** Page root class without the dot, e.g. 'patm-root', 'snag360-root'. */
  rootClass: string
  /** Panel selector class without the dot — class added to the panel that
   * wraps `.team-info` / `.team-visual`. Differs per page. */
  panelClass: string
  /** Optional CSS selector for the pinned wrapper used to scope scrollbar
   * styles. Default `#teamsStoryPin`. */
  pinSelector?: string
  /** Min-width (px) below which inner-scroll is not used and the affordance
   * is hidden. Default 768. */
  minWidthPx?: number
  /** Cream/surface bg color for fade gradient base. Default `#F6F4EE`. */
  fadeBg?: string
  /** Primary brand color for scrollbar thumb + pill. Default `#DA7756`. */
  primary?: string
}

const hexToRgb = (hex: string): string => {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export function getTeamPanelScrollAffordanceCSS(opts: TeamPanelScrollAffordanceOpts): string {
  const root = `.${opts.rootClass}`
  const panel = `.${opts.panelClass}`
  const pin = opts.pinSelector ?? '#teamsStoryPin'
  const minW = opts.minWidthPx ?? 768
  const fade = opts.fadeBg ?? '#F6F4EE'
  const primary = opts.primary ?? '#DA7756'
  const fadeRgb = hexToRgb(fade)
  const primaryRgb = hexToRgb(primary)

  return `
/* ─── Team panel: smart scroll affordance (shared) ─────────────────────── */
@media (min-width: ${minW}px) {
  ${root} ${pin} ${panel}.active {
    position: relative !important;
  }
  ${root} ${pin} ${panel}.active > .team-info,
  ${root} ${pin} ${panel}.active > .team-visual {
    scroll-behavior: smooth !important;
    scrollbar-gutter: stable !important;
    scrollbar-width: auto !important;
    scrollbar-color: rgba(${primaryRgb}, 0.85) rgba(44, 44, 44, 0.08) !important;
  }
  ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar,
  ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
    display: block !important;
    background: rgba(44, 44, 44, 0.06) !important;
  }
  ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar-track,
  ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar-track {
    background: rgba(44, 44, 44, 0.06) !important;
    border-radius: 100px !important;
    margin: 4px 0 !important;
  }
  ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar-thumb,
  ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar-thumb {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 100%),
      ${primary} !important;
    border: 2px solid ${fade} !important;
    border-radius: 100px !important;
    min-height: 36px !important;
    box-shadow: 0 0 0 1px rgba(${primaryRgb}, 0.25) !important;
  }
  ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar-thumb:hover,
  ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar-thumb:hover {
    background: rgba(${primaryRgb}, 1) !important;
    filter: brightness(0.92);
  }
}
${root} ${panel} .lk-scroll-fade,
${root} ${panel} .lk-scroll-hint {
  display: none;
}
${root} ${panel}.active .lk-scroll-fade {
  position: absolute;
  height: 56px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 4;
}
${root} ${panel}.active .lk-scroll-fade--info {
  left: 0;
  width: calc(50% - 14px);
}
${root} ${panel}.active .lk-scroll-fade--visual {
  right: 0;
  width: calc(50% - 14px);
}
${root} ${panel}.active .lk-scroll-fade--bottom {
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(${fadeRgb}, 0) 0%,
    rgba(${fadeRgb}, 0.85) 70%,
    rgba(${fadeRgb}, 1) 100%
  );
}
${root} ${panel}.active .lk-scroll-fade--top {
  top: 0;
  background: linear-gradient(
    to top,
    rgba(${fadeRgb}, 0) 0%,
    rgba(${fadeRgb}, 0.7) 70%,
    rgba(${fadeRgb}, 0.95) 100%
  );
}
${root} ${panel}.active .lk-scroll-fade.is-visible {
  display: block;
  opacity: 1;
}
${root} ${panel}.active .lk-scroll-hint {
  position: absolute;
  bottom: 12px;
  z-index: 5;
  pointer-events: none;
  display: none;
  align-items: center;
  gap: 8px;
  padding: 9px 16px 9px 14px;
  border: 0;
  border-radius: 100px;
  background: ${primary};
  color: #fff;
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow:
    0 12px 28px rgba(${primaryRgb}, 0.42),
    0 2px 0 rgba(0, 0, 0, 0.05),
    0 0 0 4px rgba(${primaryRgb}, 0.14),
    0 1px 0 rgba(255, 255, 255, 0.3) inset;
  opacity: 0;
  transform: translate(-50%, 8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
${root} ${panel}.active .lk-scroll-hint--info  { left: calc(25% - 7px); }
${root} ${panel}.active .lk-scroll-hint--visual { left: calc(75% - 7px); }
${root} ${panel}.active .lk-scroll-hint.is-visible {
  display: inline-flex;
  opacity: 1;
  transform: translate(-50%, 0);
  animation: lkScrollHintBounce 1.4s ease-in-out infinite;
  pointer-events: auto;
  cursor: pointer;
}
${root} ${panel}.active .lk-scroll-hint.is-visible:hover {
  filter: brightness(1.05);
  box-shadow:
    0 14px 32px rgba(${primaryRgb}, 0.5),
    0 2px 0 rgba(0, 0, 0, 0.05),
    0 0 0 5px rgba(${primaryRgb}, 0.18),
    0 1px 0 rgba(255, 255, 255, 0.35) inset;
}
${root} ${panel}.active .lk-scroll-hint.is-visible:active {
  transform: translate(-50%, 2px);
}
${root} ${panel}.active .lk-scroll-hint.is-visible:focus-visible {
  outline: 3px solid rgba(${primaryRgb}, 0.55);
  outline-offset: 3px;
}
${root} ${panel}.active .lk-scroll-hint svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}
@keyframes lkScrollHintBounce {
  0%, 100% { transform: translate(-50%, 0); }
  50%      { transform: translate(-50%, 6px); }
}
@media (prefers-reduced-motion: reduce) {
  ${root} ${panel}.active .lk-scroll-hint.is-visible { animation: none; }
}
/* Tablet (min..1100): only .team-info scrolls; hide visual fade/hint there. */
@media (min-width: ${minW}px) and (max-width: 1100px) {
  ${root} ${panel}.active .lk-scroll-fade--info,
  ${root} ${panel}.active .lk-scroll-hint--info {
    width: 100%;
    left: 50%;
    right: auto;
  }
  ${root} ${panel}.active .lk-scroll-fade--info {
    transform: translateX(-50%);
  }
  ${root} ${panel}.active .lk-scroll-fade--visual,
  ${root} ${panel}.active .lk-scroll-hint--visual {
    display: none !important;
  }
}
/* Mobile (<min): no inner scroll, panels render full height. */
@media (max-width: ${minW - 1}px) {
  ${root} ${panel} .lk-scroll-fade,
  ${root} ${panel} .lk-scroll-hint {
    display: none !important;
  }
}
`
}

const SCROLL_HINT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`

export type AttachOpts = {
  /** Same as CSS opts.panelClass — without dot. */
  panelClass: string
  /** Hint label. Default 'Scroll to read more'. */
  hintLabel?: string
}

type Pieces = {
  panel: HTMLElement
  info: HTMLElement | null
  visual: HTMLElement | null
  infoTopFade: HTMLElement | null
  infoBottomFade: HTMLElement | null
  visualTopFade: HTMLElement | null
  visualBottomFade: HTMLElement | null
  infoHint: HTMLElement | null
  visualHint: HTMLElement | null
  infoUserScrolled: boolean
  visualUserScrolled: boolean
}

/** Animate scrollTop programmatically over `dur` ms — looks like a real scroll
 * to the user (thumb moves, content slides) so it works as an affordance. */
function animateScroll(el: HTMLElement, to: number, dur = 600): Promise<void> {
  return new Promise((resolve) => {
    const start = el.scrollTop
    const delta = to - start
    if (Math.abs(delta) < 1) {
      resolve()
      return
    }
    const t0 = performance.now()
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur)
      el.scrollTop = start + delta * ease(t)
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

export function attachTeamPanelScrollAffordance(
  root: HTMLElement,
  opts: AttachOpts,
): () => void {
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>(`.${opts.panelClass}`),
  )
  if (!panels.length) return () => {}

  const hintLabel = opts.hintLabel ?? 'Scroll to read more'
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const buildAffordance = (
    panel: HTMLElement,
    kind: 'info' | 'visual',
  ): { topFade: HTMLElement; bottomFade: HTMLElement; hint: HTMLButtonElement } => {
    const topFade = document.createElement('div')
    topFade.className = `lk-scroll-fade lk-scroll-fade--top lk-scroll-fade--${kind}`
    const bottomFade = document.createElement('div')
    bottomFade.className = `lk-scroll-fade lk-scroll-fade--bottom lk-scroll-fade--${kind}`
    const hint = document.createElement('button')
    hint.type = 'button'
    hint.className = `lk-scroll-hint lk-scroll-hint--${kind}`
    hint.setAttribute('aria-label', hintLabel)
    hint.innerHTML = `<span>${hintLabel}</span>${SCROLL_HINT_SVG}`
    panel.appendChild(topFade)
    panel.appendChild(bottomFade)
    panel.appendChild(hint)
    return { topFade, bottomFade, hint }
  }

  const all: Pieces[] = panels.map((panel) => {
    const info = panel.querySelector<HTMLElement>(':scope > .team-info')
    const visual = panel.querySelector<HTMLElement>(':scope > .team-visual')
    let infoTopFade: HTMLElement | null = null
    let infoBottomFade: HTMLElement | null = null
    let visualTopFade: HTMLElement | null = null
    let visualBottomFade: HTMLElement | null = null
    let infoHint: HTMLElement | null = null
    let visualHint: HTMLElement | null = null
    if (info) {
      const a = buildAffordance(panel, 'info')
      infoTopFade = a.topFade
      infoBottomFade = a.bottomFade
      infoHint = a.hint
    }
    if (visual) {
      const a = buildAffordance(panel, 'visual')
      visualTopFade = a.topFade
      visualBottomFade = a.bottomFade
      visualHint = a.hint
    }
    return {
      panel,
      info,
      visual,
      infoTopFade,
      infoBottomFade,
      visualTopFade,
      visualBottomFade,
      infoHint,
      visualHint,
      infoUserScrolled: false,
      visualUserScrolled: false,
    }
  })

  const evalPort = (
    port: HTMLElement | null,
    topFade: HTMLElement | null,
    bottomFade: HTMLElement | null,
    hint: HTMLElement | null,
    userScrolled: boolean,
  ) => {
    if (!port) return
    const { scrollTop, scrollHeight, clientHeight } = port
    const overflow = scrollHeight - clientHeight
    const scrollable = overflow > 4
    const moreBelow = scrollable && scrollTop + clientHeight < scrollHeight - 2
    const moreAbove = scrollable && scrollTop > 2
    if (topFade) topFade.classList.toggle('is-visible', moreAbove)
    if (bottomFade) bottomFade.classList.toggle('is-visible', moreBelow)
    if (hint) hint.classList.toggle('is-visible', scrollable && !userScrolled && moreBelow)
  }

  const updateOne = (a: Pieces) => {
    evalPort(a.info, a.infoTopFade, a.infoBottomFade, a.infoHint, a.infoUserScrolled)
    evalPort(a.visual, a.visualTopFade, a.visualBottomFade, a.visualHint, a.visualUserScrolled)
  }
  const updateAll = () => all.forEach(updateOne)

  const cleanups: Array<() => void> = []
  all.forEach((a) => {
    if (a.info) {
      const onScroll = () => {
        if (a.info && a.info.scrollTop > 2) a.infoUserScrolled = true
        updateOne(a)
      }
      a.info.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => a.info?.removeEventListener('scroll', onScroll))
    }
    if (a.visual) {
      const onScroll = () => {
        if (a.visual && a.visual.scrollTop > 2) a.visualUserScrolled = true
        updateOne(a)
      }
      a.visual.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => a.visual?.removeEventListener('scroll', onScroll))
    }
  })

  const ro =
    typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => updateAll()) : null
  if (ro) {
    all.forEach((a) => {
      if (a.info) ro.observe(a.info)
      if (a.visual) ro.observe(a.visual)
    })
  }

  /* Click "Scroll to read more" pill → scroll the matching port down by
     ~80% of its viewport, then mark userScrolled so the pill stops nagging. */
  const onHintClick = (
    a: Pieces,
    which: 'info' | 'visual',
  ) => (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    const port = which === 'info' ? a.info : a.visual
    if (!port) return
    const overflow = port.scrollHeight - port.clientHeight
    if (overflow <= 4) return
    const step = Math.max(120, Math.round(port.clientHeight * 0.8))
    const target = Math.min(port.scrollTop + step, overflow)
    if (which === 'info') a.infoUserScrolled = true
    else a.visualUserScrolled = true
    void animateScroll(port, target, 520).then(() => updateOne(a))
  }
  all.forEach((a) => {
    if (a.info && a.infoHint) {
      const fn = onHintClick(a, 'info')
      a.infoHint.addEventListener('click', fn)
      cleanups.push(() => a.infoHint?.removeEventListener('click', fn))
    }
    if (a.visual && a.visualHint) {
      const fn = onHintClick(a, 'visual')
      a.visualHint.addEventListener('click', fn)
      cleanups.push(() => a.visualHint?.removeEventListener('click', fn))
    }
  })

  /** Scroll-nudge the active panel: down ~28px then back, in user-perceivable
   * motion. Resets `userScrolled` flags first so the programmatic scroll does
   * not trigger the "user has read it" path. */
  const playNudge = async (a: Pieces) => {
    if (reducedMotion) return
    const ports: Array<HTMLElement | null> = [a.info, a.visual]
    for (const port of ports) {
      if (!port) continue
      const overflow = port.scrollHeight - port.clientHeight
      if (overflow <= 4) continue
      // Suppress the userScrolled flag during the programmatic animation.
      const guard = port === a.info ? 'infoUserScrolled' : 'visualUserScrolled'
      a[guard] = false
      const target = Math.min(28, overflow)
      // Tiny delay so the pin settles after the active class flip.
      await new Promise((r) => setTimeout(r, 60))
      await animateScroll(port, target, 480)
      await new Promise((r) => setTimeout(r, 120))
      await animateScroll(port, 0, 420)
      a[guard] = false
      updateOne(a)
    }
  }

  /* When a panel becomes `.active`: reset state, repaint affordance, nudge. */
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.attributeName !== 'class' || !(r.target instanceof HTMLElement)) continue
      const target = r.target
      if (
        target.classList.contains(opts.panelClass) &&
        target.classList.contains('active')
      ) {
        const a = all.find((x) => x.panel === target)
        if (!a) continue
        a.infoUserScrolled = false
        a.visualUserScrolled = false
        if (a.info) a.info.scrollTop = 0
        if (a.visual) a.visual.scrollTop = 0
        updateOne(a)
        void playNudge(a)
      }
    }
  })
  panels.forEach((p) =>
    mo.observe(p, { attributes: true, attributeFilter: ['class'] }),
  )

  /* Initial paint after layout settles + nudge the initially-active panel. */
  const initTimer = window.setTimeout(() => {
    updateAll()
    const initial = all.find((a) => a.panel.classList.contains('active'))
    if (initial) void playNudge(initial)
  }, 240)

  return () => {
    window.clearTimeout(initTimer)
    cleanups.forEach((fn) => fn())
    ro?.disconnect()
    mo.disconnect()
    all.forEach((a) => {
      a.infoTopFade?.remove()
      a.infoBottomFade?.remove()
      a.visualTopFade?.remove()
      a.visualBottomFade?.remove()
      a.infoHint?.remove()
      a.visualHint?.remove()
    })
  }
}
