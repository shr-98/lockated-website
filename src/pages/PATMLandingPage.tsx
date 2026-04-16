import { useEffect, useRef, useState } from 'react'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

const BACKDROP_FILTER_FIX_CSS = `
/* PATM integration fix:
   Some browsers/pages can end up with unintended backdrop-filter layers
   that visually blur content. Disable globally inside PATM and re-enable
   only for the intended components. */
.patm-root * {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
.patm-root nav {
  -webkit-backdrop-filter: blur(20px) !important;
  backdrop-filter: blur(20px) !important;
}
.patm-root .usecase-modal {
  -webkit-backdrop-filter: blur(8px) !important;
  backdrop-filter: blur(8px) !important;
}
.patm-root .float-card {
  -webkit-backdrop-filter: blur(20px) !important;
  backdrop-filter: blur(20px) !important;
}
.patm-root .glass {
  -webkit-backdrop-filter: blur(24px) !important;
  backdrop-filter: blur(24px) !important;
}

/* Crisp rendering fix:
   The original HTML uses scaled transforms for "depth" (e.g. testimonial stack).
   On some GPUs/screens this reads as blur. Keep the layout/offset/rotation but
   force scale(1) so text and UI stay sharp. */
.patm-root .testi-card { transform: translateY(30px) scale(1) !important; }
.patm-root .testi-card.card-active { transform: translateY(0) scale(1) !important; }
.patm-root .testi-card.card-back1 { transform: translateY(12px) rotate(1deg) scale(1) !important; }
.patm-root .testi-card.card-back2 { transform: translateY(22px) rotate(2.5deg) scale(1) !important; }

/* Hard-disable transform-based reveal helpers (prevents any residual soft rendering) */
.patm-root .reveal,
.patm-root .fade-up {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
  transition: none !important;
}
.patm-root .reveal.in-view { opacity: 1 !important; transform: none !important; }
`

