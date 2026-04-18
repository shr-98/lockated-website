import { useEffect, useRef, useState } from 'react'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

export default function PostPossessionLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/post-possession.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /post-possession.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/post-possession.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(styles)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Post Possession content')
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

    // Fade-in reveal
    const fadeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add('visible')
          el.classList.add('reveal--in')
          fadeObs.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    root.querySelectorAll<HTMLElement>('.fade-in').forEach((el) => fadeObs.observe(el))

    // Hero counters (metric-num)
    const counterTimers: number[] = []
    const animateMetric = (el: HTMLElement) => {
      const target = Number.parseFloat(el.dataset.target || '0')
      const suffix = el.dataset.suffix || ''
      if (!Number.isFinite(target) || target <= 0) return

      let current = 0
      const duration = 1600
      const step = 16
      const inc = target / (duration / step)
      const t = window.setInterval(() => {
        current = Math.min(current + inc, target)
        const isInt = Number.isInteger(target)
        el.textContent = `${isInt ? Math.round(current) : current.toFixed(1)}${suffix}`
        if (current >= target) window.clearInterval(t)
      }, step)
      counterTimers.push(t)
    }

    let countersStarted = false
    const heroMetrics = root.querySelector<HTMLElement>('.hero-metrics')
    const counterObs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (countersStarted) return
        countersStarted = true
        root.querySelectorAll<HTMLElement>('.metric-num[data-target]').forEach(animateMetric)
        counterObs.disconnect()
      },
      { threshold: 0.45 },
    )
    if (heroMetrics) counterObs.observe(heroMetrics)

    // USP accordion (inline onclick="openUsp(idx)")
    const setUsp = (idx: number) => {
      root.querySelectorAll<HTMLElement>('.usp-item').forEach((it, i) => {
        it.classList.toggle('active', i === idx)
      })
      root.querySelectorAll<HTMLElement>('.usp-visual-inner').forEach((it, i) => {
        it.classList.toggle('visible', i === idx)
      })
      const dots = root.querySelectorAll<HTMLElement>('#uspDots .testi-dot')
      dots.forEach((d, i) => d.classList.toggle('active', i === idx))
    }
    ;(window as any).openUsp = (idx: number) => setUsp(Number(idx) || 0)
    setUsp(0)

    // Testimonials (inline onclick="goTesti(idx)")
    let currentTesti = 0
    const setTesti = (idx: number) => {
      const cards = Array.from(root.querySelectorAll<HTMLElement>('#testiStack .testi-card'))
      const dots = Array.from(root.querySelectorAll<HTMLElement>('#testiDots .testi-dot'))
      if (!cards.length) return
      const n = cards.length
      currentTesti = ((idx % n) + n) % n
      cards.forEach((c, i) => {
        c.classList.remove('active', 'prev', 'next')
        if (i === currentTesti) c.classList.add('active')
        if (i === (currentTesti - 1 + n) % n) c.classList.add('prev')
        if (i === (currentTesti + 1) % n) c.classList.add('next')
      })
      dots.forEach((d, i) => d.classList.toggle('active', i === currentTesti))
    }
    ;(window as any).goTesti = (idx: number) => setTesti(Number(idx) || 0)
    setTesti(0)
    const testiTimer = window.setInterval(() => setTesti(currentTesti + 1), 5200)

    // Walkthrough tabs (inline onclick="selectWtTab(idx)")
    const setWt = (idx: number) => {
      root.querySelectorAll<HTMLElement>('#wtTabs .wt-tab').forEach((t, i) => t.classList.toggle('active', i === idx))
      root.querySelectorAll<HTMLElement>('.feat-panel').forEach((p, i) => p.classList.toggle('visible', i === idx))
    }
    ;(window as any).selectWtTab = (idx: number) => setWt(Number(idx) || 0)
    setWt(0)

    // Team tabs — HTML uses onclick="selectTeam(n)"; inline <script> in the fetched file does not run when injected via innerHTML
    const setTeam = (idx: number) => {
      const i = Math.max(0, Math.floor(Number(idx) || 0))
      root.querySelectorAll<HTMLElement>('.team-tab').forEach((t, j) => t.classList.toggle('active', j === i))
      root.querySelectorAll<HTMLElement>('.team-panel').forEach((p, j) => p.classList.toggle('active', j === i))
    }
    const selectTeam = (idx: number) => setTeam(idx)
    ;(window as any).selectTeam = selectTeam
    ;(window as any).selectTeamTab = selectTeam
    setTeam(0)

    // Smooth anchors
    const anchorHandlers: Array<{ a: HTMLAnchorElement; onClick: (e: MouseEvent) => void }> = []
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

    return () => {
      window.removeEventListener('scroll', onScroll)
      fadeObs.disconnect()
      counterObs.disconnect()
      window.clearInterval(testiTimer)
      counterTimers.forEach((t) => window.clearInterval(t))
      anchorHandlers.forEach(({ a, onClick }) => a.removeEventListener('click', onClick))
      delete (window as any).openUsp
      delete (window as any).goTesti
      delete (window as any).selectWtTab
      delete (window as any).selectTeam
      delete (window as any).selectTeamTab
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef}>
      {/* Ensure same external assets as the provided HTML */}
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
        <div style={{ padding: 24 }}>Post Possession error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

