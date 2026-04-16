import { useEffect, useRef, useState } from 'react'

type IndustryDatum = {
  eyebrow: string
  title: string
  company: string
  body: string
  features: string[]
  metrics: { val: string; label: string }[]
}

export default function LoyaltyRuleEngineLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/loyalty-rule-engine.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /loyalty-rule-engine.html (${res.status})`)
        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/loyalty-rule-engine.html` must contain <style> and full <body> markup.')
        }

        if (cancelled) return
        setCssText(styles)
        setBodyHtml(body)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Loyalty Rule Engine content')
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

    // NAV SCROLL
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // HERO ANIMATIONS
    const t1 = window.setTimeout(() => {
      const eyebrow = root.querySelector<HTMLElement>('#hero-eyebrow')
      if (!eyebrow) return
      eyebrow.style.transition = 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
      eyebrow.style.opacity = '1'
      eyebrow.style.transform = 'translateY(0)'
    }, 200)
    const t2 = window.setTimeout(() => {
      const h1 = root.querySelector<HTMLElement>('#hero-headline')
      if (!h1) return
      h1.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      h1.style.opacity = '1'
      h1.style.transform = 'translateY(0)'
    }, 400)
    const t3 = window.setTimeout(() => {
      const sub = root.querySelector<HTMLElement>('#hero-sub')
      if (!sub) return
      sub.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      sub.style.opacity = '1'
      sub.style.transform = 'translateY(0)'
    }, 600)
    const t4 = window.setTimeout(() => {
      const ctas = root.querySelector<HTMLElement>('#hero-ctas')
      if (!ctas) return
      ctas.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      ctas.style.opacity = '1'
      ctas.style.transform = 'translateY(0)'
    }, 750)
    const t5 = window.setTimeout(() => {
      const sub2 = root.querySelector<HTMLElement>('#hero-sub2')
      if (!sub2) return
      sub2.style.transition = 'all 0.8s ease'
      sub2.style.opacity = '1'
    }, 900)

    function animateCounters() {
      const counters = [
        { selector: '#cnt1', target: 30, duration: 1500, decimals: 0 },
        { selector: '#cnt2', target: 43, duration: 1800, decimals: 0 },
        { selector: '#cnt3', target: 3.2, duration: 1200, decimals: 1 },
        { selector: '#cnt4', target: 1, duration: 800, decimals: 0 },
      ] as const

      counters.forEach((c) => {
        const el = root.querySelector<HTMLElement>(c.selector)
        if (!el) return
        const start = Date.now()
        const timer = window.setInterval(() => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / c.duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const val = eased * c.target
          el.textContent = c.decimals ? val.toFixed(c.decimals) : String(Math.round(val))
          if (progress >= 1) window.clearInterval(timer)
        }, 16)
      })
    }

    const t6 = window.setTimeout(() => {
      const metrics = root.querySelector<HTMLElement>('#hero-metrics')
      if (!metrics) return
      metrics.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      metrics.style.opacity = '1'
      metrics.style.transform = 'translateY(0)'
      animateCounters()
    }, 1000)

    // USP ACCORDION + VISUAL
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    uspItems.forEach((item) => {
      item.addEventListener('click', () => {
        const screenId = item.getAttribute('data-screen')
        uspItems.forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
        uspScreens.forEach((s) => s.classList.remove('visible'))
        if (screenId) root.querySelector<HTMLElement>('#' + screenId)?.classList.add('visible')
      })
    })

    // WALKTHROUGH TABS
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    featureTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const feat = tab.getAttribute('data-feature')
        featureTabs.forEach((t) => t.classList.remove('active'))
        tab.classList.add('active')
        featurePanels.forEach((p) => p.classList.remove('active'))
        if (feat) root.querySelector<HTMLElement>('#fp-' + feat)?.classList.add('active')
      })
    })

    // TESTIMONIALS
    let currentTesti = 0
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.testi-card'))
    const dots = Array.from(root.querySelectorAll<HTMLElement>('.testi-dot'))
    const classes = ['card-active', 'card-back1', 'card-back2', 'card-back3']
    const showTesti = (idx: number) => {
      cards.forEach((c, i) => {
        c.classList.remove('card-active', 'card-back1', 'card-back2', 'card-back3')
        const offset = (i - idx + cards.length) % cards.length
        if (offset < classes.length) c.classList.add(classes[offset]!)
      })
      dots.forEach((d, i) => d.classList.toggle('active', i === idx))
      currentTesti = idx
    }
    dots.forEach((d, i) => d.addEventListener('click', () => showTesti(i)))
    const testiTimer = window.setInterval(() => {
      if (!cards.length) return
      showTesti((currentTesti + 1) % cards.length)
    }, 4000)
    showTesti(0)

    // TEAMS TABS
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.team-panel'))
    teamTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const t = tab.getAttribute('data-team')
        teamTabs.forEach((x) => x.classList.remove('active'))
        tab.classList.add('active')
        teamPanels.forEach((p) => p.classList.remove('active'))
        if (t) root.querySelector<HTMLElement>('#tp-' + t)?.classList.add('active')
      })
    })

    // INDUSTRY POPUP DATA + handlers (for inline onclick)
    const industryData: Record<string, IndustryDatum> = {
      realestate: {
        eyebrow: 'Real Estate & Property Development',
        title: 'Incentivise early payment. Automate your referral programme. Capture repeat buyer value.',
        company: 'Rank 1 — Highest relevance. Live in production with a major Indian developer.',
        body: "Real estate is where the platform was born. Demand note payment rules fire the moment a customer pays — no manual tracking, no delayed bonuses. Gold tier members who pay within 5 days of a demand note earn 6,000 points automatically. Your referral programme tracks three stages: referral logged, site visit, booking confirmed. Points credit on booking — not weeks later. Encashment lets customers offset points against outstanding instalments, which directly improves collections TAT.",
        features: ['Transaction Events', 'Referral Rules', 'Escrow Wallet', 'Encashment', 'CRM Integration'],
        metrics: [
          { val: '38→22', label: 'Days to collect (TAT)' },
          { val: '3.2x', label: 'Referral leads growth' },
          { val: '44%', label: 'Redemption rate' },
        ],
      },
      bfsi: {
        eyebrow: 'Banking, Financial Services & Insurance',
        title: 'Reduce delinquency. Drive cross-sell. Give your CFO escrow-grade controls.',
        company: 'Rank 2 — High urgency. RBI compliance angle opens enterprise doors.',
        body: 'BFSI is the second priority vertical. EMI on-time payment rules create a measurable delinquency reduction — 1% improvement on a ₹5,000Cr loan book reduces NPA provisioning by ₹50Cr. Cross-sell rules reward customers for taking a second product within 90 days. The escrow wallet aligns directly with RBI expectations for loyalty liability management, removing the compliance objection that kills most loyalty programme proposals in finance-regulated industries.',
        features: ['EMI Payment Rules', 'Cross-Sell Triggers', 'Escrow Wallet', 'Segments Engine', 'Compliance Reports'],
        metrics: [
          { val: '+84%', label: 'Cross-sell rate improvement' },
          { val: '₹50Cr', label: 'NPA reduction at 1% improvement' },
          { val: '25%', label: 'Mandatory escrow float' },
        ],
      },
      auto: {
        eyebrow: 'Automotive — OEMs & Dealer Groups',
        title: 'Bring customers back for service. Every service visit is revenue you own.',
        company: 'Rank 3 — High urgency. Aftersales loyalty is completely unaddressed.',
        body: 'Automotive aftersales revenue has 30–40% gross margin vs 3–5% on vehicle sales. A dealer losing service customers to multi-brand workshops is leaving its most profitable revenue on the table. First-service capture rules fire when a customer attends their first scheduled service — 2,000 points, plus 500 bonus if booked through the app. Insurance renewal rules trigger 45 days before expiry, creating a loyalty-driven retention moment. Three-year service streak milestones drive long-term aftersales relationships.',
        features: ['Service Visit Rules', 'Insurance Renewal', 'App Booking Rewards', 'Referral Tracking', 'Milestones'],
        metrics: [
          { val: '+55%', label: 'Aftersales revenue per vehicle' },
          { val: '3.5x', label: 'Service booking adoption (app)' },
          { val: '15%', label: 'Referral-sourced new sales' },
        ],
      },
      hospitality: {
        eyebrow: 'Hotels, Resorts & Members Clubs',
        title: 'Direct bookings over OTAs. Guest loyalty that drives RevPAR.',
        company: 'Rank 4 — Medium urgency. Mid-market opportunity outside enterprise chains.',
        body: 'Mid-market hotels lose 15–25% of room revenue to OTA commissions every year. A loyalty programme that rewards direct bookings — and gives guests a personalised mobile redemption experience at check-in — shifts that share back. Time-based rules auto-activate double-points weekends. Milestone rules fire at the 10th stay. Lounge access and experiences are native redemption categories. Marketing cannot change rules in the PMS without vendor support — our no-code interface solves this.',
        features: ['Direct Booking Rules', 'Stay Milestones', 'Time-Based Promos', 'Lounge Access', 'Mobile Redemption'],
        metrics: [
          { val: '22%', label: 'More spend per loyal guest stay' },
          { val: '60%', label: 'Lower acquisition cost vs OTA' },
          { val: '40%', label: 'Direct booking share improvement' },
        ],
      },
      retail: {
        eyebrow: 'Organised Retail & D2C Brands',
        title: 'Frequency rules, win-back triggers, and birthday multipliers that work.',
        company: 'Rank 5 — Medium urgency. Mid-market D2C outgrowing basic loyalty SaaS.',
        body: 'Retail loyalty fails when every customer earns the same rate regardless of spend. Our segment engine creates differentiated multipliers — premium members earn 2x, first-purchase customers get a 7-day window campaign. Win-back rules fire automatically on Day 90 of inactivity with provisional points that expire in 14 days. Birthday month rules deliver 3x points across the entire birth month — not just the birthday. These mechanics are configurable without IT in hours.',
        features: ['Purchase Frequency Rules', 'Win-Back Triggers', 'Birthday Multiplier', 'Segment Rules', 'Festive Windows'],
        metrics: [
          { val: '8x', label: 'CLV for 10+ purchase customers' },
          { val: '25%', label: 'Win-back activation rate' },
          { val: '40%', label: 'Birthday month engagement lift' },
        ],
      },
    }

    ;(window as any).openIndustry = (id: string) => {
      const data = industryData[id]
      if (!data) return
      const popupBody = root.querySelector<HTMLElement>('#popupBody')
      const popup = root.querySelector<HTMLElement>('#industryPopup')
      if (!popupBody || !popup) return
      const html = `
        <div class="popup-eyebrow">${data.eyebrow}</div>
        <div class="popup-title">${data.title}</div>
        <div class="popup-company">${data.company}</div>
        <div class="popup-body">${data.body}</div>
        <div class="popup-features">${data.features
          .map(
            (f) =>
              `<div class="popup-feature"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${f}</div>`,
          )
          .join('')}</div>
        <div class="popup-metrics">${data.metrics
          .map((m) => `<div class="popup-metric"><div class="popup-metric-val">${m.val}</div><div class="popup-metric-label">${m.label}</div></div>`)
          .join('')}</div>
      `
      popupBody.innerHTML = html
      popup.classList.add('open')
      document.body.style.overflow = 'hidden'
    }

    ;(window as any).closeIndustry = (_e: unknown, force?: boolean) => {
      const popup = root.querySelector<HTMLElement>('#industryPopup')
      if (!popup) return
      if (force) {
        popup.classList.remove('open')
        document.body.style.overflow = ''
      }
    }

    // FORM SUBMIT (inline onclick uses it)
    ;(window as any).submitForm = () => {
      const wrap = root.querySelector<HTMLElement>('#contactFormWrap')
      const success = root.querySelector<HTMLElement>('#formSuccess')
      if (wrap) wrap.style.display = 'none'
      success?.classList.add('visible')
    }

    // SCROLL REVEAL
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('revealed')
          el.classList.add('reveal--in') // avoid global blur reveal
          revealObserver.unobserve(el)
        })
      },
      { threshold: 0.12 },
    )
    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => revealObserver.observe(el))

    // WALKTHROUGH VISUAL PARALLAX
    const onScrollParallax = () => {
      root.querySelectorAll<HTMLElement>('.walkthrough-visual').forEach((v) => {
        const offset = window.scrollY * 0.15
        v.style.transform = `translateY(${offset}px)`
      })
    }
    window.addEventListener('scroll', onScrollParallax, { passive: true })

    // USP VISUAL PARALLAX
    const visual = root.querySelector<HTMLElement>('.usp-visual')
    const visualContent = root.querySelector<HTMLElement>('.usp-visual-content')
    let raf: number | null = null
    const updateParallax = () => {
      raf = null
      if (!visual || !visualContent) return
      const rect = visual.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      const offset = (0.5 - progress) * 42
      const innerOffset = (0.5 - progress) * 18
      visual.style.transform = `translate3d(0, ${offset}px, 0)`
      visualContent.style.setProperty('--parallax-y', `${innerOffset}px`)
    }
    const onScrollUsp = () => {
      if (raf !== null) return
      raf = window.requestAnimationFrame(updateParallax)
    }
    window.addEventListener('scroll', onScrollUsp, { passive: true })
    window.addEventListener('resize', onScrollUsp)
    updateParallax()

    // Smooth in-page anchors within this landing page
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
      window.removeEventListener('scroll', onScrollParallax)
      window.removeEventListener('scroll', onScrollUsp)
      window.removeEventListener('resize', onScrollUsp)
      window.clearInterval(testiTimer)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
      window.clearTimeout(t5)
      window.clearTimeout(t6)
      revealObserver.disconnect()
      if (raf !== null) window.cancelAnimationFrame(raf)
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style dangerouslySetInnerHTML={{ __html: cssText }} />

      {loadError ? (
        <div style={{ padding: 24 }}>Loyalty Rule Engine error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

