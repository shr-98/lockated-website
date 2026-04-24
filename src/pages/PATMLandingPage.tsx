import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLenisScrollSync, scrollDocumentToY } from '../lenis/lenisScrollSync'
import { attachTeamStoryInnerScroll } from '../lenis/teamStoryInnerScroll'

void gsap.registerPlugin(ScrollTrigger)

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/**
 * Standalone `public/patm.html` uses `.reveal` + `.in-view` for scroll reveals.
 * The app shell’s `index.css` uses `.reveal` + `.reveal--in` with blur.
 * For parity with `VendorManagementLandingPage`, the route scopes `.reveal` / `.visible`.
 * Team use cases: Snag 360 keeps `.reveal` and un-hides with IO + route CSS. PATM does the same:
 * high-specificity overrides for `#teams` + immediate `visible` / `in-view` in the team effect
 * (stripping `reveal` was fighting global sheets and could leave the block invisible while pinned).
 */
/** Fixed nav height in `public/patm.html` — pin start + scroll padding must match. */
const PATM_NAV_OFFSET_PX = 68
/** Pin + team story: same as FM Matrix / Lease Management (min-width: 768px). */
const PATM_TEAMS_PIN_MIN_WIDTH_PX = 768
/**
 * Two-column (tab rail + panels) only at this width+. Below this, `patm.html` stacks tabs over panels
 * — isolation CSS must not force 2 columns in that range, or the scroll story won’t look like the other landings.
 */
const PATM_TEAMS_TWO_COL_MIN_PX = 1101
/** Team use cases: same scroll length per tab as Snag 360 (`snag-360.html` + `Snag360LandingPage`). */
const TEAM_STORY_SCROLL_PER_TAB_VH = 1.2

