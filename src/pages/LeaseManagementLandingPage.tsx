import { useEffect, useRef, useState } from 'react'

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
        setCssText(style)
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
    // Note: global app CSS uses `.reveal { filter: blur(...) }` and removes it with `.reveal--in`.
    // This landing page HTML uses `.visible`, so we add both to keep it crisp.
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

    // Use-case modals (required because the HTML uses inline onclick="openUCModal('...')").
    ;(window as any).openUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>('#modal-' + id)
      if (modal) {
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
      }
    }
    ;(window as any).closeUCModal = (id: string) => {
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

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      revealObserver.disconnect()
      counterObserver.disconnect()
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef}>
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

