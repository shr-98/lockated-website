import { useEffect, useRef, useState } from 'react'
import { LandingPageLoader } from '../components/LandingPageLoader'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]
type ExternalScript = { src: string }
type InlineScript = { code: string }

const PROCUREMENT_NAV_OFFSET_PX = 68

/**
 * `public/procurement-management.html` is a self-contained design with its own
 * fixed nav, fonts, and inline `<script>` (counters, reveal observer, tab
 * switchers, industry modal). We fetch it, inject styles + body, then execute
 * the head + inline scripts so the original behavior runs unmodified.
 */
const PROCUREMENT_ISOLATION_CSS = `
.procurement-mgmt-root {
  position: relative;
  isolation: isolate;
  /* Align with Vendor / Lease product landing tokens (warm cream + coral primary) */
  --primary: #DA7756;
  --primary-8: rgba(218, 119, 86, 0.08);
  --primary-15: rgba(218, 119, 86, 0.15);
  --cream: #F6F4EE;
  --bg: #F6F4EE;
  --dark: #2C2C2C;
  --green: #798C5E;
  --teal: #9EC8BA;
  --card-border: #C4B89D;
  --divider: #C4BCAD;
  --muted: #D3D1C7;
  --surface: #F0EAE1;
  --band: #E8E2D6;
  --on-primary: #F6F4EE;
  --info-blue: #6B9BCC;
  --warning: #EDC488;
  --success: #89F7E7;
  --error: #E7848E;
  --exception: #AAB9C5;
  --shadow: 0 24px 70px rgba(44, 44, 44, 0.14);
  /* Product UI mock / GIF frame — match theme “device” edges (warm band frame + white screen) */
  --mock-frame: var(--band);
  --mock-frame-ring: rgba(196, 184, 157, 0.58);
  --mock-pad: clamp(6px, 0.9vw, 10px);
  --mock-radius-outer: 18px;
  --mock-radius-inner: 14px;
}
html:has(.procurement-mgmt-root) {
  scroll-padding-top: ${PROCUREMENT_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.procurement-mgmt-root section[id] {
  scroll-margin-top: ${PROCUREMENT_NAV_OFFSET_PX + 4}px;
}
.procurement-mgmt-root #navbar {
  z-index: 10050;
}
/* All walkthrough / team / feature GIF mockups: thick beige frame + inner white card (see Permit reference) */
.procurement-mgmt-root .gif-mockup,
.procurement-mgmt-root .feature-ui-card {
  background: var(--mock-frame) !important;
  padding: var(--mock-pad) !important;
  border-radius: var(--mock-radius-outer) !important;
  border: 1px solid var(--mock-frame-ring) !important;
  box-shadow:
    0 14px 38px rgba(44, 44, 44, 0.07),
    0 1px 0 rgba(255, 255, 255, 0.55) inset !important;
  /* subtle inner ring, like your screenshot frame */
  box-shadow:
    0 14px 38px rgba(44, 44, 44, 0.07),
    0 1px 0 rgba(255, 255, 255, 0.55) inset,
    0 0 0 1px rgba(196, 184, 157, 0.22) inset !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  line-height: 0 !important;
}
.procurement-mgmt-root .gif-mockup img,
.procurement-mgmt-root .feature-ui-content img {
  border-radius: var(--mock-radius-inner) !important;
  /* White inner screen like the reference screenshot */
  background: #fff !important;
  /* Thin inner edge (warm) so white doesn’t feel “stickered” */
  border: 1px solid rgba(196, 184, 157, 0.26) !important;
  vertical-align: top !important;
}
@media (max-width: 620px) {
  .procurement-mgmt-root .gif-mockup,
  .procurement-mgmt-root .feature-ui-card {
    padding: clamp(5px, 2.2vw, 9px) !important;
    border-radius: 12px !important;
  }
  .procurement-mgmt-root .gif-mockup img,
  .procurement-mgmt-root .feature-ui-content img {
    border-radius: 9px !important;
    border-width: 1px !important;
  }
}
/* CTA + footer: match Vendor / Lease product pages (light surfaces, --dark text, coral primary) */
.procurement-mgmt-root .cta-banner {
  background: var(--band) !important;
  border-top: 1px solid var(--divider) !important;
  border-bottom: 1px solid var(--divider) !important;
}
.procurement-mgmt-root .cta-banner::before {
  top: -60px !important;
  right: -60px !important;
  width: 360px !important;
  height: 360px !important;
  background: radial-gradient(circle, rgba(218, 119, 86, 0.12) 0%, transparent 70%) !important;
}
.procurement-mgmt-root .cta-banner::after {
  bottom: -80px !important;
  left: -90px !important;
  width: 400px !important;
  height: 400px !important;
  background: radial-gradient(circle, rgba(121, 140, 94, 0.08) 0%, transparent 70%) !important;
}
.procurement-mgmt-root .cta-banner h2 {
  color: var(--dark) !important;
}
.procurement-mgmt-root .cta-banner h2 .accent {
  color: var(--primary) !important;
}
.procurement-mgmt-root .cta-banner p {
  color: rgba(44, 44, 44, 0.6) !important;
}
.procurement-mgmt-root .btn-banner-primary {
  background: var(--primary) !important;
  color: var(--on-primary) !important;
  box-shadow: 0 4px 20px rgba(218, 119, 86, 0.4) !important;
}
.procurement-mgmt-root .btn-banner-secondary {
  border: 1.5px solid var(--card-border) !important;
  color: var(--dark) !important;
  background: rgba(246, 244, 238, 0.94) !important;
  font-weight: 600 !important;
}
.procurement-mgmt-root .btn-banner-secondary:hover {
  border-color: var(--primary) !important;
  color: var(--primary) !important;
  background: var(--primary-8) !important;
}
.procurement-mgmt-root footer {
  background: var(--bg) !important;
  border-top: 1px solid var(--card-border) !important;
}
.procurement-mgmt-root .footer-top {
  border-bottom: 1px solid var(--divider) !important;
}
.procurement-mgmt-root .footer-logo-mark {
  color: var(--on-primary) !important;
}
.procurement-mgmt-root .footer-logo-text {
  color: var(--dark) !important;
}
.procurement-mgmt-root .footer-brand-desc {
  color: rgba(44, 44, 44, 0.55) !important;
}
.procurement-mgmt-root .footer-col-title {
  color: rgba(44, 44, 44, 0.45) !important;
}
.procurement-mgmt-root .footer-links a {
  color: rgba(44, 44, 44, 0.65) !important;
}
.procurement-mgmt-root .footer-links a:hover,
.procurement-mgmt-root .footer-links a:focus-visible {
  color: var(--primary) !important;
}
.procurement-mgmt-root .footer-bottom,
.procurement-mgmt-root .footer-bottom-links a {
  color: rgba(44, 44, 44, 0.45) !important;
}
.procurement-mgmt-root .footer-bottom-links a:hover,
.procurement-mgmt-root .footer-bottom-links a:focus-visible {
  color: var(--primary) !important;
}
.procurement-mgmt-root .teams-section,
.procurement-mgmt-root .walkthrough-section,
.procurement-mgmt-root .contact-section {
  background: var(--surface) !important;
}
.procurement-mgmt-root .industries-section {
  background: var(--band) !important;
}
.procurement-mgmt-root .pain-card,
.procurement-mgmt-root .feature-item,
.procurement-mgmt-root .modal,
.procurement-mgmt-root .team-tab-icon,
.procurement-mgmt-root .industry-icon {
  background: var(--surface) !important;
}
.procurement-mgmt-root .team-tab.active {
  background: var(--primary-8) !important;
}
.procurement-mgmt-root .team-tab.active .team-tab-icon {
  background: var(--primary) !important;
  color: var(--on-primary) !important;
}
.procurement-mgmt-root .btn-hero-secondary {
  background: color-mix(in srgb, var(--surface) 78%, transparent) !important;
}
.procurement-mgmt-root .form-input,
.procurement-mgmt-root .form-select,
.procurement-mgmt-root .form-textarea {
  background: var(--surface) !important;
}
.procurement-mgmt-root .btn-primary,
.procurement-mgmt-root .btn-hero-primary,
.procurement-mgmt-root .wt-cta,
.procurement-mgmt-root .btn-banner-primary,
.procurement-mgmt-root .form-submit {
  color: var(--on-primary) !important;
}
.procurement-mgmt-root .feature-item.active .feature-icon-small,
.procurement-mgmt-root .feature-item.active .feature-add-icon {
  color: var(--on-primary) !important;
}
.procurement-mgmt-root .modal-close:hover {
  color: var(--on-primary) !important;
}
/* Standalone HTML uses z-index 5000 for modals; SPA nav is raised above that. */
.procurement-mgmt-root .modal-overlay {
  z-index: 10100;
}
/* The exported HTML adds a global noise overlay on body::before with z-index:9999.
   Inside the SPA this can cover the whole app and make it look blank. Disable it on this route. */
html:has(.procurement-mgmt-root) body::before {
  content: none !important;
  display: none !important;
}
.procurement-mgmt-root h1,
.procurement-mgmt-root h2,
.procurement-mgmt-root h3,
.procurement-mgmt-root h4,
.procurement-mgmt-root h5,
.procurement-mgmt-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
/* Override the global SPA .reveal blur (index.css adds filter:blur(6px)) so the
   procurement page matches the standalone HTML — opacity + translateY only, no blur. */
.procurement-mgmt-root .reveal {
  opacity: 0 !important;
  transform: translateY(24px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.6s ease, transform 0.6s ease !important;
}
.procurement-mgmt-root .reveal.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .procurement-mgmt-root .reveal,
  .procurement-mgmt-root .reveal.visible {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

export default function ProcurementManagementLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [externalScripts, setExternalScripts] = useState<ExternalScript[]>([])
  const [inlineScripts, setInlineScripts] = useState<InlineScript[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const originalTitle = document.title
    document.title = 'Procurement Management - Lockated'

    const originalBg = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#F6F4EE'

    return () => {
      document.title = originalTitle
      document.body.style.backgroundColor = originalBg
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const ts = Date.now()
        const url = `/procurement-management.html?ts=${ts}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${url}`)
        const text = await res.text()

        // Vite SPA fallback returns index.html when missing — sanity check.
        if (!/id=["']?navbar["']?/.test(text) || !/Procurement/i.test(text)) {
          throw new Error(
            'Loaded /procurement-management.html does not look like the procurement page. Ensure the file exists in public/.',
          )
        }

        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')

        let body = doc.body?.innerHTML ?? ''
        if (!body.trim()) {
          const m = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
          if (m?.[1]) body = m[1]
        }
        if (!body.trim()) throw new Error('Could not extract <body> markup.')

        // Strip <script> tags out of the injected body — we re-execute them
        // ourselves after mount so they actually run (innerHTML never executes scripts).
        body = body.replace(/<script[\s\S]*?<\/script>/gi, '')

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        const allScripts = Array.from(doc.querySelectorAll('script'))
        const externals: ExternalScript[] = []
        const inlines: InlineScript[] = []
        for (const s of allScripts) {
          const src = s.getAttribute('src')
          if (src) externals.push({ src })
          else if ((s.textContent ?? '').trim()) inlines.push({ code: s.textContent ?? '' })
        }

        if (cancelled) return
        setCssText(`${styles}\n${PROCUREMENT_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setExternalScripts(externals)
        setInlineScripts(inlines)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Procurement content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Execute the original page scripts after the body markup is mounted.
  useEffect(() => {
    if (!bodyHtml) return

    const created: HTMLScriptElement[] = []

    const appendInlineScripts = () => {
      for (const { code } of inlineScripts) {
        const s = document.createElement('script')
        s.textContent = code
        s.dataset.procurementInline = 'true'
        document.body.appendChild(s)
        created.push(s)
      }
    }

    if (externalScripts.length === 0) {
      appendInlineScripts()
    } else {
      let remaining = externalScripts.length
      const onDone = () => {
        remaining -= 1
        if (remaining === 0) appendInlineScripts()
      }
      for (const { src } of externalScripts) {
        // Reuse if a previous mount already loaded the same external script.
        const existing = document.querySelector<HTMLScriptElement>(
          `script[data-procurement-external="${src}"]`,
        )
        if (existing) {
          onDone()
          continue
        }
        const s = document.createElement('script')
        s.src = src
        s.async = false
        s.dataset.procurementExternal = src
        s.onload = onDone
        s.onerror = onDone
        document.head.appendChild(s)
        created.push(s)
      }
    }

    return () => {
      for (const s of created) {
        if (s.parentNode) s.parentNode.removeChild(s)
      }
    }
  }, [bodyHtml, externalScripts, inlineScripts])

  return (
    <div ref={rootRef} className="procurement-mgmt-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Procurement error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}