/** Scoped overrides so app Tailwind / global styles do not force white shells, buttons, or forms. */
const PATM_ISOLATION_CSS = `
.patm-root {
  position: relative;
  isolation: isolate;
}
html:has(.patm-root) {
  scroll-padding-top: ${PATM_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
  overflow-anchor: none;
}
.patm-root .teams-section,
.patm-root #teamsStoryPin,
.patm-root .pin-spacer {
  overflow-anchor: none;
}
.patm-root section[id],
.patm-root .teams-section#teams {
  scroll-margin-top: ${PATM_NAV_OFFSET_PX + 4}px;
}
.patm-root #navbar {
  z-index: 10050;
}
/* Heading moved INSIDE #teamsStoryPin at runtime so it pins together with tabs + panels
   (mirrors public/vendor-management.html). Tight spacing so tabs sit right under the title. */
.patm-root .teams-section .teams-section-header {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
.patm-root #teamsStoryPin .teams-section-header.patm-teams-header--in-pin {
  flex: 0 0 auto !important;
  width: 100% !important;
  max-width: 1200px !important;
  margin: 0 auto 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}
.patm-root #teamsStoryPin .teams-section-header.patm-teams-header--in-pin .section-title {
  margin-top: 8px !important;
  margin-bottom: 8px !important;
}
.patm-root #teamsStoryPin .teams-section-header.patm-teams-header--in-pin .section-sub {
  margin-bottom: 0 !important;
}
/* Stacking: like vendor-mgmt route — do not over-stack; pin uses z-index 1. */
.patm-root .teams-section#teams.patm-teams--app {
  position: relative !important;
}
/* Thin horizontal divider at top of Team Use Cases section — matches the rule between sections
   (same color/weight as the clients-section / usps-section boundary in public/patm.html). */
.patm-root .teams-section#teams::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: min(100%, 1400px) !important;
  height: 1px !important;
  background: rgba(196, 184, 157, 0.3) !important;
  pointer-events: none !important;
  z-index: 1 !important;
}
.patm-root #teamsStoryPin {
  margin-top: 32px !important;
}
.patm-root .teams-story-pin-inner {
  padding-top: 0 !important;
}
/* Progress: same track + fill + spacing as Snag360LandingPage (footer of pin). */
.patm-root #teamsStoryPin .teams-story-progress {
  display: block !important;
  width: 100% !important;
  max-width: 480px !important;
  margin: 28px auto 0 !important;
  padding: 0 20px !important;
  box-sizing: border-box !important;
  height: auto !important;
  min-height: 0 !important;
  background: transparent !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
  visibility: visible !important;
  opacity: 1 !important;
}
.patm-root #teamsStoryPin .teams-story-progress-track {
  display: block !important;
  height: 4px !important;
  border-radius: 100px !important;
  background: rgba(44, 44, 44, 0.12) !important;
  overflow: hidden !important;
}
.patm-root #teamsStoryPin #teamsStoryProgress,
.patm-root #teamsStoryPin .teams-story-progress-fill {
  display: block !important;
  min-height: 4px !important;
  height: 100% !important;
  width: 100% !important;
  background: var(--primary, #da7756) !important;
  border-radius: 100px !important;
  transform-origin: left center !important;
}
/* Pin shell: 768+ — restore viewport-height pin (tabs + panels + progress). */
@media (min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px) {
  .patm-root #teamsStoryPin {
    z-index: 1 !important;
    background: var(--cream, #F6F4EE) !important;
    will-change: auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
    width: 100% !important;
    height: calc(100dvh - ${PATM_NAV_OFFSET_PX}px) !important;
    max-height: calc(100dvh - ${PATM_NAV_OFFSET_PX}px) !important;
    min-height: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    overflow-x: hidden !important;
  }
  .patm-root #teamsStoryPin .teams-story-pin-inner {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    padding-top: clamp(24px, 3vh, 40px) !important;
    padding-bottom: 0 !important;
  }
  /* Header + layout + progress must coexist in the viewport-height pin. Keep the header compact via
     type/line-height only — do NOT clip with max-height/overflow, or words get cut off. */
  .patm-root #teamsStoryPin .teams-section-header.patm-teams-header--in-pin {
    flex: 0 0 auto !important;
  }
  .patm-root #teamsStoryPin .teams-section-header.patm-teams-header--in-pin .section-title {
    font-size: clamp(1.6rem, 3.2vw, 2.4rem) !important;
    line-height: 1.15 !important;
  }
  .patm-root #teamsStoryPin .teams-section-header.patm-teams-header--in-pin .section-sub {
    font-size: clamp(0.9rem, 1.1vw, 1rem) !important;
    line-height: 1.45 !important;
    margin-top: 6px !important;
  }
  /* Room above footer progress: mirrors Snag .teams-main padding-bottom 32px. */
  .patm-root #teamsStoryPin .teams-layout {
    padding-bottom: 12px !important;
    margin-top: 14px !important;
  }
}
/* Two-column (rail + panels) only 1101+ — pinned scroll story desktop. */
@media (min-width: ${PATM_TEAMS_TWO_COL_MIN_PX}px) {
  .patm-root #teamsStoryPin .teams-layout {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    min-width: 0 !important;
    display: grid !important;
    grid-template-columns: minmax(0, 280px) minmax(0, 1fr) !important;
    grid-template-rows: minmax(0, 1fr) !important;
    gap: clamp(28px, 3vw, 48px) !important;
    align-items: stretch !important;
    margin-top: 0 !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .teams-tabs {
    min-height: 0 !important;
    align-self: start !important;
    max-height: 100% !important;
    box-sizing: border-box !important;
    padding-bottom: 10px !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-gutter: stable;
    touch-action: pan-y !important;
  }
  .patm-root #teamsStoryPin .teams-panels {
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .team-content.active {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
    gap: clamp(28px, 3vw, 48px) !important;
    align-items: center !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-info {
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-visual {
    align-self: center !important;
    justify-self: center !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
  }
}
/* 768–1100: tabs over copy, still pinned. */
@media (min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px) and (max-width: 1100px) {
  .patm-root #teamsStoryPin .teams-layout {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    min-width: 0 !important;
    display: grid !important;
    grid-template-columns: 1fr !important;
    grid-template-rows: auto minmax(0, 1fr) !important;
    gap: 28px !important;
    margin-top: 0 !important;
    align-items: start !important;
    align-content: stretch !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .teams-tabs {
    max-height: none !important;
    min-height: 0 !important;
    align-self: stretch !important;
    overflow: visible !important;
    padding-bottom: 0 !important;
  }
  .patm-root #teamsStoryPin .teams-panels {
    min-height: 0 !important;
    flex: 1 1 auto !important;
    max-height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .team-content.active {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    max-height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-info {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-visual {
    display: none !important;
  }
}
.patm-root .pin-spacer {
  background: var(--cream, #F6F4EE) !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
.patm-root .team-content.active {
  align-items: center !important;
}
.patm-root .team-content.active > .team-visual {
  height: auto !important;
  align-self: center !important;
  justify-self: center !important;
  width: 100% !important;
  max-width: min(100%, var(--team-visual-max-w, 420px)) !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  aspect-ratio: auto !important;
}
.patm-root .team-content.active .team-visual-body {
  flex: 0 0 auto !important;
}
/* Mobile (≤767px): no fixed-height pin box — no GSAP pin here; document scroll. */
@media (max-width: 767px) {
  .patm-root .teams-section#teams,
  .patm-root .teams-section#teams .teams-inner {
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin {
    height: auto !important;
    max-height: none !important;
    display: block !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .teams-layout,
  .patm-root #teamsStoryPin .teams-panels,
  .patm-root #teamsStoryPin .team-content.active {
    display: block !important;
    flex: none !important;
    max-height: none !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .team-content.active > .team-info,
  .patm-root #teamsStoryPin .team-content.active > .team-visual {
    max-height: none !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .teams-tabs {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
  .patm-root #teamsStoryPin .teams-story-progress,
  .patm-root .teams-section .teams-story-progress {
    display: block !important;
    width: 100% !important;
    max-width: 480px !important;
    margin: 28px auto 0 !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}
@media (max-width: 768px) {
  .patm-root #teams .teams-section-header {
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  .patm-root #teams .section-title,
  .patm-root #teams .section-sub {
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
  }
}
.patm-root #teamsStoryProgress {
  transform-origin: left center !important;
}
.patm-root,
.patm-root * {
  color-scheme: only light !important;
}
.patm-root h1,
.patm-root h2,
.patm-root h3,
.patm-root h4,
.patm-root h5,
.patm-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
.patm-root nav {
  background: rgba(246, 244, 238, 0.92) !important;
}
.patm-root nav.scrolled {
  background: rgba(246, 244, 238, 0.97) !important;
}
.patm-root .hero,
.patm-root .walkthrough-section,
.patm-root .teams-section,
.patm-root .usps-section,
.patm-root .contact-section,
.patm-root footer {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .section#pain {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .usecases-section {
  background-color: var(--band, #E8E2D6) !important;
}
.patm-root .clients-section {
  background: rgba(232, 226, 214, 0.55) !important;
}
.patm-root .usp-visual {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .usp-visual-header {
  background: rgba(240, 234, 225, 0.92) !important;
}
.patm-root .screen-sovereignty,
.patm-root .screen-tasks,
.patm-root .screen-analytics,
.patm-root .screen-mom,
.patm-root .screen-kanban,
.patm-root .screen-allinone {
  background: rgba(240, 234, 225, 0.96) !important;
}
.patm-root .feature-screen {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .feature-screen-header {
  background: rgba(240, 234, 225, 0.88) !important;
}
.patm-root .feature-screen-body {
  background-color: var(--cream, #F6F4EE) !important;
}
/* Team mock: compact card (max width from --team-visual-max-w in patm.html) */
.patm-root .team-visual {
  background-color: var(--surface, #F0EAE1) !important;
  border: 1px solid #c4b89d !important;
  box-shadow: 0 8px 28px rgba(44, 44, 44, 0.08) !important;
  border-radius: 16px !important;
  max-width: min(100%, var(--team-visual-max-w, 300px)) !important;
}
.patm-root .team-visual-header {
  background: var(--cream, #F6F4EE) !important;
  border-bottom: 1px solid #c4bcad !important;
}
.patm-root .team-visual-body {
  background: var(--cream, #F6F4EE) !important;
}
.patm-root .float-card {
  background: rgba(240, 234, 225, 0.94) !important;
}
.patm-root .modal-inner {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .modal-close {
  background: rgba(240, 234, 225, 0.96) !important;
}
.patm-root .modal-close:hover {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .end-banner {
  background-color: var(--band, #E8E2D6) !important;
}
.patm-root .pain-card {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .trust-badge {
  background: rgba(240, 234, 225, 0.92) !important;
}
.patm-root .usecase-card {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .glass {
  background: rgba(246, 244, 238, 0.72) !important;
  border-color: rgba(196, 184, 157, 0.45) !important;
}
.patm-root button.feature-tab {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .feature-tabs {
  background-color: var(--cream, #F6F4EE) !important;
}
.patm-root .teams-tabs {
  background: transparent !important;
}
.patm-root .teams-layout button.team-tab {
  color: var(--dark, #2c2c2c) !important;
  border: 1.5px solid transparent !important;
}
.patm-root .teams-layout button.team-tab:not(.active) {
  background: var(--surface, #f0eae1) !important;
}
.patm-root .teams-layout button.team-tab.active {
  background: rgba(218, 119, 86, 0.05) !important;
  border-color: var(--primary, #da7756) !important;
}
.patm-root .teams-layout .team-tab-text {
  color: rgba(44, 44, 44, 0.6) !important;
}
.patm-root .teams-layout .team-tab.active .team-tab-text {
  color: var(--dark, #2c2c2c) !important;
}
.patm-root .teams-layout .team-tab-icon {
  background: var(--cream, #f6f4ee) !important;
  border: 1px solid var(--divider, rgba(196, 184, 157, 0.55)) !important;
}
.patm-root .teams-layout .team-tab.active .team-tab-icon {
  background: var(--primary, #da7756) !important;
  border-color: var(--primary, #da7756) !important;
}
.patm-root .teams-layout .team-tab.active .team-tab-icon svg {
  color: var(--on-primary, #f6f4ee) !important;
  opacity: 1 !important;
}
.patm-root .teams-layout .team-tab-icon svg {
  color: rgba(44, 44, 44, 0.5) !important;
  opacity: 1 !important;
}
/* Pinned #teams tab rail: compact sizing like Snag 360 (gap 6, 12px label, 30px icon). */
.patm-root #teams .teams-tabs {
  flex-shrink: 0 !important;
  align-self: stretch !important;
  gap: 6px !important;
  max-height: 100% !important;
  overflow-y: auto !important;
  scrollbar-width: none !important;
  padding: 0 6px 0 0 !important;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
}
.patm-root #teams .teams-tabs::-webkit-scrollbar {
  display: none !important;
}
.patm-root #teams .teams-layout button.team-tab {
  background-image: none !important;
  min-height: 0 !important;
  padding: 10px 12px !important;
  border-radius: 9px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  font-size: 12px !important;
  line-height: 1.35 !important;
}
.patm-root #teams .teams-layout .team-tab-text {
  font-size: 12px !important;
  line-height: 1.35 !important;
}
.patm-root #teams .teams-layout .team-tab-icon {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
  border-radius: 8px !important;
}
.patm-root #teams .teams-layout .team-tab-icon svg {
  width: 14px !important;
  height: 14px !important;
  flex-shrink: 0 !important;
  color: rgba(44, 44, 44, 0.5) !important;
  stroke: currentColor !important;
}
.patm-root #teams .teams-layout .team-tab.active .team-tab-icon svg {
  color: var(--on-primary, #f6f4ee) !important;
  stroke: currentColor !important;
}
.patm-root .btn-primary,
.patm-root .btn-hero-primary,
.patm-root .form-submit {
  color: var(--on-primary, #F6F4EE) !important;
}
.patm-root .form-input,
.patm-root .form-select,
.patm-root textarea.form-input {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .form-input:focus,
.patm-root textarea.form-input:focus {
  background-color: var(--surface, #F0EAE1) !important;
}
.patm-root .form-input:-webkit-autofill,
.patm-root .form-input:-webkit-autofill:hover,
.patm-root .form-input:-webkit-autofill:focus,
.patm-root .form-select:-webkit-autofill,
.patm-root .form-select:-webkit-autofill:hover,
.patm-root .form-select:-webkit-autofill:focus,
.patm-root textarea.form-input:-webkit-autofill,
.patm-root textarea.form-input:-webkit-autofill:hover,
.patm-root textarea.form-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface, #F0EAE1) inset !important;
  box-shadow: 0 0 0 1000px var(--surface, #F0EAE1) inset !important;
  -webkit-text-fill-color: var(--dark, #2C2C2C) !important;
}

/* Team use cases: Vendor Management — route CSS last; ensures #teams is never dimmed or stuck pre-reveal. */
.patm-root .teams-section#teams,
.patm-root .teams-section#teams .teams-section-header,
.patm-root .teams-section#teams .teams-story-pin,
.patm-root .teams-section#teams .teams-story-pin-inner,
.patm-root .teams-section#teams .teams-layout,
.patm-root .teams-section#teams .teams-tabs,
.patm-root .teams-section#teams .teams-panels,
.patm-root .teams-section#teams .team-content.active {
  opacity: 1 !important;
  visibility: visible !important;
}
.patm-root .teams-section#teams .reveal,
.patm-root .teams-section#teams .fade-up,
.patm-root .teams-section#teams .reveal.visible,
.patm-root .teams-section#teams .reveal.in-view,
.patm-root .teams-section#teams .reveal.reveal--in {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
  will-change: auto !important;
  visibility: visible !important;
}
`

