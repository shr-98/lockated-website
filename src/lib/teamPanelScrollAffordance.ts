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
  // ${root} ${pin} ${panel}.active > .team-info,
  // ${root} ${pin} ${panel}.active > .team-visual {
  //   scroll-behavior: smooth !important;
  //   scrollbar-gutter: stable !important;
  //   scrollbar-width: auto !important;
  //   scrollbar-color: rgba(${primaryRgb}, 0.85) rgba(44, 44, 44, 0.08) !important;
  // }
  ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar,
  ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
    display: none !important;
    background: rgba(44, 44, 44, 0.06) !important;
  }
  // ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar-track,
  // ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar-track {
  //   background: rgba(44, 44, 44, 0.06) !important;
  //   border-radius: 100px !important;
  //   margin: 4px 0 !important;
  // }
  // ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar-thumb,
  // ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar-thumb {
  //   background:
  //     linear-gradient(180deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 100%),
  //     ${primary} !important;
  //   border: 2px solid ${fade} !important;
  //   border-radius: 100px !important;
  //   min-height: 36px !important;
  //   box-shadow: 0 0 0 1px rgba(${primaryRgb}, 0.25) !important;
  // }
  // ${root} ${pin} ${panel}.active > .team-info::-webkit-scrollbar-thumb:hover,
  // ${root} ${pin} ${panel}.active > .team-visual::-webkit-scrollbar-thumb:hover {
  //   background: rgba(${primaryRgb}, 1) !important;
  //   filter: brightness(0.92);
  // }
}
${root} ${panel} .lk-scroll-fade {
  display: none;
}
/* Position is set inline by JS to match each scrollport's bounding rect.
   Stylesheet only defines visual style + transitions. */
