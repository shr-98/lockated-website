import { useEffect, useRef, useState } from 'react'

/**
 * `public/snag-360.html` expects its own reveal animations and section layout.
 * The app has global styles that can unintentionally affect these landing pages
 * (e.g. global reveal blur/filter rules). We isolate Snag360 markup to keep the
 * HTML rendering identical to the standalone reference file.
 */
const SNAG360_ISOLATION_CSS = `
.snag360-root .reveal,
.snag360-root .reveal.in-view {
  filter: none !important;
  will-change: auto !important;
}
@media (prefers-reduced-motion: reduce) {
  .snag360-root .reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

export default function Snag360LandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/snag-360.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /snag-360.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')
        const style = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!style.trim() || !body.trim()) {
          throw new Error('`public/snag-360.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
        setCssText(`${style}\n${SNAG360_ISOLATION_CSS}`)
        setBodyHtml(body)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Snag 360 content')
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
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal on scroll
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('in-view')
          el.classList.add('reveal--in')
          revealObs.unobserve(el)
        })
      },
      { threshold: 0.12 },
    )
    root.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el))

    // Hero counters
    function animateCounter(el: HTMLElement, target: number, suffix: string) {
      let start = 0
      const duration = 2200
      const step = 16
      const increment = target / (duration / step)
      const interval = window.setInterval(() => {
        start += increment
        if (start >= target) {
          start = target
          window.clearInterval(interval)
        }
        el.innerHTML = `${Math.floor(start)}<span class="accent">${suffix}</span>`
      }, step)
      return interval
    }

    let countersStarted = false
    const heroMetrics = root.querySelector('.hero-metrics')
    const counterTimers: number[] = []
    const counterObs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (countersStarted) return
        countersStarted = true
        window.setTimeout(() => {
          const m1 = root.querySelector<HTMLElement>('#m1')
          const m2 = root.querySelector<HTMLElement>('#m2')
          const m3 = root.querySelector<HTMLElement>('#m3')
          if (m1) counterTimers.push(animateCounter(m1, 60, '%'))
          if (m2) counterTimers.push(animateCounter(m2, 4, 'x'))
          if (m3) counterTimers.push(animateCounter(m3, 5, 'hr'))
        }, 200)
        counterObs.disconnect()
      },
      { threshold: 0.5 },
    )
    if (heroMetrics) counterObs.observe(heroMetrics)

    // Clients marquee
    const track = root.querySelector<HTMLElement>('#clientsTrack')
    if (track && track.childElementCount === 0) {
      const clients = [
        { n: 'Godrej Properties', i: 'GP' },
        { n: "L&T Construction", i: 'LT' },
        { n: 'Brigade Group', i: 'BG' },
        { n: 'Tata Projects', i: 'TP' },
        { n: 'Sobha Developers', i: 'SD' },
        { n: 'Prestige Group', i: 'PG' },
        { n: 'DLF Limited', i: 'DL' },
        { n: 'NCC Limited', i: 'NC' },
        { n: 'Shapoorji Pallonji', i: 'SP' },
        { n: 'Lodha Group', i: 'LG' },
      ]

      ;[...clients, ...clients].forEach((c) => {
        const chip = document.createElement('div')
        chip.className = 'client-chip'
        chip.innerHTML = `<div class="client-icon">${c.i}</div><div class="client-name">${c.n}</div>`
        track.appendChild(chip)
      })
    }

    // Bento background cells
    const bg = root.querySelector<HTMLElement>('#bentoBg')
    if (bg && bg.childElementCount === 0) {
      for (let i = 0; i < 30; i++) {
        const c = document.createElement('div')
        c.className = 'bento-bg-cell'
        bg.appendChild(c)
      }
    }
    const bentoTimer = window.setInterval(() => {
      if (!bg) return
      const cells = Array.from(bg.querySelectorAll<HTMLElement>('.bento-bg-cell'))
      if (!cells.length) return
      cells.forEach((c) => c.classList.remove('lit'))
      const count = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < count; i++) {
        cells[Math.floor(Math.random() * cells.length)]?.classList.add('lit')
      }
    }, 2400)

    // USP accordion (HTML uses inline onclick="toggleUSP(this, idx)")
    const showScreen = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.usp-screen').forEach((s, i) => {
        s.classList.toggle('visible', i === idx)
      })
    }
    ;(window as any).toggleUSP = (item: HTMLElement, idx: number) => {
      const isActive = item.classList.contains('active')
      root.querySelectorAll<HTMLElement>('.usp-item').forEach((i) => i.classList.remove('active'))
      if (!isActive) {
        item.classList.add('active')
        showScreen(idx)
      }
    }
    const firstUsp = root.querySelector<HTMLElement>('.usp-item')
    if (firstUsp) {
      firstUsp.classList.add('active')
      showScreen(0)
    }

    // Walkthrough tabs (HTML uses inline onclick="switchTab(idx)")
    ;(window as any).switchTab = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.feature-tab').forEach((t, i) => {
        t.classList.toggle('active', i === idx)
      })
      root.querySelectorAll<HTMLElement>('.feature-panel').forEach((p, i) => {
        p.classList.toggle('active', i === idx)
      })
    }

    // Testimonials card stack (HTML uses inline onclick="goToCard(idx)")
    let currentCard = 0
    const totalCards = 4
    const goToCard = (idx: number) => {
      currentCard = idx
      const cards = root.querySelectorAll<HTMLElement>('.testi-card')
      const dots = root.querySelectorAll<HTMLElement>('.testi-dot')
      cards.forEach((c) => c.classList.remove('card-active', 'card-back1', 'card-back2'))
      dots.forEach((d) => d.classList.remove('active'))
      cards[idx]?.classList.add('card-active')
      cards[(idx + 1) % totalCards]?.classList.add('card-back1')
      cards[(idx + 2) % totalCards]?.classList.add('card-back2')
      dots[idx]?.classList.add('active')
    }
    ;(window as any).goToCard = goToCard
    goToCard(0)
    const testiTimer = window.setInterval(() => goToCard((currentCard + 1) % totalCards), 4500)

    // Use case modals (HTML uses inline onclick="openModal('id')" and closeModal(...))
    ;(window as any).openModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>('#modal-' + id)
      if (!modal) return
      modal.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
    ;(window as any).closeModal = (e: MouseEvent, id: string, force?: boolean) => {
      const modal = root.querySelector<HTMLElement>('#' + id)
      if (!modal) return
      const shouldClose = Boolean(force) || (e?.target && e.target === modal)
      if (!shouldClose) return
      modal.classList.remove('open')
      document.body.style.overflow = ''
    }

    // Team tabs (HTML uses inline onclick="switchTeam(idx)")
    ;(window as any).switchTeam = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.team-tab').forEach((t, i) => {
        t.classList.toggle('active', i === idx)
      })
      root.querySelectorAll<HTMLElement>('.team-content').forEach((c, i) => {
        c.classList.toggle('active', i === idx)
      })
    }

    // Smooth in-page anchors inside this landing page
    const anchorHandlers: Array<{
      a: HTMLAnchorElement
      onClick: (e: MouseEvent) => void
    }> = []
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const onClick = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href) return
        const t = root.querySelector<HTMLElement>(href)
        if (!t) return
        e.preventDefault()
        t.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      a.addEventListener('click', onClick)
      anchorHandlers.push({ a, onClick })
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      root.querySelectorAll<HTMLElement>('.usecase-modal.open').forEach((m) => m.classList.remove('open'))
      document.body.style.overflow = ''
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      revealObs.disconnect()
      counterObs.disconnect()
      window.clearInterval(testiTimer)
      window.clearInterval(bentoTimer)
      counterTimers.forEach((t) => window.clearInterval(t))
      anchorHandlers.forEach(({ a, onClick }) => a.removeEventListener('click', onClick))
      delete (window as any).toggleUSP
      delete (window as any).switchTab
      delete (window as any).goToCard
      delete (window as any).openModal
      delete (window as any).closeModal
      delete (window as any).switchTeam
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="snag360-root min-h-dvh bg-[#F6F4EE]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>Snag 360 error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