type PatmTeamStoryGsapOpts = {
  teamTabs: HTMLElement[]
  teamIds: string[]
  switchTeam: (teamId: string, tabEl?: HTMLElement) => void
}

/**
 * #teams — pin + scroll story on tablet/desktop (min-width: 768px), aligned with Snag 360.
 * Below 768px: `initPatmTeamProgressBarOnly`. Reduced motion: no ST.
 */
function initPatmTeamStoryGsap(
  root: HTMLElement,
  opts: PatmTeamStoryGsapOpts,
): ScrollTrigger | null {
  const pin = root.querySelector<HTMLElement>('#teamsStoryPin')
  if (!pin) return null

  const n = opts.teamIds.length
  if (n < 1) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (!window.matchMedia(`(min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px)`).matches) return null

  const progressFill = root.querySelector<HTMLElement>('#teamsStoryProgress')

  let lastIdx = -1

  return ScrollTrigger.create({
    id: 'patm-teams-use-cases',
    trigger: pin,
    start: `top ${PATM_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * TEAM_STORY_SCROLL_PER_TAB_VH}`,
    pin: true,
    pinSpacing: true,
    pinType: 'fixed',
    anticipatePin: 0,
    fastScrollEnd: false,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(n - 1, Math.max(0, Math.floor(self.progress * n)))
      if (idx !== lastIdx) {
        lastIdx = idx
        const id = opts.teamIds[idx]
        if (id) opts.switchTeam(id, opts.teamTabs[idx])
      }
      if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
    },
  })
}

