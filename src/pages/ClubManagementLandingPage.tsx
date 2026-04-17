import { useEffect, useRef, useState } from 'react'

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

const CLUB_MGMT_NO_BLUR_CSS = `
/* Club Management: user requested no blur/backdrop-filter anywhere */
/* Global kill-switches for all blur styles */
*,
*::before,
*::after {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* In case any blur is applied via filter */
* {
  filter: none !important;
}

/* Keep drop-shadow icons working (not blur) */
.img-icon-uc {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3)) !important;
}
`

export default function ClubManagementLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/club-management.html', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load /club-management.html (${res.status})`)

        const text = await res.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        const body = doc.body?.innerHTML ?? ''

        if (!styles.trim() || !body.trim()) {
          throw new Error('`public/club-management.html` must contain <style> and full <body> markup.')
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${CLUB_MGMT_NO_BLUR_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Club Management content')
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

    // NAVBAR SCROLL
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // HERO ANIMATIONS + COUNTERS
    const timers: number[] = []
    const setLater = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms))
    }

    const startCounters = () => {
      root.querySelectorAll<HTMLElement>('.count-up').forEach((el) => {
        const target = Number.parseInt(el.dataset.target || '0', 10)
        if (!Number.isFinite(target) || target <= 0) return
        let current = 0
        const increment = target / 50
        const id = window.setInterval(() => {
          current = Math.min(current + increment, target)
          el.textContent = String(Math.floor(current))
          if (current >= target) window.clearInterval(id)
        }, 35)
        timers.push(id)
      })
    }

    setLater(() => {
      root.querySelector<HTMLElement>('#hero-eyebrow')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
    }, 100)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-headline')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
    }, 300)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-sub')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
    }, 500)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-ctas')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
      const heroSubtext = root.querySelector<HTMLElement>('#hero-subtext')
      if (heroSubtext) heroSubtext.style.opacity = '1'
    }, 700)
    setLater(() => {
      root.querySelector<HTMLElement>('#hero-counters')?.setAttribute(
        'style',
        'opacity:1; transform:translateY(0); transition: opacity 0.7s ease, transform 0.7s ease;',
      )
      startCounters()
    }, 900)

    setLater(() => {
      root.querySelectorAll<HTMLElement>('.hero-float-card').forEach((c, i) => {
        setLater(() => c.classList.add('shown'), i * 250)
      })
    }, 1100)

    // SCROLL REVEAL
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('in-view')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    revealEls.forEach((el) => observer.observe(el))

    // USP ACCORDION
    const uspItems = Array.from(root.querySelectorAll<HTMLElement>('.usp-item'))
    const uspScreens = Array.from(root.querySelectorAll<HTMLElement>('.usp-screen'))
    const uspHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    uspItems.forEach((item) => {
      const fn = () => {
        const screenId = item.dataset.screen
        uspItems.forEach((i) => i.classList.remove('active'))
        uspScreens.forEach((s) => s.classList.remove('visible'))
        item.classList.add('active')
        if (screenId) root.querySelector<HTMLElement>(`#${CSS.escape(screenId)}`)?.classList.add('visible')
      }
      item.addEventListener('click', fn)
      uspHandlers.push({ el: item, fn })
    })

    // FEATURE TABS
    const featureTabs = Array.from(root.querySelectorAll<HTMLElement>('.feature-tab'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-panel'))
    const featureHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    featureTabs.forEach((tab) => {
      const fn = () => {
        const panelId = tab.dataset.panel
        featureTabs.forEach((t) => t.classList.remove('active'))
        featurePanels.forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        if (!panelId) return
        const panel = root.querySelector<HTMLElement>(`#${CSS.escape(panelId)}`)
        if (!panel) return
        panel.classList.add('active')
        panel.style.animation = 'none'
        // force reflow to restart animation
        void panel.offsetHeight
        panel.style.animation = 'panelSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards'
      }
      tab.addEventListener('click', fn)
      featureHandlers.push({ el: tab, fn })
    })

    // USE CASE MODALS (must be global for inline onclick)
    const openUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (!modal) return
      modal.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
    const closeUCModal = (id: string) => {
      const modal = root.querySelector<HTMLElement>(`#modal-${CSS.escape(id)}`)
      if (!modal) return
      modal.classList.remove('open')
      document.body.style.overflow = ''
    }
    ;(window as any).openUCModal = openUCModal
    ;(window as any).closeUCModal = closeUCModal

    const modals = Array.from(root.querySelectorAll<HTMLElement>('.usecase-modal'))
    const modalHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    modals.forEach((modal) => {
      const fn = (e: Event) => {
        if (e.target === modal) {
          modal.classList.remove('open')
          document.body.style.overflow = ''
        }
      }
      modal.addEventListener('click', fn)
      modalHandlers.push({ el: modal, fn })
    })
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      modals.forEach((m) => {
        if (m.classList.contains('open')) {
          m.classList.remove('open')
          document.body.style.overflow = ''
        }
      })
    }
    document.addEventListener('keydown', onKeyDown)

    // TEAM TABS
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.team-tab'))
    const teamContents = Array.from(root.querySelectorAll<HTMLElement>('.team-content'))
    const teamHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    teamTabs.forEach((tab) => {
      const fn = () => {
        const team = tab.dataset.team
        teamTabs.forEach((t) => t.classList.remove('active'))
        teamContents.forEach((c) => c.classList.remove('active'))
        tab.classList.add('active')
        if (!team) return
        const content = root.querySelector<HTMLElement>(`[data-content="${CSS.escape(team)}"]`)
        if (!content) return
        content.classList.add('active')
        content.style.animation = 'none'
        void content.offsetHeight
        content.style.animation = 'panelSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards'
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })

    // Panel slide animation + small hover fix
    const animStyle = document.createElement('style')
    animStyle.textContent = `
@keyframes panelSlideIn { from { opacity:0; transform: translateY(24px);} to { opacity:1; transform: translateY(0);} }
.feature-panel.active { animation: panelSlideIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
.btn-hero-primary:hover::before { opacity: 1 !important; }
`
    document.head.appendChild(animStyle)

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
      timers.forEach((t) => {
        // clears both timeouts and intervals safely
        window.clearTimeout(t)
        window.clearInterval(t)
      })
      uspHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      featureHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      document.removeEventListener('keydown', onKeyDown)
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      animStyle.remove()
      delete (window as any).openUCModal
      delete (window as any).closeUCModal
      document.body.style.overflow = ''
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef}>
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
        <div style={{ padding: 24 }}>Club Management error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

