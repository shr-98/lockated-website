import { LandingPageLoader } from '../components/LandingPageLoader'
import { useEffect, useRef, useState } from 'react'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

const SURVEY_RENDER_FIX_CSS = `
/* Survey integration fix:
   Some sections can look blurred/soft when left in transform-based reveal states.
   Force reveal helpers to render sharply. */
.survey-root .reveal {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
  transition: none !important;
}
.survey-root .reveal.in-view {
  opacity: 1 !important;
  transform: none !important;
}
`

export default function SurveyLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/survey.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /survey.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/survey.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${SURVEY_RENDER_FIX_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
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

  useEffect(() => {
    const root = rootRef.current
    if (!root || !bodyHtml) return

    // Scroll progress line
    const progressLine = root.querySelector<HTMLElement>('#progress-line')
    const updateProgress = () => {
      if (!progressLine) return
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0
      progressLine.style.width = `${Math.max(0, Math.min(100, pct))}%`
    }

    // Navbar scroll
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 50)
      updateProgress()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Bento Grid Animation (hero background)
    const bentoBg = root.querySelector<HTMLElement>('#bentoBg')
    const bentoCells: HTMLElement[] = []
    let bentoTimer: number | null = null
    if (bentoBg) {
      // Avoid duplicating on HMR
      bentoBg.querySelectorAll('.bento-cell').forEach((n) => n.remove())
      for (let i = 0; i < 12; i++) {
        const cell = document.createElement('div')
        cell.className = 'bento-cell'
        cell.style.left = `${Math.random() * 80}%`
        cell.style.top = `${Math.random() * 80}%`
        cell.style.width = `${Math.floor(Math.random() * 120) + 80}px`
        cell.style.height = `${Math.floor(Math.random() * 80) + 80}px`
        cell.style.borderRadius = '12px 24px'
        bentoBg.appendChild(cell)
        bentoCells.push(cell)
      }
      bentoTimer = window.setInterval(() => {
        if (!bentoCells.length) return
        const rand = Math.floor(Math.random() * bentoCells.length)
        bentoCells.forEach((c, idx) => c.classList.toggle('lit', idx === rand))
      }, 2500)
    }

    // Reveal on scroll
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
      { threshold: 0.15 },
    )
    revealEls.forEach((el) => revealObserver.observe(el))
    markRevealsInView()
    window.addEventListener('scroll', markRevealsInView, { passive: true })
    window.addEventListener('resize', markRevealsInView, { passive: true })

    // Counters
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.counter'))
    const counterTimers: number[] = []
    const startCounter = (el: HTMLElement) => {
      const target = Number(el.getAttribute('data-target') ?? '0')
      const suffix = el.getAttribute('data-suffix') ?? ''
      const prefix = el.getAttribute('data-prefix') ?? ''
      const isDecimal = (el.getAttribute('data-decimal') ?? '') === 'true'
      let current = 0
      const step = Math.max(1, Math.ceil(target / 40))
      const tick = () => {
        current += step
        if (current >= target) current = target
        const val = isDecimal ? current.toFixed(1) : String(current)
        el.textContent = `${prefix}${val}${suffix}`
        if (current < target) {
          const id = window.requestAnimationFrame(tick)
          counterTimers.push(id)
        }
      }
      tick()
    }
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          counterObs.unobserve(entry.target)
          startCounter(entry.target as HTMLElement)
        })
      },
      { threshold: 0.6 },
    )
    counters.forEach((c) => counterObs.observe(c))

    // Feature accordion (left list controls fv-screen)
    const featureItems = Array.from(root.querySelectorAll<HTMLElement>('.feature-item'))
    const fvScreens = Array.from(root.querySelectorAll<HTMLElement>('.fv-screen'))
    const setFeatureActive = (item: HTMLElement) => {
      featureItems.forEach((fi) => fi.classList.remove('active'))
      fvScreens.forEach((s) => s.classList.remove('visible'))
      item.classList.add('active')
      const screenId = item.getAttribute('data-screen')
      if (screenId) root.querySelector<HTMLElement>(`#${CSS.escape(screenId)}`)?.classList.add('visible')
    }
    const featureHeaderHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    featureItems.forEach((item) => {
      const header = item.querySelector<HTMLElement>('.feature-header')
      if (!header) return
      const fn = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        const isActive = item.classList.contains('active')
        if (isActive) {
          const first = featureItems[0]
          if (first) setFeatureActive(first)
        } else {
          setFeatureActive(item)
        }
      }
      header.addEventListener('click', fn)
      featureHeaderHandlers.push({ el: header, fn })
    })
    // Ensure initial visible screen matches the active feature item
    const initialActive = featureItems.find((fi) => fi.classList.contains('active')) ?? featureItems[0]
    if (initialActive) setFeatureActive(initialActive)

    // Walkthrough tabs
    const walkthroughTabs = Array.from(root.querySelectorAll<HTMLButtonElement>('#walkthroughTabs .feature-tab'))
    const walkthroughPanels = Array.from(root.querySelectorAll<HTMLElement>('.walkthrough-section .feature-content'))
    const setWalkTab = (idx: number) => {
      walkthroughTabs.forEach((t, i) => t.classList.toggle('active', i === idx))
      walkthroughPanels.forEach((p, i) => {
        p.style.display = i === idx ? 'grid' : 'none'
      })
      markRevealsInView()
    }
    const walkHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    walkthroughTabs.forEach((tab, idx) => {
      const fn = (e: Event) => {
        e.preventDefault()
        setWalkTab(idx)
      }
      tab.addEventListener('click', fn)
      walkHandlers.push({ el: tab, fn })
    })
    if (walkthroughTabs.length) setWalkTab(walkthroughTabs.findIndex((t) => t.classList.contains('active')) || 0)

    // Testimonials slider
    const testiCards = Array.from(root.querySelectorAll<HTMLElement>('.testi-card'))
    const testiDots = Array.from(root.querySelectorAll<HTMLElement>('.testi-dot'))
    let testiIndex = 0
    const goTesti = (idx: number) => {
      if (!testiCards.length) return
      testiIndex = ((idx % testiCards.length) + testiCards.length) % testiCards.length
      testiCards.forEach((c, i) => {
        c.classList.remove('card-active', 'card-back1', 'card-back2')
        if (i === testiIndex) c.classList.add('card-active')
        else if (i === testiIndex - 1 || (testiIndex === 0 && i === testiCards.length - 1))
          c.classList.add('card-back1')
        else c.classList.add('card-back2')
      })
      testiDots.forEach((d, i) => d.classList.toggle('active', i === testiIndex))
    }
    const dotHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    testiDots.forEach((dot, idx) => {
      const fn = (e: Event) => {
        e.preventDefault()
        goTesti(idx)
      }
      dot.addEventListener('click', fn)
      dotHandlers.push({ el: dot, fn })
    })
    goTesti(0)
    const testiTimer = testiCards.length ? window.setInterval(() => goTesti(testiIndex + 1), 5000) : null

    // Team tabs
    const teamTabs = Array.from(root.querySelectorAll<HTMLButtonElement>('#teamsTabs .team-tab'))
    const teamContents = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const setTeamTab = (idx: number) => {
      teamTabs.forEach((t, i) => t.classList.toggle('active', i === idx))
      teamContents.forEach((c, i) => c.classList.toggle('active', i === idx))
      markRevealsInView()
    }
    const teamHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    teamTabs.forEach((tab, idx) => {
      const fn = (e: Event) => {
        e.preventDefault()
        setTeamTab(idx)
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })
    if (teamTabs.length) setTeamTab(teamTabs.findIndex((t) => t.classList.contains('active')) || 0)

    // Modals (exposed for inline onclick compatibility)
    const openModal = (id: string) => {
      const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
      if (!el) return
      el.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
    const closeModal = (id: string) => {
      const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
      if (!el) return
      el.classList.remove('open')
      document.body.style.overflow = ''
    }
    ;(window as any).openModal = openModal
    ;(window as any).closeModal = closeModal

    const modalBackdrops = Array.from(root.querySelectorAll<HTMLElement>('.uc-modal'))
    const modalBackdropHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    modalBackdrops.forEach((m) => {
      const fn = (e: Event) => {
        if (e.target !== m) return
        closeModal(m.id)
      }
      m.addEventListener('click', fn)
      modalBackdropHandlers.push({ el: m, fn })
    })
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      modalBackdrops.forEach((m) => m.classList.contains('open') && closeModal(m.id))
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', markRevealsInView)
      window.removeEventListener('resize', markRevealsInView)
      revealObserver.disconnect()
      counterObs.disconnect()
      counterTimers.forEach((t) => window.cancelAnimationFrame(t))

      if (bentoTimer) window.clearInterval(bentoTimer)
      if (testiTimer) window.clearInterval(testiTimer)

      featureHeaderHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      walkHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      dotHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalBackdropHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      document.removeEventListener('keydown', onKeyDown)

      delete (window as any).openModal
      delete (window as any).closeModal
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="survey-root">
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