export default function PATMLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/patm.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /patm.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/patm.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${BACKDROP_FILTER_FIX_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load PATM content')
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

    // Scroll reveal (adds `in-view` to `.reveal`)
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    const markRevealsInView = () => {
      const vh = window.innerHeight || 0
      revealEls.forEach((el) => {
        if (el.classList.contains('in-view')) return
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.92) el.classList.add('in-view')
      })
    }
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('in-view')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    revealEls.forEach((el) => revealObserver.observe(el))
    // Fallback: ensure nothing stays "pre-reveal" (which can look soft/blurred)
    markRevealsInView()
    window.addEventListener('scroll', markRevealsInView, { passive: true })
    window.addEventListener('resize', markRevealsInView, { passive: true })
    // Some elements appear via tabs/carousels without scrolling; re-check after interactions
    const onAnyClick = () => window.requestAnimationFrame(markRevealsInView)
    root.addEventListener('click', onAnyClick, true)
    // Also re-check briefly after mount (covers late layout/paint)
    const revealWarmup = (() => {
      let n = 0
      const id = window.setInterval(() => {
        markRevealsInView()
        n += 1
        if (n >= 20) window.clearInterval(id) // ~6s
      }, 300)
      return id
    })()
    // Absolute fallback: if any are still not revealed, reveal them all.
    const forceRevealAll = window.setTimeout(() => {
      revealEls.forEach((el) => el.classList.add('in-view'))
    }, 1200)

    // Counter animation (hero metrics)
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.counter'))
    let countersStarted = false
    const counterTimers: number[] = []

    const startCounters = () => {
      if (countersStarted) return
      countersStarted = true
      counters.forEach((counter) => {
        const target = Number.parseFloat(counter.dataset.target || '0')
        if (!Number.isFinite(target)) return
        const prefix = counter.dataset.prefix || ''
        const suffix = counter.dataset.suffix || ''
        const isDecimal = counter.dataset.decimal === 'true'
        const duration = 2000
        const steps = 60
        const stepTime = duration / steps
        let current = 0
        const increment = target / steps
        const timer = window.setInterval(() => {
          current += increment
          if (current >= target) current = target
          const display = isDecimal ? current.toFixed(1) : String(Math.floor(current))
          counter.textContent = `${prefix}${display}${suffix}`
          if (current >= target) window.clearInterval(timer)
        }, stepTime)
        counterTimers.push(timer)
      })
    }

    const metricsEl = root.querySelector<HTMLElement>('#hero-metrics')
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) startCounters()
        })
      },
      { threshold: 0.3 },
    )
    if (metricsEl) metricsObserver.observe(metricsEl)

    // USP accordion (switch `.usp-item.active` and `.usp-screen.visible`)
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    const uspClickHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    uspItems.forEach((item) => {
      const header = item.querySelector<HTMLElement>('.usp-header')
      if (!header) return
      const onClick = () => {
        const targetScreen = item.dataset.screen || ''
        uspItems.forEach((i) => i.classList.remove('active'))
        item.classList.add('active')
        uspScreens.forEach((s) => s.classList.remove('visible'))
        const target = root.querySelector<HTMLElement>(`#${CSS.escape(targetScreen)}`)
        if (target) target.classList.add('visible')
      }
      header.addEventListener('click', onClick)
      uspClickHandlers.push({ el: header, fn: onClick })
    })

    // Testimonials
    const testimonials = [
      {
        metric: '87%',
        metricLabel: 'Meeting actions completed on time',
        quote:
          'Before PTM, our MoMs were written in Word and forgotten by Thursday. Now every action point becomes a task with an owner and a deadline automatically. Our project delivery improved by 31% in the first quarter alone.',
        name: 'Rahul Kapoor',
        role: 'Project Director, Kalpataru Group',
        initials: 'RK',
        color: '#DA7756',
      },
      {
        metric: '₹1.8Cr',
        metricLabel: 'Annual SaaS cost saved',
        quote:
          "We replaced MS 365, Asana, and Google Docs with PTM. The data sovereignty feature was the deal-closer, our client contracts and financial data now live exclusively on our own servers. The compliance team finally stopped worrying.",
        name: 'Pooja Mehta',
        role: 'COO, Panchshil Realty',
        initials: 'PM',
        color: '#798C5E',
      },
      {
        metric: '42%',
        metricLabel: 'Faster client issue resolution time',
        quote:
          "Our client issues used to get lost in email threads for two weeks. With PTM's issue register and MoM-to-task workflow, nothing falls through the cracks. Resolution time dropped from 12 days to under 5, and our clients noticed.",
        name: 'Vikram Nair',
        role: 'COO, Runwal Group',
        initials: 'VN',
        color: '#6B9BCC',
      },
      {
        metric: '22%',
        metricLabel: 'More sprint tasks completed vs Jira',
        quote:
          "Our engineering team was skeptical about leaving Jira. After one sprint on PTM, nobody wanted to go back. The Kanban board, the integrated channels, and the MoM to task conversion cut our sprint coordination overhead in half.",
        name: 'Ananya Krishnan',
        role: 'VP Engineering, Godrej Properties',
        initials: 'AK',
        color: '#9EC8BA',
      },
    ]

    let currentTesti = 0
    const activeCard = root.querySelector<HTMLElement>('#active-card')
    const updateCard = (t: (typeof testimonials)[number]) => {
      const metric = root.querySelector<HTMLElement>('#testi-metric')
      const metricLabel = root.querySelector<HTMLElement>('#testi-metric-label')
      const quote = root.querySelector<HTMLElement>('#testi-quote')
      const name = root.querySelector<HTMLElement>('#testi-name')
      const role = root.querySelector<HTMLElement>('#testi-role')
      const avatar = root.querySelector<HTMLElement>('#testi-avatar')
      if (metric) metric.textContent = t.metric
      if (metricLabel) metricLabel.textContent = t.metricLabel
      if (quote) quote.textContent = t.quote
      if (name) name.textContent = t.name
      if (role) role.textContent = t.role
      if (avatar) {
        avatar.textContent = t.initials
        avatar.style.background = t.color
      }
    }

    const testiDots = Array.from(root.querySelectorAll<HTMLElement>('.testi-dot'))
    const showTestimonial = (index: number, animate = true) => {
      const t = testimonials[index]
      if (!t) return
      if (activeCard && animate) {
        activeCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        activeCard.style.opacity = '0'
        activeCard.style.transform = 'translateY(12px)'
        window.setTimeout(() => {
          updateCard(t)
          if (!activeCard) return
          activeCard.style.opacity = '1'
          activeCard.style.transform = 'translateY(0)'
        }, 300)
      } else {
        updateCard(t)
      }
      testiDots.forEach((dot, i) => dot.classList.toggle('active', i === index))
    }

    const restartTestiCycle = (() => {
      let timer: number | null = null
      const start = () => {
        timer = window.setInterval(() => {
          currentTesti = (currentTesti + 1) % testimonials.length
          showTestimonial(currentTesti)
        }, 5000)
      }
      const stop = () => {
        if (timer) window.clearInterval(timer)
        timer = null
      }
      const getTimer = () => timer
      return { start, stop, getTimer }
    })()

    const dotHandlers: Array<{ dot: HTMLElement; fn: () => void }> = []
    testiDots.forEach((dot, i) => {
      const fn = () => {
        restartTestiCycle.stop()
        currentTesti = i
        showTestimonial(currentTesti)
        restartTestiCycle.start()
      }
      dot.addEventListener('click', fn)
      dotHandlers.push({ dot, fn })
    })
    showTestimonial(0, false)
    restartTestiCycle.start()

    // Feature tabs
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    const featureHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    featureTabs.forEach((tab) => {
      const fn = () => {
        const feature = tab.dataset.feature || ''
        featureTabs.forEach((t) => t.classList.remove('active'))
        featurePanels.forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        const panel = root.querySelector<HTMLElement>(`[data-panel="${CSS.escape(feature)}"]`)
        if (panel) panel.classList.add('active')
      }
      tab.addEventListener('click', fn)
      featureHandlers.push({ el: tab, fn })
    })

    // Pain card hover glow
    const painCards = Array.from(root.querySelectorAll<HTMLElement>('.pain-card'))
    const painHandlers: Array<{ el: HTMLElement; onMove: (e: MouseEvent) => void; onLeave: () => void }> = []
    painCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(218,119,86,0.04) 0%, #fff 60%)`
      }
      const onLeave = () => {
        card.style.background = '#fff'
      }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      painHandlers.push({ el: card, onMove, onLeave })
    })

    // Animate progress bars (USP analytics + feature screens)
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).querySelectorAll<HTMLElement>('.progress-bar-fill').forEach((bar) => {
            const width = bar.style.width
            if (!width) return
            bar.style.width = '0%'
            window.setTimeout(() => {
              bar.style.width = width
            }, 100)
          })
        })
      },
      { threshold: 0.3 },
    )
    root.querySelectorAll<HTMLElement>('.screen-analytics, .feature-screen-body').forEach((el) => progressObserver.observe(el))

    // Teams tab strip + slide-in keyframes (in original HTML this is injected via JS)
    const slideStyle = document.createElement('style')
    slideStyle.textContent = `
      @keyframes patmSlideIn {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .team-content.active { animation: patmSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
    `
    document.head.appendChild(slideStyle)

    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.team-tab'))
    const teamContents = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const teamHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    teamTabs.forEach((tab) => {
      const fn = () => {
        const team = tab.dataset.team || ''
        teamTabs.forEach((t) => t.classList.remove('active'))
        teamContents.forEach((c) => c.classList.remove('active'))
        tab.classList.add('active')
        const content = root.querySelector<HTMLElement>(`[data-content="${CSS.escape(team)}"]`)
        if (content) {
          content.classList.add('active')
          content.style.animation = 'none'
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          content.offsetHeight
          content.style.animation = ''
        }
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })

    // Use case modals
    const openModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (modal) {
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
      }
    }
    const closeModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (modal) {
        modal.classList.remove('open')
        document.body.style.overflow = ''
      }
    }
    ;(window as any).closeModal = closeModal

    const usecaseCards = Array.from(root.querySelectorAll<HTMLElement>('.usecase-card'))
    const usecaseCardHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    usecaseCards.forEach((card) => {
      const fn = () => {
        const modalId = card.dataset.modal || ''
        if (modalId) openModal(modalId)
      }
      card.addEventListener('click', fn)
      usecaseCardHandlers.push({ el: card, fn })
    })

    const modalBackdrops = Array.from(root.querySelectorAll<HTMLElement>('.usecase-modal'))
    const modalBackdropHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    modalBackdrops.forEach((modal) => {
      const fn = (e: MouseEvent) => {
        if (e.target === modal) {
          modal.classList.remove('open')
          document.body.style.overflow = ''
        }
      }
      modal.addEventListener('click', fn)
      modalBackdropHandlers.push({ el: modal, fn })
    })

    const modalInners = Array.from(root.querySelectorAll<HTMLElement>('.modal-inner'))
    const modalInnerHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    modalInners.forEach((inner) => {
      const fn = (e: MouseEvent) => e.stopPropagation()
      inner.addEventListener('click', fn)
      modalInnerHandlers.push({ el: inner, fn })
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      root.querySelectorAll<HTMLElement>('.usecase-modal.open').forEach((m) => m.classList.remove('open'))
      document.body.style.overflow = ''
    }
    document.addEventListener('keydown', onKeyDown)

    // Hover glow vars on usecase cards
    const usecaseHoverHandlers: Array<{ el: HTMLElement; onMove: (e: MouseEvent) => void }> = []
    usecaseCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mx', `${x}%`)
        card.style.setProperty('--my', `${y}%`)
      }
      card.addEventListener('mousemove', onMove)
      usecaseHoverHandlers.push({ el: card, onMove })
    })

    // Animate bar fills on scroll (teams visuals + end banner)
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement)
            .querySelectorAll<HTMLElement>('.bar-fill, .float-progress-fill')
            .forEach((bar) => {
              const w = bar.style.width
              if (!w) return
              bar.style.width = '0%'
              bar.style.transition = 'width 1.2s cubic-bezier(0.23,1,0.32,1)'
              window.setTimeout(() => {
                bar.style.width = w
              }, 100)
            })
        })
      },
      { threshold: 0.3 },
    )
    root.querySelectorAll<HTMLElement>('.team-visual-body, .end-banner').forEach((el) => barObserver.observe(el))

    // Contact submit
    const submitBtn = root.querySelector<HTMLButtonElement>('.form-submit')
    const onSubmit = (e: Event) => {
      e.preventDefault()
      if (!submitBtn) return
      const span = submitBtn.querySelector('span')
      if (span) span.textContent = 'Message Sent!'
      submitBtn.style.background = '#798C5E'
      window.setTimeout(() => {
        if (span) span.textContent = 'Send Message'
        submitBtn.style.background = ''
      }, 3000)
    }
    submitBtn?.addEventListener('click', onSubmit)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', markRevealsInView)
      window.removeEventListener('resize', markRevealsInView)
      root.removeEventListener('click', onAnyClick, true)
      window.clearInterval(revealWarmup)
      window.clearTimeout(forceRevealAll)
      revealObserver.disconnect()
      metricsObserver.disconnect()
      progressObserver.disconnect()
      barObserver.disconnect()
      counterTimers.forEach((t) => window.clearInterval(t))
      const testiTimer = restartTestiCycle.getTimer()
      if (testiTimer) window.clearInterval(testiTimer)

      uspClickHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      dotHandlers.forEach(({ dot, fn }) => dot.removeEventListener('click', fn))
      featureHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      painHandlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      usecaseCardHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalBackdropHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalInnerHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      usecaseHoverHandlers.forEach(({ el, onMove }) => el.removeEventListener('mousemove', onMove))
      submitBtn?.removeEventListener('click', onSubmit)
      document.removeEventListener('keydown', onKeyDown)
      slideStyle.remove()
      delete (window as any).closeModal
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="patm-root">
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
        <div style={{ padding: 24 }}>PATM error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