/**
 * Below 768px: no pin. Scrub the progress bar; tabs are click-only (no Lenis jump).
 */
function initPatmTeamProgressBarOnly(
  root: HTMLElement,
  opts: PatmTeamStoryGsapOpts,
): ScrollTrigger | null {
  const pin = root.querySelector<HTMLElement>('#teamsStoryPin')
  if (!pin) return null

  const n = opts.teamIds.length
  if (n < 1) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (window.matchMedia(`(min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px)`).matches) return null

  const progressFill = root.querySelector<HTMLElement>('#teamsStoryProgress')
  const applyBar = (self: ScrollTrigger) => {
    if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
  }

  return ScrollTrigger.create({
    id: 'patm-teams-progress-mobile',
    trigger: pin,
    start: `top ${PATM_NAV_OFFSET_PX}px`,
    end: () => `+=${n * window.innerHeight * TEAM_STORY_SCROLL_PER_TAB_VH}`,
    pin: false,
    scrub: 0.2,
    invalidateOnRefresh: true,
    onEnter: (self) => applyBar(self),
    onEnterBack: (self) => applyBar(self),
    onRefresh: (self) => applyBar(self),
    onUpdate: (self) => applyBar(self),
  })
}

const BACKDROP_FILTER_FIX_CSS = `
/* public/patm.html adds body::before grain at z-index: 9999 — in the SPA it paints over the
   whole route; vendor-management route disables the same. This style only mounts on PATM. */
body::before {
  content: none !important;
  display: none !important;
}
/* PATM integration fix:
   Some browsers/pages can end up with unintended backdrop-filter layers
   that visually blur content. Disable globally inside PATM and re-enable
   only for the intended components. */
.patm-root * {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
.patm-root nav {
  -webkit-backdrop-filter: blur(20px) !important;
  backdrop-filter: blur(20px) !important;
}
.patm-root .usecase-modal {
  -webkit-backdrop-filter: blur(8px) !important;
  backdrop-filter: blur(8px) !important;
}
.patm-root .float-card {
  -webkit-backdrop-filter: blur(20px) !important;
  backdrop-filter: blur(20px) !important;
}
.patm-root .glass {
  -webkit-backdrop-filter: blur(24px) !important;
  backdrop-filter: blur(24px) !important;
}

.patm-root {
  color-scheme: only light;
}

/* Same scoping as Vendor Management: override global index.css .reveal (blur / opacity) */
.patm-root .reveal,
.patm-root .fade-up {
  opacity: 0 !important;
  transform: translateY(24px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.6s ease, transform 0.6s ease !important;
}
.patm-root .reveal.visible,
.patm-root .reveal.in-view,
.patm-root .fade-up.visible,
.patm-root .fade-up.in-view {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
/* App shell index.css also expects .reveal--in; keep in sync with .visible. */
.patm-root .reveal.reveal--in,
.patm-root .reveal.in-view,
.patm-root .reveal.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .patm-root .reveal,
  .patm-root .reveal.visible,
  .patm-root .reveal.in-view,
  .patm-root .reveal.reveal--in,
  .patm-root .fade-up {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.patm-root #walkthrough .feature-info {
  max-height: min(72vh, calc(100vh - 200px));
  overflow-y: auto;
  overscroll-behavior: contain;
}
`

