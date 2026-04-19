import { useEffect, useRef, useState } from 'react'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/**
 * Standalone `lease-management.html` matches Vendor Management tokens (cream / band / surface).
 * The app shell's `index.css` adds global `.reveal` blur and Tailwind preflight resets buttons/inputs —
 * mirror `VendorManagementLandingPage` scoping so the route matches the warm theme.
 */
const LEASE_ISOLATION_CSS = `
.lease-management-root {
  --on-primary: #F6F4EE;
}
.lease-management-root .reveal {
  opacity: 0 !important;
  transform: translateY(28px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.65s ease, transform 0.65s ease !important;
}
.lease-management-root .reveal.visible,
.lease-management-root .reveal.reveal--in {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
.lease-management-root h1,
.lease-management-root h2,
.lease-management-root h3,
.lease-management-root h4,
.lease-management-root h5,
.lease-management-root h6 {
  font-family: var(--font), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
@media (prefers-reduced-motion: reduce) {
  .lease-management-root .reveal,
  .lease-management-root .reveal.visible,
  .lease-management-root .reveal.reveal--in {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.lease-management-root .hero {
  background-color: var(--cream) !important;
}
.lease-management-root .pain-section,
.lease-management-root .usps-section,
.lease-management-root .usecase-section,
.lease-management-root .contact-section,
.lease-management-root footer {
  background-color: var(--cream) !important;
}
.lease-management-root .walkthrough-section {
  background-color: var(--band) !important;
}
.lease-management-root .wt-tabs {
  background-color: var(--band) !important;
}
.lease-management-root .wt-tab {
  background-color: transparent !important;
  background-image: none !important;
}
.lease-management-root .wt-tab.active {
  background-color: rgba(218,119,86,0.12) !important;
}
.lease-management-root .teams-section,
.lease-management-root .teams-tabs,
.lease-management-root .banner-section {
  background-color: var(--band) !important;
}
.lease-management-root .team-tab {
  background-color: transparent !important;
  background-image: none !important;
}
.lease-management-root button.role-btn {
  font-family: inherit !important;
  background-color: transparent !important;
  background-image: none !important;
  color: inherit !important;
}
.lease-management-root button.role-btn.active {
  background-color: var(--surface) !important;
  color: var(--dark) !important;
}
.lease-management-root .btn-primary,
.lease-management-root .btn-hero-primary,
.lease-management-root .btn-banner-primary,
.lease-management-root .hero-cta-primary,
.lease-management-root .banner-cta-primary,
.lease-management-root .form-submit {
  color: var(--on-primary) !important;
}
.lease-management-root a.btn-ghost,
.lease-management-root .btn-ghost,
.lease-management-root .hero-cta-secondary,
.lease-management-root .banner-cta-ghost {
  background-color: transparent !important;
}
.lease-management-root .form-group input,
.lease-management-root .form-group select,
.lease-management-root .form-group textarea {
  background-color: var(--surface) !important;
  color: var(--dark) !important;
}
.lease-management-root .form-group input:-webkit-autofill,
.lease-management-root .form-group input:-webkit-autofill:hover,
.lease-management-root .form-group input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface) inset !important;
  box-shadow: 0 0 0 1000px var(--surface) inset !important;
  -webkit-text-fill-color: var(--dark) !important;
}
.lease-management-root .contact-map {
  background-color: var(--surface) !important;
}
/* Panels / mocks: preflight or UA must not read as printer-white */
.lease-management-root .pain-card:hover {
  background-color: var(--surface) !important;
}
.lease-management-root .usp-panel-card,
.lease-management-root .mock-kpi,
.lease-management-root .mock-list-item,
.lease-management-root .mock-kanban-card,
.lease-management-root .wt-screen,
.lease-management-root .uc-modal-stat {
  background-color: var(--surface) !important;
}
`

