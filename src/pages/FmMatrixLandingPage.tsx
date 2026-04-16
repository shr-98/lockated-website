import { useEffect, useRef, useState } from 'react'

export default function FmMatrixLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/fm-matrix.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /fm-matrix.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')
        const style = doc.querySelector('style')?.textContent ?? ''
        const body = doc.body?.innerHTML ?? ''

        if (!style.trim() || !body.trim()) {
          throw new Error('`public/fm-matrix.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
        setCssText(style)
        setBodyHtml(body)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load FM Matrix content')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl) return
    if (!bodyHtml) return
    const root = rootEl

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Reveal on scroll (also add `reveal--in` to avoid global blur reveal)
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
        }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )
    root.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

    // Counters
    function animateCounters() {
      root.querySelectorAll<HTMLElement>('[data-target]').forEach((el) => {
        const t = Number.parseInt(el.dataset.target || '', 10)
        const s = el.dataset.suffix || ''
        if (!Number.isFinite(t)) return
        let c = 0
        const inc = t / 60
        const timer = window.setInterval(() => {
          c += inc
          if (c >= t) {
            c = t
            window.clearInterval(timer)
          }
          el.textContent = `${Math.floor(c)}${s}`
        }, 25)
      })
    }
    const metrics = root.querySelector('.hero-metrics')
    const countersObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          animateCounters()
          countersObserver.unobserve(e.target)
        })
      },
      { threshold: 0.5 },
    )
    if (metrics) countersObserver.observe(metrics)

    // Solutions accordion
    root.querySelectorAll<HTMLElement>('.solution-item').forEach((item) => {
      const header = item.querySelector<HTMLElement>('.solution-header')
      header?.addEventListener('click', () => {
        root.querySelectorAll<HTMLElement>('.solution-item').forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
      })
    })

    // Testimonials deck
    let ct = 0
    const tc = Array.from(root.querySelectorAll<HTMLElement>('.testi-card'))
    const td = Array.from(root.querySelectorAll<HTMLElement>('.testi-dot'))
    const ut = (i: number) => {
      ct = i
      tc.forEach((c, j) => {
        const o = (j - i + tc.length) % tc.length
        c.style.zIndex = String(tc.length - o)
        c.style.transform = `translateY(${o * 16}px) scale(${1 - o * 0.03})`
        c.style.opacity = o === 0 ? '1' : o === 1 ? '0.7' : o === 2 ? '0.4' : '0.2'
      })
      td.forEach((d, j) => d.classList.toggle('active', j === i))
    }
    td.forEach((d) => {
      d.addEventListener('click', () => ut(Number.parseInt(d.dataset.index || '0', 10)))
    })
    const testimonialTimer = window.setInterval(() => {
      if (tc.length) ut((ct + 1) % tc.length)
    }, 4500)

    // Walkthrough tabs
    type WalkthroughDatum = { title: string; name: string; desc: string; highlights: string[] }
    const wd: WalkthroughDatum[] = [
      {
        title: 'Helpdesk — Live Ticket Dashboard',
        name: 'Intelligent Helpdesk',
        desc: 'Every maintenance request lands in a single, intelligent queue — auto-categorised, auto-assigned, and tracked through five escalation levels. No ticket stagnates. No technician is overloaded.',
        highlights: [
          '5-level auto-escalation with configurable TAT per level',
          'Smart assignment based on skill, location, and workload',
          'Integrated cost approval for spend above threshold',
          'Real-time SLA dashboard with breach prediction',
        ],
      },
      {
        title: 'CAM Billing — Invoice Generator',
        name: 'Automated CAM Billing',
        desc: 'Auto-calculate Common Area Maintenance charges from tenant occupancy data, generate invoices in one click, and track payments in real-time. No spreadsheets. No disputes. No 12-day billing cycles.',
        highlights: [
          'Auto-calculation from occupancy data and billing rules',
          'One-click invoice generation and distribution',
          'Payment tracking with automated reminders',
          'Complete audit trail for every charge',
        ],
      },
      {
        title: 'Compliance — Certificate Tracker',
        name: 'Compliance Automation',
        desc: 'Every fire NOC, lift inspection, AMC renewal, and statutory certificate tracked in one registry with multi-channel alerts to FM teams, admin staff, and vendors — well before renewal deadlines hit.',
        highlights: [
          'Automated multi-channel renewal alerts',
          'Direct email triggers to AMC vendors',
          'Real-time compliance status dashboard',
          'Full audit trail for regulatory submissions',
        ],
      },
      {
        title: 'Visitor & Gate — Access Control',
        name: 'Visitor & Gate Management',
        desc: 'Face-scan entry for pre-approved staff, digital passes for visitors, QR checkpoint patrolling with missed-scan alerts, and complete vehicle tracking — all in a single, tamper-proof security module.',
        highlights: [
          'Face-scan gate entry for approved staff',
          'Digital visitor passes with pre-registration',
          'QR checkpoint patrolling with accountability alerts',
          'Registered and guest vehicle tracking',
        ],
      },
      {
        title: 'Asset — Lifecycle Management',
        name: 'Asset Lifecycle Management',
        desc: 'Register, tag, and track every asset from installation to disposal. Link components with EBOM, monitor warranties, calculate total cost of ownership, and make data-driven repair-vs-replace decisions.',
        highlights: [
          'EBOM — Engineering Bill of Materials per asset',
          'Warranty & AMC alert management',
          'Total cost of ownership tracking',
          'Associated assets linking for dependency awareness',
        ],
      },
      {
        title: 'Utility — Energy & Water Dashboard',
        name: 'Energy & Utility Monitoring',
        desc: 'Track electricity consumption, detect water leaks, log waste generation by type, and monitor STP operations — all from a single Utility dashboard that makes ESG reporting effortless.',
        highlights: [
          'Energy anomaly detection and alerts',
          'Water management with leak detection',
          'Waste categorisation — organic, recyclable, hazardous',
          'Green Inventory for ESG compliance reporting',
        ],
      },
    ]

    root.querySelectorAll<HTMLElement>('.walk-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        root.querySelectorAll<HTMLElement>('.walk-tab').forEach((t) => t.classList.remove('active'))
        tab.classList.add('active')
        const i = Number.parseInt(tab.dataset.walk || '0', 10)
        const d = wd[i] ?? wd[0]
        const title = root.querySelector<HTMLElement>('#walkScreenTitle')
        const name = root.querySelector<HTMLElement>('#walkFeatureName')
        const desc = root.querySelector<HTMLElement>('#walkFeatureDesc')
        const highlights = root.querySelector<HTMLElement>('#walkHighlights')
        if (title) title.textContent = d.title
        if (name) name.textContent = d.name
        if (desc) desc.textContent = d.desc
        if (highlights) {
          highlights.innerHTML = d.highlights
            .map(
              (h: string) =>
                `<div class="walk-highlight-item"><div class="walk-highlight-check"><i class="fas fa-check"></i></div><span>${h}</span></div>`,
            )
            .join('')
        }
      })
    })

    // Smooth anchor scroll for in-page links
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href')
        if (!href) return
        const t = root.querySelector<HTMLElement>(href)
        if (!t) return
        e.preventDefault()
        t.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      revealObserver.disconnect()
      countersObserver.disconnect()
      window.clearInterval(testimonialTimer)
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>FM Matrix error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

