import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void gsap.registerPlugin(ScrollTrigger)

type HeadLinks = { href: string; rel: string; crossOrigin?: string | null }[]

/**
 * Standalone `Vendor management-landing.html` uses `.reveal` + `.reveal.visible` with
 * no blur. The app shell's `index.css` adds a global `.reveal { filter: blur(...) }`
 * meant for other pages — scope overrides so this route matches the file pixel-for-pixel.
 */
const VENDOR_MGMT_ISOLATION_CSS = `
.vendor-mgmt-root {
  position: relative;
  isolation: isolate;
}
/* Hero / bento: do not override — must match
   public/vendor-management.html (same as Downloads replica). */
/* The exported HTML adds a global noise overlay on body::before with z-index:9999.
   Inside the SPA this can cover the whole app and make it look blank. Disable it on this route. */
body::before {
  content: none !important;
  display: none !important;
}
.vendor-mgmt-root .reveal {
  opacity: 0 !important;
  transform: translateY(24px) !important;
  filter: none !important;
  will-change: auto !important;
  transition: opacity 0.6s ease, transform 0.6s ease !important;
}
.vendor-mgmt-root .reveal.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: none !important;
}
.vendor-mgmt-root h1,
.vendor-mgmt-root h2,
.vendor-mgmt-root h3,
.vendor-mgmt-root h4,
.vendor-mgmt-root h5,
.vendor-mgmt-root h6 {
  font-family: var(--font), 'Poppins', ui-sans-serif, system-ui, sans-serif !important;
}
@media (prefers-reduced-motion: reduce) {
  .vendor-mgmt-root .reveal,
  .vendor-mgmt-root .reveal.visible {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
/* Tailwind preflight / UA: white buttons & inputs — lock walkthrough to page tokens */
.vendor-mgmt-root .walkthrough-section {
  background-color: var(--bg) !important;
}
.vendor-mgmt-root .walkthrough-tabs,
.vendor-mgmt-root #wtTabs {
  background-color: var(--bg) !important;
}
.vendor-mgmt-root button.wt-tab {
  background-color: var(--bg) !important;
  background-image: none !important;
}
.vendor-mgmt-root .wt-form-input,
.vendor-mgmt-root .wt-ui-body input {
  background-color: var(--bg) !important;
  color: var(--dark) !important;
}
.vendor-mgmt-root .wt-form-input:read-only,
.vendor-mgmt-root .wt-ui-body input:read-only {
  background-color: var(--bg) !important;
  opacity: 1 !important;
}
.vendor-mgmt-root .wt-ui-body input:-webkit-autofill,
.vendor-mgmt-root .wt-ui-body input:-webkit-autofill:hover,
.vendor-mgmt-root .wt-ui-body input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--bg) inset !important;
  box-shadow: 0 0 0 1000px var(--bg) inset !important;
  -webkit-text-fill-color: var(--dark) !important;
}
.vendor-mgmt-root .form-input,
.vendor-mgmt-root .form-select,
.vendor-mgmt-root .form-textarea {
  background-color: var(--surface) !important;
  color: var(--dark) !important;
}
.vendor-mgmt-root .btn-primary,
.vendor-mgmt-root .btn-hero-primary,
.vendor-mgmt-root .btn-banner-primary,
.vendor-mgmt-root .wt-cta,
.vendor-mgmt-root .wt-form-submit,
.vendor-mgmt-root .form-submit {
  color: var(--on-primary) !important;
}
.vendor-mgmt-root a.btn-secondary,
.vendor-mgmt-root .btn-secondary {
  background-color: transparent !important;
}
.vendor-mgmt-root .industries-section {
  background-color: var(--band) !important;
}
.vendor-mgmt-root #end-banner.cta-banner {
  background-color: var(--band) !important;
}
`

/**
 * #test-case — ScrollTrigger storytelling (app route only; not in static file scripts).
 * Spec: `pin: true`, `scrub: 1`, `end: "+=300%"`, `anticipatePin: 1`,
 * `invalidateOnRefresh: true`, progress on `#testCaseProgress`, cross-fade
 * `.storytelling-step` + `.tc-panel` in lockstep. Reduced motion: static stack.
 */