export default function LeaseManagementLandingPage() {
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
        const res = await fetch('/lease-management.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /lease-management.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/lease-management.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${LEASE_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Lease Management content')
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

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal on scroll
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
        }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    root.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

    // Countdown
    function animateCounter(el: Element) {
      const ht = el as HTMLElement
      const target = Number.parseInt(ht.dataset.target || '', 10)
      const suffix = ht.dataset.suffix || ''
      if (!Number.isFinite(target)) return
      let current = 0
      const increment = target / 60
      const timer = window.setInterval(() => {
        current = Math.min(current + increment, target)
        ht.textContent = `${Math.floor(current)}${suffix}`
        if (current >= target) window.clearInterval(timer)
      }, 16)
    }
    const countdown = root.querySelector('.hero-countdown')
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).querySelectorAll('[data-target]').forEach(animateCounter)
            counterObserver.unobserve(e.target)
          }
        })
      },
      { threshold: 0.5 },
    )
    if (countdown) counterObserver.observe(countdown)

    // Use-case modals (HTML uses onclick="openUCModal('...')".)
    ;(window as unknown as { openUCModal: (id: string) => void }).openUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>('#modal-' + id)
      if (modal) {
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
      }
    }
    ;(window as unknown as { closeUCModal: (id: string) => void }).closeUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>('#modal-' + id)
      if (modal) {
        modal.classList.remove('open')
        document.body.style.overflow = ''
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        root.querySelectorAll<HTMLElement>('.uc-modal.open').forEach((m) => m.classList.remove('open'))
        document.body.style.overflow = ''
      }
    }
    document.addEventListener('keydown', onKeyDown)

    const cleanups: Array<() => void> = []

    // Role switcher (Lessee / Lessor)
    root.querySelectorAll<HTMLButtonElement>('.role-btn').forEach((btn) => {
      const handler = () => {
        const role = btn.dataset.role
        if (!role) return
        root.querySelectorAll('.role-btn').forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        root.querySelectorAll<HTMLElement>('[data-role-layout]').forEach((layout) => {
          layout.style.display = layout.dataset.roleLayout === role ? 'grid' : 'none'
        })
      }
      btn.addEventListener('click', handler)
      cleanups.push(() => btn.removeEventListener('click', handler))
    })

    // USP tabs — scoped to each [data-role-layout] block
    root.querySelectorAll<HTMLElement>('.usp-tab').forEach((tab) => {
      const handler = () => {
        const panelId = tab.dataset.panel
        const layout = tab.closest<HTMLElement>('[data-role-layout]')
        if (!panelId || !layout) return
        layout.querySelectorAll('.usp-tab').forEach((t) => t.classList.remove('active'))
        layout.querySelectorAll('.usp-panel').forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        const panel = root.querySelector<HTMLElement>('#' + CSS.escape(panelId))
        panel?.classList.add('active')
        layout.querySelectorAll<HTMLElement>('.mock-progress-fill').forEach((bar) => {
          const w = bar.style.width
          bar.style.width = '0'
          window.setTimeout(() => {
            bar.style.width = w
          }, 50)
        })
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    // Walkthrough tabs
    root.querySelectorAll<HTMLElement>('.wt-tab').forEach((tab) => {
      const handler = () => {
        const panelId = tab.dataset.wt
        if (!panelId) return
        root.querySelectorAll('.wt-tab').forEach((t) => t.classList.remove('active'))
        root.querySelectorAll('.wt-panel').forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        root.querySelector<HTMLElement>('#' + CSS.escape(panelId))?.classList.add('active')
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    // Team tabs
    root.querySelectorAll<HTMLElement>('.team-tab').forEach((tab) => {
      const handler = () => {
        const panelId = tab.dataset.team
        if (!panelId) return
        root.querySelectorAll('.team-tab').forEach((t) => t.classList.remove('active'))
        root.querySelectorAll('.team-panel').forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        root.querySelector<HTMLElement>('#' + CSS.escape(panelId))?.classList.add('active')
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    // In-page anchor links (smooth scroll within app shell)
    const anchorAbort = new AbortController()
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const onClick = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href || href === '#') return
        const target = root.querySelector<HTMLElement>(href)
        if (!target) return
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      a.addEventListener('click', onClick, { signal: anchorAbort.signal })
    })

    return () => {
      cleanups.forEach((fn) => fn())
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      revealObserver.disconnect()
      counterObserver.disconnect()
      anchorAbort.abort()
      delete (window as unknown as { openUCModal?: unknown }).openUCModal
      delete (window as unknown as { closeUCModal?: unknown }).closeUCModal
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="lease-management-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Lease Management error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}
