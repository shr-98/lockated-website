import { useEffect, useRef, useState } from 'react'

/** Scoped overrides: global `index.css` `.reveal` uses blur; this page uses `.visible`. */
const LEASE_ISOLATION_CSS = `
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
@media (prefers-reduced-motion: reduce) {
  .lease-management-root .reveal,
  .lease-management-root .reveal.visible,
  .lease-management-root .reveal.reveal--in {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
.lease-management-root .pain-section,
.lease-management-root .usps-section,
.lease-management-root .usecase-section,
.lease-management-root .contact-section {
  background-color: var(--cream) !important;
}
.lease-management-root .walkthrough-section,
.lease-management-root .teams-section,
.lease-management-root .banner-section {
  background-color: var(--band) !important;
}
.lease-management-root .form-group input,
.lease-management-root .form-group select,
.lease-management-root .form-group textarea {
  background-color: #fff !important;
  color: var(--dark) !important;
}
`

export default function LeaseManagementLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/lease-management.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /lease-management.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')
        const style = doc.querySelector('style')?.textContent ?? ''
        const body = doc.body?.innerHTML ?? ''

        if (!style.trim() || !body.trim()) {
          throw new Error('`public/lease-management.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
        setCssText(`${style}\n${LEASE_ISOLATION_CSS}`)
        setBodyHtml(body)
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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

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
