import { useEffect, useRef, useState } from 'react'
import { LandingPageLoader } from '../components/LandingPageLoader'
import { hookLeadForm } from '../lib/leadCapture'

/**
 * `public/gate-management.html` is a self-unpacking design bundle (59MB of
 * base64-gzipped assets) that decodes itself client-side and replaces
 * `document.documentElement`. We cannot inject it inline (it would clobber the
 * React app), so we render it inside a full-viewport iframe sandboxed to its
 * own document.
 *
 * After the bundle unpacks we inject CSS overrides to bring the dark
 * `.cta-banner` and `footer` in line with the warm UI theme guideline.
 */

const WARM_OVERRIDES = `
/* ── Warm-theme overrides injected by GateManagementLandingPage ── */

/* White sections → warm surface */
.walkthrough-section,
.teams-section,
.contact-section {
  background: #F0EAE1 !important;
}

/* Dark CTA banner → warm band */
.cta-banner {
  background: #E8E2D6 !important;
}
.cta-banner h2 {
  color: #2C2C2C !important;
}
.cta-banner p {
  color: rgba(44,44,44,0.66) !important;
}
.btn-banner-secondary {
  color: #2C2C2C !important;
  border-color: #C4B89D !important;
  background: rgba(44,44,44,0.06) !important;
}

/* Dark footer → warm bg */
footer {
  background: #F6F4EE !important;
  border-top: 1px solid #C4B89D !important;
  color: #2C2C2C !important;
}
/* Catch-all: every element inside footer gets dark text */
footer * {
  color: #2C2C2C !important;
}
footer a:hover,
.footer-link:hover {
  color: #DA7756 !important;
}
.footer-logo-text {
  color: #2C2C2C !important;
}
.footer-brand-desc {
  color: rgba(44,44,44,0.75) !important;
}
.footer-badge {
  color: #2C2C2C !important;
  border-color: #C4BCAD !important;
}
.footer-col-title {
  color: #2C2C2C !important;
}
.footer-link {
  color: rgba(44,44,44,0.85) !important;
}
.footer-bottom {
  border-color: #C4BCAD !important;
  color: rgba(44,44,44,0.7) !important;
}

/* White modal → warm bg */
.modal-box {
  background: #F6F4EE !important;
}
`

function injectWarmOverrides(doc: Document) {
  if (doc.getElementById('lockated-warm-overrides')) return
  const style = doc.createElement('style')
  style.id = 'lockated-warm-overrides'
  style.textContent = WARM_OVERRIDES
  ;(doc.head || doc.documentElement).appendChild(style)
}

export default function GateManagementLandingPage() {
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // Reflect iframe document title in the parent tab.
  useEffect(() => {
    const original = document.title
    document.title = 'Gate Management Platform | Lockated'
    const root = iframeRef.current
    const cleanupLeadForm = hookLeadForm(root, 'gate-management')
    return () => {
      document.title = original
      cleanupLeadForm()
    }
  }, [])

  // After the iframe's initial load the bundle is still unpacking. Poll until
  // the actual content is ready (footer appears), then inject warm overrides.
  useEffect(() => {
    if (!loaded) return
    const iframe = iframeRef.current
    if (!iframe) return

    let attempts = 0
    const MAX = 40 // 20s max

    const id = setInterval(() => {
      attempts++
      try {
        const doc = iframe.contentDocument
        if (!doc) return
        // Bundle has unpacked when footer is present in the real document
        if (doc.querySelector('footer')) {
          injectWarmOverrides(doc)
          clearInterval(id)
          return
        }
      } catch {
        // cross-origin guard — shouldn't happen since same origin
      }
      if (attempts >= MAX) clearInterval(id)
    }, 500)

    return () => clearInterval(id)
  }, [loaded])

  return (
    <div className="gate-mgmt-root" style={{ position: 'relative', minHeight: '100dvh', background: '#F6F4EE' }}>
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <LandingPageLoader />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/gate-management.html"
        title="Gate Management"
        onLoad={() => setLoaded(true)}
        style={{
          display: 'block',
          width: '100%',
          height: '100dvh',
          border: 0,
          background: '#F6F4EE',
        }}
      />
    </div>
  )
}