function initTestCaseGsap(root: HTMLElement) {
  const pin = root.querySelector<HTMLElement>('.test-case-story-pin')
  if (!pin) return

  const testSection = root.querySelector<HTMLElement>('#test-case')
  const progressFill = root.querySelector<HTMLElement>('#testCaseProgress')
  const stepEls = gsap.utils.toArray<HTMLElement>('.storytelling-step', pin)
  if (stepEls.length < 2) return

  const panelEls = gsap.utils.toArray<HTMLElement>('.test-case-mock .tc-panel', pin)
  const sameLen = panelEls.length === stepEls.length

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    testSection?.classList.add('test-case-reduced')
    if (progressFill) progressFill.style.transform = 'scaleX(1)'
    return
  }

  const n = stepEls.length
  gsap.set(stepEls, { autoAlpha: 0, y: 28 })
  gsap.set(stepEls[0]!, { autoAlpha: 1, y: 0 })
  if (sameLen) {
    gsap.set(panelEls, { autoAlpha: 0, y: 18 })
    gsap.set(panelEls[0]!, { autoAlpha: 1, y: 0 })
  }

  const tl = gsap.timeline()
  const durOut = 0.42
  const durIn = 0.5
  const gap = 0.52
  for (let i = 0; i < n - 1; i++) {
    const t0 = 0.02 + i * gap
    const prev: HTMLElement[] = [stepEls[i]!]
    if (sameLen) prev.push(panelEls[i]!)
    const next: HTMLElement[] = [stepEls[i + 1]!]
    if (sameLen) next.push(panelEls[i + 1]!)

    tl.to(prev, { autoAlpha: 0, y: -24, duration: durOut, ease: 'power2.in' }, t0)
    tl.fromTo(
      next,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: durIn, ease: 'power2.out' },
      t0 + 0.12,
    )
  }

  ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 1,
    animation: tl,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (progressFill) progressFill.style.transform = `scaleX(${self.progress})`
    },
  })
}

