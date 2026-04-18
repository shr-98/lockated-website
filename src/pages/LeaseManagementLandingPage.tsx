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

    // Testimonials carousel (matches inline script in reference HTML)
    const testiData = [
      {
        quote:
          "Month-end rent reconciliation used to take my Finance team four days. With Lockated it's a half-day. The GST-compliant invoices alone save us three working hours per property per month. The data sovereignty was non-negotiable for our board — and Lockated was the only platform that didn't store our data on their cloud.",
        name: 'Ananya Mehta',
        role: 'VP Corporate Real Estate, FMCG Enterprise',
        initials: 'AM',
        sector: 'Corporate',
      },
      {
        quote:
          'The compliance module alone was worth it. We had three documents expire before Lockated. In the 14 months since, zero. Our internal audit team actually congratulated us.',
        name: 'Priya Kulkarni',
        role: 'Head of Real Estate, Pharmacy Chain',
        initials: 'PK',
        sector: 'Retail',
      },
      {
        quote:
          'We were tracking 150 branch leases on five Excel files. Lockated gave us one dashboard and our Head of RE finally stopped getting called at 11pm about expiry dates.',
        name: 'Rajesh Sharma',
        role: 'CFO, Mid-size NBFC',
        initials: 'RS',
        sector: 'BFSI',
      },
      {
        quote:
          'Before Lockated, our AMC contracts lived in a shared drive nobody updated. In the first quarter we identified three expired contracts we were still paying for. The vendor performance scores completely changed how we select and retain service partners across our facilities.',
        name: 'Vikram Nair',
        role: 'Head of Facilities, IT/ITeS Company',
        initials: 'VN',
        sector: 'IT/ITeS',
      },
    ]

    const stack = root.querySelector<HTMLElement>('#testiStack')
    const btnNext = root.querySelector<HTMLElement>('#testiBtnNext')
    const btnPrev = root.querySelector<HTMLElement>('#testiBtnPrev')
    const testiDots = root.querySelectorAll<HTMLElement>('.testi-dot')

    let testiIdx = 0
    const setTesti = (idx: number) => {
      if (!stack) return
      testiIdx = (idx + testiData.length) % testiData.length
      const d = testiData[testiIdx]
      const front = stack.querySelector<HTMLElement>('.testi-card:last-child')
      if (!front) return
      front.innerHTML = `
    <div class="testi-quote-mark">"</div>
    <p class="testi-text">${d.quote.replace(/</g, '&lt;')}</p>
    <div class="testi-author">
      <div class="testi-avatar">${d.initials}</div>
      <div><div class="testi-name">${d.name.replace(/</g, '&lt;')}</div><div class="testi-role">${d.role.replace(/</g, '&lt;')}</div></div>
      <span class="testi-company-badge">${d.sector.replace(/</g, '&lt;')}</span>
    </div>`
      testiDots.forEach((dot, i) => dot.classList.toggle('active', i === testiIdx))
    }

    const onNext = () => setTesti(testiIdx + 1)
    const onPrev = () => setTesti(testiIdx - 1)
    btnNext?.addEventListener('click', onNext)
    btnPrev?.addEventListener('click', onPrev)
    if (btnNext) cleanups.push(() => btnNext.removeEventListener('click', onNext))
    if (btnPrev) cleanups.push(() => btnPrev.removeEventListener('click', onPrev))

    testiDots.forEach((dot, i) => {
      const h = () => setTesti(i)
      dot.addEventListener('click', h)
      cleanups.push(() => dot.removeEventListener('click', h))
    })

    const testiInterval = window.setInterval(() => setTesti(testiIdx + 1), 5000)

    return () => {
      window.clearInterval(testiInterval)
      cleanups.forEach((fn) => fn())
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      revealObserver.disconnect()
      counterObserver.disconnect()
      delete (window as unknown as { openUCModal?: unknown }).openUCModal
      delete (window as unknown as { closeUCModal?: unknown }).closeUCModal
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

