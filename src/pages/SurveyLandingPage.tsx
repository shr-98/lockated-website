import { useEffect, useRef, useState } from 'react'
import { LandingPageLoader } from '../components/LandingPageLoader'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]
type ExternalScript = { src: string }
type InlineScript = { code: string }

const SURVEY_NAV_OFFSET_PX = 70

/**
 * `public/survey-landing.html` is a self-contained design with its own fixed nav,
 * fonts, and inline `<script>` (counters, reveal observer, walkthrough/feature
 * tabs, scroll-driven team panels, industry modal). We fetch it, inject styles
 * + body, then execute the inline scripts so the original behavior runs unmodified.
 */
const SURVEY_ISOLATION_CSS = `
.survey-root {
  position: relative;
  isolation: isolate;
}
html:has(.survey-root) {
  scroll-padding-top: ${SURVEY_NAV_OFFSET_PX}px;
  scrollbar-gutter: stable;
}
.survey-root section[id] {
  scroll-margin-top: ${SURVEY_NAV_OFFSET_PX + 4}px;
}
.survey-root #navbar {
  z-index: 10050;
}
/* The exported HTML adds a global noise overlay on body::before. Disable it on this route. */
body::before {
  content: none !important;
  display: none !important;
}
.survey-root h1,
.survey-root h2,
.survey-root h3,
.survey-root h4,
.survey-root h5,
.survey-root h6 {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
/* Override the global SPA .reveal blur (index.css adds filter:blur(6px)) so this
   page matches the standalone HTML — opacity + translateY only, no blur. */
.survey-root .reveal {
  opacity: 0 !important;
  transform: translateY(24px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.65s ease, transform 0.65s ease !important;
}
.survey-root .reveal.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .survey-root .reveal,
  .survey-root .reveal.visible {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

export default function SurveyLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [externalScripts, setExternalScripts] = useState<ExternalScript[]>([])
  const [inlineScripts, setInlineScripts] = useState<InlineScript[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const ts = Date.now()
        const url = `/survey-landing.html?ts=${ts}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${url}`)
        const text = await res.text()

        if (!/id=["']?navbar["']?/.test(text) || !/Survey/i.test(text)) {
          throw new Error(
            'Loaded /survey-landing.html does not look like the Survey page. Ensure the file exists in public/.',
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

        // Strip <script> tags out of injected body — re-execute them after mount.
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
        setCssText(`${styles}\n${SURVEY_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setExternalScripts(externals)
        setInlineScripts(inlines)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Survey content')
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
        s.dataset.surveyInline = 'true'
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
        const existing = document.querySelector<HTMLScriptElement>(
          `script[data-survey-external="${src}"]`,
        )
        if (existing) {
          onDone()
          continue
        }
        const s = document.createElement('script')
        s.src = src
        s.async = false
        s.dataset.surveyExternal = src
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

  useEffect(() => {
    const original = document.title
    document.title = 'Survey by Lockated | Lockated'
    return () => {
      document.title = original
    }
  }, [])

  return (
    <div ref={rootRef} className="survey-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Survey error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <LandingPageLoader />
      )}
    </div>
  )
}