export default function VendorManagementLandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [cssText, setCssText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [headLinks, setHeadLinks] = useState<HeadLinks>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const ts = Date.now()
        const candidates = [
          `/vendor-management-replica.html?ts=${ts}`,
          `/vendor-management.html?ts=${ts}`,
        ]

        /**
         * Vite's SPA fallback returns `index.html` (≈1KB with `<div id="root"></div>`) for
         * any missing static file, so a naive `res.ok` check would render nothing.
         * We require the response body to actually look like the exported vendor page.
         */
        const looksLikeVendorHtml = (html: string) =>
          /id=["']hero["']/.test(html) || /class=["']hero["']/.test(html)

        let text = ''
        let usedUrl = ''
        for (const url of candidates) {
          const r = await fetch(url, { cache: 'no-store' })
          if (!r.ok) continue
          const t = await r.text()
          if (looksLikeVendorHtml(t)) {
            text = t
            usedUrl = url
            break
          }
        }

        if (!text) {
          throw new Error(
            'Could not load vendor-management HTML. Ensure `public/vendor-management.html` exists.',
          )
        }

        const doc = new DOMParser().parseFromString(text, 'text/html')

        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent ?? '')
          .join('\n')
        let body = doc.body?.innerHTML ?? ''
        if (!body.trim()) {
          const m = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
          if (m?.[1]) body = m[1]
        }
        if (!body.trim()) {
          throw new Error(`Loaded ${usedUrl} but could not extract <body> markup.`)
        }

        const links: HeadLinks = Array.from(doc.head?.querySelectorAll('link[rel]') ?? [])
          .map((l) => ({
            href: l.getAttribute('href') ?? '',
            rel: l.getAttribute('rel') ?? '',
            crossOrigin: l.getAttribute('crossorigin'),
          }))
          .filter((l) => Boolean(l.href) && (l.rel === 'stylesheet' || l.rel === 'preconnect'))

        if (cancelled) return
        setCssText(`${styles}\n${VENDOR_MGMT_ISOLATION_CSS}`)
        setBodyHtml(body)
        setHeadLinks(links)
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load Vendor Management content')
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

    // Navbar scroll state
    const navbar = root.querySelector<HTMLElement>('#navbar')
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // BENTO — same as `Vendor management_landing page (1).html`: 14×10=140, random delay, CSS handles borders/tints
    const bentoBg = root.querySelector<HTMLElement>('#bentoBg')
    if (bentoBg) {
      bentoBg.innerHTML = ''
      for (let i = 0; i < 140; i++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        cell.style.animationDelay = `${Math.random() * 3}s`
        bentoBg.appendChild(cell)
      }
    }

    // Reveal observer (.reveal -> .visible)
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('visible')
        })
      },
      { threshold: 0.15 },
    )
    revealEls.forEach((el) => revealObserver.observe(el))

    // Count up
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.count-up'))
    const counterTimers: number[] = []
    const startCount = (el: HTMLElement) => {
      const target = Number(el.getAttribute('data-target') ?? '0')
      let current = 0
      const step = target / (1800 / 16)
      const id = window.setInterval(() => {
        current += step
        if (current >= target) {
          el.textContent = String(target)
          window.clearInterval(id)
          return
        }
        el.textContent = String(Math.floor(current))
      }, 16)
      counterTimers.push(id)
    }
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          if (el.getAttribute('data-counted')) return
          el.setAttribute('data-counted', 'true')
          counterObserver.unobserve(el)
          startCount(el)
        })
      },
      { threshold: 0.5 },
    )
    counters.forEach((c) => counterObserver.observe(c))

    // Feature accordion + UI panel
    const panelTitles = [
      'Compliance Dashboard',
      'Approval Matrix',
      'Vendor Portal',
      'Assessment Engine',
      'ERP Integration',
      'Audit Trail',
    ]
    const uiPanelTitle = root.querySelector<HTMLElement>('#uiPanelTitle')
    const featureItems = Array.from(root.querySelectorAll<HTMLElement>('.feature-item'))
    const featurePanels = Array.from(root.querySelectorAll<HTMLElement>('.feature-ui-panel-content'))
    const setFeature = (idx: number) => {
      featureItems.forEach((it) => it.classList.remove('active'))
      featurePanels.forEach((p) => p.classList.remove('active'))
      const item = featureItems.find((i) => i.getAttribute('data-feature') === String(idx)) ?? featureItems[0]
      const panel = root.querySelector<HTMLElement>(`#panel-${idx}`) ?? featurePanels[0]
      item?.classList.add('active')
      panel?.classList.add('active')
      if (uiPanelTitle) uiPanelTitle.textContent = panelTitles[idx] ?? panelTitles[0]
    }
    const featureHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    featureItems.forEach((item) => {
      const trigger = item.querySelector<HTMLElement>('.feature-trigger')
      if (!trigger) return
      const fn = (e: Event) => {
        e.preventDefault()
        const idx = Number(item.getAttribute('data-feature') ?? '0')
        setFeature(idx)
      }
      trigger.addEventListener('click', fn)
      featureHandlers.push({ el: trigger, fn })
    })
    setFeature(Number(featureItems.find((i) => i.classList.contains('active'))?.getAttribute('data-feature') ?? '0'))

    // Walkthrough tabs
    const wtTabs = Array.from(root.querySelectorAll<HTMLButtonElement>('#wtTabs .wt-tab'))
    const wtPanels = Array.from(root.querySelectorAll<HTMLElement>('.wt-panel'))
    const setWalk = (idx: number) => {
      wtTabs.forEach((t, i) => t.classList.toggle('active', i === idx))
      wtPanels.forEach((p, i) => p.classList.toggle('active', i === idx))
    }
    const wtHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    wtTabs.forEach((t, idx) => {
      const fn = (e: Event) => {
        e.preventDefault()
        setWalk(idx)
      }
      t.addEventListener('click', fn)
      wtHandlers.push({ el: t, fn })
    })
    if (wtTabs.length) setWalk(wtTabs.findIndex((t) => t.classList.contains('active')) || 0)

    // Team tabs
    const teamTabs = Array.from(root.querySelectorAll<HTMLElement>('.teams-tabs .team-tab'))
    const teamPanels = Array.from(root.querySelectorAll<HTMLElement>('.teams-panel'))
    const switchTeam = (teamId: string, tabEl?: HTMLElement) => {
      teamTabs.forEach((t) => t.classList.remove('active'))
      teamPanels.forEach((p) => p.classList.remove('active'))
      tabEl?.classList.add('active')
      root.querySelector<HTMLElement>(`#team-${CSS.escape(teamId)}`)?.classList.add('active')
    }
    const teamHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    teamTabs.forEach((tab) => {
      const onClickAttr = tab.getAttribute('onclick') ?? ''
      const match = onClickAttr.match(/switchTeam\(this,\s*'([^']+)'\s*\)/)
      const teamId = match?.[1]
      if (!teamId) return
      const fn = (e: Event) => {
        e.preventDefault()
        switchTeam(teamId, tab)
      }
      tab.addEventListener('click', fn)
      teamHandlers.push({ el: tab, fn })
    })
    // Ensure initial active tab/panel
    const initialTeamTab = teamTabs.find((t) => t.classList.contains('active'))
    if (initialTeamTab) {
      const match = (initialTeamTab.getAttribute('onclick') ?? '').match(/switchTeam\(this,\s*'([^']+)'\s*\)/)
      if (match?.[1]) switchTeam(match[1], initialTeamTab)
    }

    // Industry modal
    const modalOverlay = root.querySelector<HTMLElement>('#industryModal')
    const modalTitle = root.querySelector<HTMLElement>('#modalTitle')
    const modalPain = root.querySelector<HTMLElement>('#modalPain')
    const modalOutcome = root.querySelector<HTMLElement>('#modalOutcome')
    const modalFeatures = root.querySelector<HTMLElement>('#modalFeatures')
    const closeModal = () => {
      modalOverlay?.classList.remove('open')
      document.body.style.overflow = ''
    }
    const openModal = (title: string, pain: string, features: string[], outcome: string) => {
      if (modalTitle) modalTitle.textContent = title
      if (modalPain) modalPain.textContent = pain
      if (modalOutcome) modalOutcome.textContent = outcome
      if (modalFeatures) {
        modalFeatures.innerHTML = features.map((f) => `<div class="modal-feature">${f}</div>`).join('')
      }
      modalOverlay?.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
    const industryData: Record<
      string,
      { title: string; pain: string; features: string[]; outcome: string }
    > = {
      manufacturing: {
        title: 'Manufacturing',
        pain: 'Onboarding 200-500 material vendors manually causes duplicate vendor codes, missing GST docs, and SAP data errors.',
        features: [
          'Material Vendor Workflow with QA routing',
          'Duplicate GST Detection on GSTIN entry',
          'Pre-Qualification trigger with weighted scoring',
          'Vendor self-assessment for technical criteria',
          'SAP Push on final approval with error guard',
        ],
        outcome: 'Vendor onboarding reduced from 15 days to 4. Zero duplicate vendor codes. SAP master accuracy improved significantly.',
      },
      realestate: {
        title: 'Real Estate & Construction',
        pain: 'Services and FM vendors managed over email, leading to delayed approvals and compliance gaps for RERA audits.',
        features: [
          'Services / FM Vendor Workflow with billing approval',
          'Section-wise approvals for statutory sections',
          'Annual re-KYC with expiry and aging tracking',
          'Payment tracking dashboard per vendor',
          'Full audit log exportable for RERA submissions',
        ],
        outcome: 'Full RERA-compliant vendor trail. Annual re-KYC reduces stale data. Payment visibility reduces disputes by over 50%.',
      },
      infra: {
        title: 'Infrastructure & EPC',
        pain: 'Multi-tier subcontractor compliance impossible without centralized records. Labour compliance and statutory docs scattered across departments.',
        features: [
          'Configurable approval matrix by vendor category',
          'Multi-level approval with QA and architecture',
          'Attachment management for compliance documents',
          'Immutable audit trail per subcontractor',
          'Periodic performance assessments by type',
        ],
        outcome: 'Subcontractor compliance centralized. Statutory docs retrievable in seconds for audit. Assessment drives vendor retention decisions.',
      },
      retail: {
        title: 'Retail & E-commerce',
        pain: 'Onboarding hundreds of suppliers across categories with product compliance, FSSAI, and GST validation handled manually.',
        features: [
          'Bulk invite dispatched to entire supplier groups',
          'Duplicate GST Detection and field validations',
          'Self-onboarding by supplier category',
          'Status Cards tracking approval progress',
          'Annual assessment dashboard per supplier',
        ],
        outcome: 'Supplier onboarding scaled to hundreds without headcount increase. GST defaulters blocked before payment. Full FSSAI compliance tracked.',
      },
      logistics: {
        title: 'Logistics & Supply Chain',
        pain: 'Fleet and service vendor re-KYC not triggered on time. Bank data and GST updates missed, causing payment rejections.',
        features: [
          'Aging Filters for overdue re-KYC identification',
          'Section-wise re-KYC initiation by admin',
          'Bank detail protection with finance approval step',
          'Change Log tracking all field-level updates',
          'Automated reminders until re-KYC completion',
        ],
        outcome: 'Payment rejections from stale bank data eliminated. Re-KYC completion rate improved from 40% to 90%.',
      },
      healthcare: {
        title: 'Healthcare & Pharma',
        pain: 'Medical device and pharma suppliers require CDSCO and FDA compliance verification before activation. Manual process misses renewals.',
        features: [
          'GST Defaulter Handling for statutory vendors',
          'Attachment management for CDSCO/FDA licenses',
          'Multi-level approval with QA pre-qualification',
          'Assessment frequency for license renewal tracking',
          'Export reports for regulatory submission',
        ],
        outcome: 'Zero compliance lapses with certified suppliers. Assessment tracks license renewal dates. Export supports regulatory submissions.',
      },
      bfsi: {
        title: 'BFSI',
        pain: 'IT and service vendor risk management mandated by RBI outsourcing guidelines. No centralized vendor risk trail.',
        features: [
          'RBI-specific configurable approval chain',
          'Risk assessment configured per RBI criteria',
          'Annual re-KYC refreshing all vendor data',
          'Audit log maintained per RBI record-keeping',
          'Compliance report exported for RBI submission',
        ],
        outcome: 'RBI audit-ready vendor records maintained. Vendor risk assessment scored and documented. Re-KYC trail satisfies outsourcing norms.',
      },
      it: {
        title: 'IT & Technology',
        pain: 'Global and local software vendors onboarded slowly. No vendor portal for bid comparison. Duplicate vendor codes in SAP.',
        features: [
          'Self-Onboarding Portal with tokenized secure link',
          'Duplicate GST Detection on vendor entry',
          'Auction participation: view, submit, and track bids',
          'SAP Push Trigger with reference number storage',
          'Event-based notifications for all actions',
        ],
        outcome: 'RFQ process fully digital. Vendor onboarding completed without internal user involvement. SAP data clean and accurate.',
      },
    }
    const industryCards = Array.from(root.querySelectorAll<HTMLElement>('.industry-card'))
    const industryHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []
    industryCards.forEach((card) => {
      const onclick = card.getAttribute('onclick') ?? ''
      const match = onclick.match(/openIndustryModal\('([^']+)'\)/)
      const key = match?.[1]
      if (!key || !industryData[key]) return
      const fn = (e: Event) => {
        e.preventDefault()
        const d = industryData[key]
        openModal(d.title, d.pain, d.features, d.outcome)
      }
      card.addEventListener('click', fn)
      industryHandlers.push({ el: card, fn })
    })
    const onModalBg = (e: Event) => {
      if (!modalOverlay) return
      if (e.target === modalOverlay) closeModal()
    }
    modalOverlay?.addEventListener('click', onModalBg)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKeyDown)
    const closeBtn = root.querySelector<HTMLElement>('.modal-close')
    const onCloseBtn = (e: Event) => {
      e.preventDefault()
      closeModal()
    }
    closeBtn?.addEventListener('click', onCloseBtn)

    const gsapCtx = gsap.context(() => {
      initTestCaseGsap(root)
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }, root)

    return () => {
      gsapCtx.revert()
      window.removeEventListener('scroll', onScroll)
      revealObserver.disconnect()
      counterObserver.disconnect()
      counterTimers.forEach((t) => window.clearInterval(t))
      featureHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      wtHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      teamHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      industryHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      modalOverlay?.removeEventListener('click', onModalBg)
      closeBtn?.removeEventListener('click', onCloseBtn)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [bodyHtml])

  return (
    <div ref={rootRef} className="vendor-mgmt-root min-h-dvh bg-[#F6F4EE]">
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
        <div style={{ padding: 24 }}>Vendor Management error: {loadError}</div>
      ) : bodyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <div style={{ padding: 24 }}>Loading…</div>
      )}
    </div>
  )
}