// ${root} ${panel}.active .lk-scroll-fade {
//   position: absolute;
//   height: 56px;
//   pointer-events: none;
//   opacity: 0;
//   transition: opacity 0.2s ease;
//   z-index: 4;
//   /* Defaults overridden inline; bottom:auto/top:auto reset stale rules. */
//   left: 0;
//   right: auto;
//   width: 0;
// }
${root} ${panel}.active .lk-scroll-fade--bottom {
  top: auto;
  background: linear-gradient(
    to bottom,
    rgba(${fadeRgb}, 0) 0%,
    rgba(${fadeRgb}, 0.85) 70%,
    rgba(${fadeRgb}, 1) 100%
  );
}
${root} ${panel}.active .lk-scroll-fade--top {
  bottom: auto;
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
@media (max-width: ${minW - 1}px) {
  ${root} ${panel} .lk-scroll-fade {
    display: none !important;
  }
}
`
}

export type AttachOpts = {
  /** Same as CSS opts.panelClass — without dot. */
  panelClass: string
}

type Pieces = {
  panel: HTMLElement
  info: HTMLElement | null
  visual: HTMLElement | null
  infoTopFade: HTMLElement | null
  infoBottomFade: HTMLElement | null
  visualTopFade: HTMLElement | null
  visualBottomFade: HTMLElement | null
}

export function attachTeamPanelScrollAffordance(
  root: HTMLElement,
  opts: AttachOpts,
): () => void {
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>(`.${opts.panelClass}`),
  )
  if (!panels.length) return () => { }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const buildAffordance = (
    panel: HTMLElement,
    kind: 'info' | 'visual',
  ): { topFade: HTMLElement; bottomFade: HTMLElement } => {
    const topFade = document.createElement('div')
    topFade.className = `lk-scroll-fade lk-scroll-fade--top lk-scroll-fade--${kind}`
    const bottomFade = document.createElement('div')
    bottomFade.className = `lk-scroll-fade lk-scroll-fade--bottom lk-scroll-fade--${kind}`
    panel.appendChild(topFade)
    panel.appendChild(bottomFade)
    return { topFade, bottomFade }
  }

  const all: Pieces[] = panels.map((panel) => {
    const info = panel.querySelector<HTMLElement>(':scope > .team-info')
    const visual = panel.querySelector<HTMLElement>(':scope > .team-visual')
    let infoTopFade: HTMLElement | null = null
    let infoBottomFade: HTMLElement | null = null
    let visualTopFade: HTMLElement | null = null
    let visualBottomFade: HTMLElement | null = null
    if (info) {
      const a = buildAffordance(panel, 'info')
      infoTopFade = a.topFade
      infoBottomFade = a.bottomFade
    }
    if (visual) {
      const a = buildAffordance(panel, 'visual')
      visualTopFade = a.topFade
      visualBottomFade = a.bottomFade
    }
    return {
      panel,
      info,
      visual,
      infoTopFade,
      infoBottomFade,
      visualTopFade,
      visualBottomFade,
    }
  })

  const evalPort = (
    port: HTMLElement | null,
    topFade: HTMLElement | null,
    bottomFade: HTMLElement | null,
  ) => {
    if (!port) return
    const { scrollTop, scrollHeight, clientHeight } = port
    const overflow = scrollHeight - clientHeight
    const scrollable = overflow > 4
    const moreBelow = scrollable && scrollTop + clientHeight < scrollHeight - 2
    const moreAbove = scrollable && scrollTop > 2
    if (topFade) topFade.classList.toggle('is-visible', moreAbove)
    if (bottomFade) bottomFade.classList.toggle('is-visible', moreBelow)
  }

  const updateOne = (a: Pieces) => {
    positionOverlays(a)
    evalPort(a.info, a.infoTopFade, a.infoBottomFade)
    evalPort(a.visual, a.visualTopFade, a.visualBottomFade)
  }
  const updateAll = () => all.forEach(updateOne)

  /** Anchor each fade overlay + hint to the actual scrollport's bounding
   * box relative to its panel — robust against per-page grid overrides
   * (e.g. Snag360's `min(420px, 50%)` right column with `justify-self: end`). */
  function positionOverlays(a: Pieces) {
    const panel = a.panel
    if (!panel.classList.contains('active')) return
    const panelRect = panel.getBoundingClientRect()
    const place = (
      port: HTMLElement | null,
      topFade: HTMLElement | null,
      bottomFade: HTMLElement | null,
    ) => {
      if (!port) return
      // If the port itself is hidden (display:none on tablet/mobile), skip.
      const portStyle = window.getComputedStyle(port)
      if (portStyle.display === 'none' || portStyle.visibility === 'hidden') return
      const r = port.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) return
      const left = r.left - panelRect.left
      const top = r.top - panelRect.top
      const fadeH = 56
      if (topFade) {
        topFade.style.left = `${left}px`
        topFade.style.width = `${r.width}px`
        topFade.style.top = `${top}px`
      }
      if (bottomFade) {
        bottomFade.style.left = `${left}px`
        bottomFade.style.width = `${r.width}px`
        bottomFade.style.top = `${top + r.height - fadeH}px`
      }
    }
    place(a.info, a.infoTopFade, a.infoBottomFade)
    place(a.visual, a.visualTopFade, a.visualBottomFade)
  }

  const cleanups: Array<() => void> = []
  all.forEach((a) => {
    if (a.info) {
      const onScroll = () => {
        updateOne(a)
      }
      a.info.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => a.info?.removeEventListener('scroll', onScroll))
    }
    if (a.visual) {
      const onScroll = () => {
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
      ro.observe(a.panel)
      if (a.info) ro.observe(a.info)
      if (a.visual) ro.observe(a.visual)
    })
  }
  const onWindowResize = () => updateAll()
  window.addEventListener('resize', onWindowResize, { passive: true })
  cleanups.push(() => window.removeEventListener('resize', onWindowResize))
  // Reposition on page scroll (pin movement changes scrollport rect).
  const onWindowScroll = () => updateAll()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  cleanups.push(() => window.removeEventListener('scroll', onWindowScroll))

  /* When a panel becomes `.active`: reset state, repaint affordance. */
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
        if (a.info) {
          a.info.scrollTop = 0
        }
        if (a.visual) {
          a.visual.scrollTop = 0
        }
        updateOne(a)
      }
    }
  })
  panels.forEach((p) =>
    mo.observe(p, { attributes: true, attributeFilter: ['class'] }),
  )

  /* Initial paint after layout settles. */
  const initTimer = window.setTimeout(() => {
    updateAll()
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
    })
  }
}