export default function PATMLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor
    const prevBodyColor = document.body.style.color
    document.body.style.backgroundColor = '#F6F4EE'
    document.body.style.color = '#2C2C2C'
    return () => {
      document.body.style.backgroundColor = prevBodyBg
      document.body.style.color = prevBodyColor
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/patm.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /patm.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const teamsSec = doc.getElementById('teams')
        if (teamsSec) teamsSec.classList.add('patm-teams--app')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/patm.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${BACKDROP_FILTER_FIX_CSS}\n${PATM_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load PATM content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!bodyHtml) return

    // Team use cases: keep the header ABOVE #teamsStoryPin so the section reads top-down like the
    // "How we fix it" section — eyebrow + title + subtitle sit on top, content flows normally below.
    // If a previous render moved the header into the pin, restore it.
    const teamsSection = root.querySelector<HTMLElement>('#teams')
    const teamsPin = root.querySelector<HTMLElement>('#teamsStoryPin')
    const teamsHeader = root.querySelector<HTMLElement>('#teams .teams-section-header')
    if (teamsSection && teamsPin && teamsHeader && teamsPin.contains(teamsHeader)) {
      teamsSection.insertBefore(teamsHeader, teamsPin)
      teamsHeader.classList.remove('patm-teams-header--in-pin')
    }

    // Team use cases (Snag 360): show `.reveal` in #teams immediately so nothing stays opacity:0 before IO / while pinned.
    root.querySelectorAll<HTMLElement>('#teams .reveal, #teams .fade-up').forEach((el) => {
      el.classList.add('visible', 'in-view', 'reveal--in')
    })

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal observer (same pattern as `VendorManagementLandingPage`: .reveal -> .visible)
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const t = e.target as HTMLElement
          t.classList.add('visible', 'in-view', 'reveal--in')
        })
      },
      { threshold: 0.15 },
    )
    revealEls.forEach((el) => revealObserver.observe(el))

    // Counter animation (hero metrics)
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.counter'))
    let countersStarted = false
    const counterTimers: number[] = []

    const startCounters = () => {
      if (countersStarted) return
      countersStarted = true
      counters.forEach((counter) => {
        const target = Number.parseFloat(counter.dataset.target || '0')
        if (!Number.isFinite(target)) return
        const prefix = counter.dataset.prefix || ''
        const suffix = counter.dataset.suffix || ''
        const isDecimal = counter.dataset.decimal === 'true'
        const duration = 2000
        const steps = 60
        const stepTime = duration / steps
        let current = 0
        const increment = target / steps
        const timer = window.setInterval(() => {
          current += increment
          if (current >= target) current = target
          const display = isDecimal ? current.toFixed(1) : String(Math.floor(current))
          counter.textContent = `${prefix}${display}${suffix}`
          if (current >= target) window.clearInterval(timer)
        }, stepTime)
        counterTimers.push(timer)
      })
    }

    const metricsEl = root.querySelector<HTMLElement>('#hero-metrics')
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) startCounters()
        })
      },
      { threshold: 0.3 },
    )
    if (metricsEl) metricsObserver.observe(metricsEl)

    // USP accordion (switch `.usp-item.active` and `.usp-screen.visible`)
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    const uspClickHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    uspItems.forEach((item) => {
      const header = item.querySelector<HTMLElement>('.usp-header')
      if (!header) return
      const onClick = () => {
        const targetScreen = item.dataset.screen || ''
        uspItems.forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
        uspScreens.forEach((s) => s.classList.remove('visible'))
        const target = root.querySelector<HTMLElement>(`#${CSS.escape(targetScreen)}`)
        if (target) target.classList.add('visible')
      }
      header.addEventListener('click', onClick)
      uspClickHandlers.push({ el: header, fn: onClick })
    })

    // Feature tabs
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    const featureHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    featureTabs.forEach((tab) => {
      const fn = () => {
        const feature = tab.dataset.feature || ''
        featureTabs.forEach((t) => t.classList.remove('active'))
        featurePanels.forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        const panel = root.querySelector<HTMLElement>(`[data-panel="${CSS.escape(feature)}"]`)
        if (panel) panel.classList.add('active')
      }
      tab.addEventListener('click', fn)
      featureHandlers.push({ el: tab, fn })
    })

    // Pain card hover glow
    const painCards = Array.from(root.querySelectorAll<HTMLElement>('.pain-card'))
    const painHandlers: Array<{ el: HTMLElement; onMove: (e: MouseEvent) => void; onLeave: () => void }> = []
    painCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(218,119,86,0.04) 0%, #F0EAE1 60%)`
      }
      const onLeave = () => {
        card.style.background = ''
      }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      painHandlers.push({ el: card, onMove, onLeave })
    })

    // Animate progress bars (USP analytics + feature screens)
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).querySelectorAll<HTMLElement>('.progress-bar-fill').forEach((bar) => {
            const width = bar.style.width
            if (!width) return
            bar.style.width = '0%'
            window.setTimeout(() => {
              bar.style.width = width
            }, 100)
          })
        })
      },
      { threshold: 0.3 },
    )
    root.querySelectorAll<HTMLElement>('.screen-analytics, .feature-screen-body').forEach((el) => progressObserver.observe(el))

    // Teams: instant tab/panel swap only (no slide/fade — matches Vendor / other landings; scroll pin is separate).
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.teams-tabs .team-tab'))
    const teamContents = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const switchTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => t.classList.remove('active'))
      teamContents.forEach((c) => c.classList.remove('active'))
      const tab = tabEl ?? teamTabs.find((t) => t.dataset.team === teamId)
      tab?.classList.add('active')
      const content = teamContents.find((c) => c.dataset.content === teamId)
      if (content) content.classList.add('active')
    }
    const teamIds = teamTabs.map((t) => t.dataset.team).filter(Boolean) as string[]
    const lenisScroll = createLenisScrollSync()
    const innerScrollCleanup = attachTeamStoryInnerScroll(root)
    let teamStorySt: ScrollTrigger | null = null
    const scrollToTeamIndex = (idx: number) => {
      if (!teamIds[idx] || !teamTabs[idx]) return
      if (!teamStorySt) {
        switchTeam(teamIds[idx]!, teamTabs[idx]!)
        return
      }
      /* Stacked / narrow: no pin; keep tab switches instant (no Lenis jump). */
      if (window.matchMedia('(max-width: 767px)').matches) {
        switchTeam(teamIds[idx]!, teamTabs[idx]!)
        return
      }
      const st = teamStorySt
      const n = teamIds.length
      if (n <= 1) {
        switchTeam(teamIds[0]!, teamTabs[0]!)
        return
      }
      const p = idx / (n - 1)
      const y = st.start + p * (st.end - st.start)
      scrollDocumentToY(lenisScroll.instance, y)
    }
    const teamHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    teamTabs.forEach((tab) => {
      const teamId = tab.dataset.team || ''
      if (!teamId) return
      const fn = (e: Event) => {
        e.preventDefault()
        const idx = teamIds.indexOf(teamId)
        if (idx >= 0) scrollToTeamIndex(idx)
        else switchTeam(teamId, tab)
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })
    const initialTeamTab = teamTabs.find((t) => t.classList.contains('active'))
    if (initialTeamTab?.dataset.team) switchTeam(initialTeamTab.dataset.team, initialTeamTab)

    const refreshTeamScroll = () => {
      requestAnimationFrame(() => {
        lenisScroll.resize()
        ScrollTrigger.refresh()
      })
    }
    const gsapCtx = gsap.context(() => {
      teamStorySt = window.matchMedia(`(min-width: ${PATM_TEAMS_PIN_MIN_WIDTH_PX}px)`).matches
        ? initPatmTeamStoryGsap(root, { teamTabs, teamIds, switchTeam })
        : initPatmTeamProgressBarOnly(root, { teamTabs, teamIds, switchTeam })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
        })
      })
    }, root)
    const onLayoutRefresh = () => refreshTeamScroll()
    if (document.readyState === 'complete') onLayoutRefresh()
    else window.addEventListener('load', onLayoutRefresh)
    const lateLayout = window.setTimeout(() => refreshTeamScroll(), 250)
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeTimer = undefined
        refreshTeamScroll()
      }, 100)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Use case modals
    const openModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (modal) {
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
        lenisScroll.stop()
      }
    }
    const closeModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (modal) {
        modal.classList.remove('open')
        document.body.style.overflow = ''
        lenisScroll.start()
      }
    }
    ;(window as any).closeModal = closeModal

    const usecaseCards = Array.from(root.querySelectorAll<HTMLElement>('.usecase-card'))
    const usecaseCardHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    usecaseCards.forEach((card) => {
      const fn = () => {
        const modalId = card.dataset.modal || ''
        if (modalId) openModal(modalId)
      }
      card.addEventListener('click', fn)
      usecaseCardHandlers.push({ el: card, fn })
    })

    const modalBackdrops = Array.from(root.querySelectorAll<HTMLElement>('.usecase-modal'))
    const modalBackdropHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    modalBackdrops.forEach((modal) => {
      const fn = (e: MouseEvent) => {
        if (e.target === modal) {
          modal.classList.remove('open')
          document.body.style.overflow = ''
          lenisScroll.start()
        }
      }
      modal.addEventListener('click', fn)
      modalBackdropHandlers.push({ el: modal, fn })
    })

    const modalInners = Array.from(root.querySelectorAll<HTMLElement>('.modal-inner'))
    const modalInnerHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    modalInners.forEach((inner) => {
      const fn = (e: MouseEvent) => e.stopPropagation()
      inner.addEventListener('click', fn)
      modalInnerHandlers.push({ el: inner, fn })
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      root.querySelectorAll<HTMLElement>('.usecase-modal.open').forEach((m) => m.classList.remove('open'))
      document.body.style.overflow = ''
      lenisScroll.start()
    }
    document.addEventListener('keydown', onKeyDown)

    // Hover glow vars on usecase cards
    const usecaseHoverHandlers: Array<{ el: HTMLElement; onMove: (e: MouseEvent) => void }> = []
    usecaseCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mx', `${x}%`)
        card.style.setProperty('--my', `${y}%`)
      }
      card.addEventListener('mousemove', onMove)
      usecaseHoverHandlers.push({ el: card, onMove })
    })

    // Animate bar fills on scroll (teams visuals + end banner)
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement)
            .querySelectorAll<HTMLElement>('.bar-fill, .float-progress-fill')
            .forEach((bar) => {
              const w = bar.style.width
              if (!w) return
              bar.style.width = '0%'
              bar.style.transition = 'width 1.2s cubic-bezier(0.23,1,0.32,1)'
              window.setTimeout(() => {
                bar.style.width = w
              }, 100)
            })
        })
      },
      { threshold: 0.3 },
    )
    root
      .querySelectorAll<HTMLElement>('.team-visual-body, .end-banner, #cta-banner')
      .forEach((el) => barObserver.observe(el))

    // Contact submit
    const submitBtn = root.querySelector<HTMLButtonElement>('.form-submit')
    const onSubmit = (e: Event) => {
      e.preventDefault()
      if (!submitBtn) return
      const span = submitBtn.querySelector('span')
      if (span) span.textContent = 'Message Sent!'
      submitBtn.style.background = '#798C5E'
      window.setTimeout(() => {
        if (span) span.textContent = 'Send Message'
        submitBtn.style.background = ''
      }, 3000)
    }
    submitBtn?.addEventListener('click', onSubmit)

    return () => {
      gsapCtx.revert()
      innerScrollCleanup()
      lenisScroll.destroy()
      clearTimeout(lateLayout)
      window.removeEventListener('load', onLayoutRefresh)
      window.removeEventListener('resize', onResize)
      if (resizeTimer !== undefined) clearTimeout(resizeTimer)

      window.removeEventListener('scroll', onScroll)
      revealObserver.disconnect()
      metricsObserver.disconnect()
      progressObserver.disconnect()
      barObserver.disconnect()
      counterTimers.forEach((t) => window.clearInterval(t))

      uspClickHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      featureHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      painHandlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      usecaseCardHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalBackdropHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalInnerHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      usecaseHoverHandlers.forEach(({ el, onMove }) => el.removeEventListener('mousemove', onMove))
      submitBtn?.removeEventListener('click', onSubmit)
      document.removeEventListener('keydown', onKeyDown)
      delete (window as any).closeModal
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="patm-root min-h-dvh bg-[#F6F4EE]">
      {headLinks.map((l) => (
        <link
          key={`${l.rel}:${l.href}`}
          rel={l.rel}
          href={l.href}
          crossOrigin={
            l.crossOrigin === 'anonymous'
              ? 'anonymous'
              : l.crossOrigin === 'use-credentials'
                ? 'use-credentials'
                : undefined
          }
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>PATM error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}

