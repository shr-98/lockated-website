import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STORY_TIMELINE_ID = 'scroll-story-timeline' as const

/* CSS-in-JS: fade-in-up (used for step text) */
const fadeInUpCss = `
@keyframes story-fade-in-up {
  from { opacity: 0; transform: translate3d(0, 1rem, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
.story-fade-in-up { animation: story-fade-in-up 0.5s ease-out both; }
`

export type ScrollStoryStep = {
  id: string
  /** Short label, e.g. "Phase 1" */
  badge: string
  /** Optional badge color — defaults to primary */
  badgeClassName?: string
  title: string
  /** Use <strong> for bold primary emphasis */
  body: ReactNode
  imageSrc: string
  imageAlt: string
}

type ScrollStoryTimelineProps = {
  steps: ScrollStoryStep[]
  className?: string
  /** @default 400 — ms delay before creating ScrollTrigger (layout settle) */
  initDelayMs?: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * Scroll-driven storytelling: desktop = pinned 50/50 + bottom tabs, mobile = vertical cards (no pin).
 * GSAP: pin + ScrollTrigger, scrub: false, matchMedia (md: 768px), cleanup on unmount.
 */
export function ScrollStoryTimeline({
  steps,
  className = '',
  initDelayMs = 400,
}: ScrollStoryTimelineProps) {
  const totalSteps = steps.length
  const sectionRef = useRef<HTMLElement | null>(null)
  const pinRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const uid = useId()
  const styleId = `story-timeline-style-${uid.replace(/:/g, '')}`

  const scrollToStep = useCallback(
    (targetIndex: number) => {
      const st = stRef.current
      if (!st || targetIndex < 0 || targetIndex >= totalSteps) return
      const range = st.end - st.start
      const p = totalSteps <= 1 ? 0 : targetIndex / (totalSteps - 1)
      const y = st.start + p * range
      window.scrollTo({ top: y, behavior: 'smooth' })
    },
    [totalSteps],
  )

  // Animate text block on step change (0.5s fade-in-up)
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    )
  }, [activeStep])

  // Image layers: active vs inactive
  useLayoutEffect(() => {
    if (!sectionRef.current) return
    steps.forEach((_, i) => {
      const img = sectionRef.current?.querySelector<HTMLElement>(
        `[data-story-img="${i}"]`,
      )
      if (!img) return
      const isActive = i === activeStep
      gsap.to(img, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.05,
        duration: 0.6,
        ease: 'power2.out',
        pointerEvents: isActive ? 'auto' : 'none',
      })
    })
  }, [activeStep, steps])

  useEffect(() => {
    if (totalSteps < 1) return
    const sectionEl = sectionRef.current
    const pinEl = pinRef.current
    if (!sectionEl || !pinEl) return

    let initTimer: ReturnType<typeof setTimeout> | null = null
    let desktopCleanup: (() => void) | null = null

    initTimer = setTimeout(() => {
      const mm = gsap.matchMedia()
      mmRef.current = mm

      mm.add('(min-width: 768px)', () => {
        const onUpdate = (self: ScrollTrigger) => {
          // Spec: Math.floor(progress * totalSteps); clamp so progress === 1 stays in range
          const next = clamp(Math.floor(self.progress * totalSteps), 0, totalSteps - 1)
          setActiveStep((prev) => (prev === next ? prev : next))
        }

        const st = ScrollTrigger.create({
          id: STORY_TIMELINE_ID,
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${window.innerHeight * (totalSteps + 1)}`,
          pin: true,
          pinSpacing: true,
          scrub: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate,
        })
        stRef.current = st
        onUpdate(st) // initial

        desktopCleanup = () => {
          st.kill()
          stRef.current = null
        }

        return () => {
          desktopCleanup?.()
          desktopCleanup = null
        }
      })

    }, initDelayMs)

    return () => {
      if (initTimer) clearTimeout(initTimer)
      mmRef.current?.revert()
      mmRef.current = null
      ScrollTrigger.getAll()
        .filter((t) => t.vars.id === STORY_TIMELINE_ID)
        .forEach((t) => t.kill())
      stRef.current = null
    }
  }, [initDelayMs, totalSteps, steps.length])

  const s = activeStep
  const step = steps[s]

  return (
    <>
      <style id={styleId} dangerouslySetInnerHTML={{ __html: fadeInUpCss }} />
      <section
        ref={sectionRef}
        className={[
          'relative overflow-hidden',
          'bg-[#0a1628]/85',
          'px-5 md:px-12 lg:px-20 xl:px-28',
          'py-16 md:py-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Scroll-driven timeline"
      >
        {/* Overlays */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0a1628]/90 to-slate-950/90"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]"
          aria-hidden
        />

        {/* Mobile: vertical timeline, no pinning */}
        <div className="relative z-10 md:hidden">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-widest text-sky-400/90 uppercase">
              Story
            </p>
            <h2 className="mt-2 font-light text-2xl text-white/95 sm:text-3xl">Timeline</h2>
          </div>
          <div className="relative pl-4 border-l border-white/20">
            {steps.map((row, i) => (
              <article
                key={row.id}
                className="relative mb-10 last:mb-0 pl-6"
                data-story-mobile-step={i}
              >
                <div
                  className="absolute -left-[5px] top-0 size-2.5 rounded-full border-2 border-sky-400/80 bg-[#0a1628]"
                  aria-hidden
                />
                <div
                  className={[
                    'mb-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase',
                    row.badgeClassName ?? 'bg-[var(--primary,#DA7756)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {row.badge}
                </div>
                <h3 className="mb-2 font-light text-lg text-white/95">{row.title}</h3>
                <div className="text-sm font-light leading-relaxed text-white/80 [&>strong]:font-bold [&>strong]:text-[var(--primary,#DA7756)]">
                  {row.body}
                </div>
                <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  <img
                    src={row.imageSrc}
                    alt={row.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Desktop: pinned 50/50 + tabs */}
        <div
          ref={pinRef}
          className="relative z-10 hidden min-h-[100dvh] md:grid md:place-items-stretch"
        >
          <div className="grid h-full w-full min-h-0 max-w-7xl mx-auto grid-cols-2 items-center gap-10 lg:gap-16 py-12 lg:py-0">
            <div className="min-h-0">
              {step && (
                <div
                  key={step.id}
                  ref={textRef}
                  className="story-fade-in-up text-left"
                >
                  <div
                    className={[
                      'mb-3 inline-block rounded-full px-3.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase',
                      step.badgeClassName ?? 'bg-[var(--primary,#DA7756)]',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {step.badge}
                  </div>
                  <h2 className="mb-4 font-light text-3xl text-white/95 leading-tight lg:text-4xl">
                    {step.title}
                  </h2>
                  <div className="text-base font-light leading-relaxed text-white/80 [&>strong]:font-bold [&>strong]:text-[var(--primary,#DA7756)]">
                    {step.body}
                  </div>
                </div>
              )}
            </div>
            <div className="relative min-h-[min(52vh,28rem)] w-full">
              {steps.map((st, i) => (
                <div
                  key={st.id}
                  data-story-img={i}
                  className={[
                    'absolute inset-0',
                    i === 0 ? 'opacity-100' : 'opacity-0',
                    'pointer-events-none',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ transform: i === 0 ? 'scale(1)' : 'scale(1.05)' }}
                >
                  <img
                    src={st.imageSrc}
                    alt={st.imageAlt}
                    className="h-full w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-md md:bottom-10"
            role="tablist"
            aria-label="Timeline steps"
          >
            {steps.map((st, i) => (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={i === activeStep}
                className={[
                  'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  i === activeStep
                    ? 'bg-[var(--primary,#DA7756)] text-white shadow-lg shadow-[var(--primary,#DA7756)]/30'
                    : 'text-white/50 hover:text-white/80',
                ].join(' ')}
                onClick={() => {
                  setActiveStep(i)
                  scrollToStep(i)
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export const DEFAULT_SCROLL_STORY_STEPS: ScrollStoryStep[] = [
  {
    id: '1',
    badge: 'Discovery',
    title: 'Map the current chaos',
    body: (
      <>
        We capture how vendors enter today — email threads, L1/L2 in SAP, and{' '}
        <strong>where duplicates slip in</strong>. This becomes the baseline.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    imageAlt: 'Team reviewing documents',
  },
  {
    id: '2',
    badge: 'Design',
    title: 'Governed workflows first',
    body: (
      <>
        Approvals, QA, and finance gates are <strong>modeled in one matrix</strong>, not
        renegotiated in inboxes.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    imageAlt: 'Workflow whiteboard',
  },
  {
    id: '3',
    badge: 'Pilot',
    title: 'One line of business',
    body: (
      <>
        A <strong>single category</strong> goes live: invites, self-serve, duplicate GST
        checks, and portal visibility for vendors.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1521737711867-e3b75e117660?w=800&q=80',
    imageAlt: 'Team collaboration',
  },
  {
    id: '4',
    badge: 'Scale',
    title: 'Roll out by region',
    body: (
      <>
        Training, templates, and <strong>audit exports</strong> are standardized so each
        site replays the same play.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    imageAlt: 'Workshop',
  },
  {
    id: '5',
    badge: 'Integrate',
    title: 'SAP in the loop',
    body: (
      <>
        Pushes to SAP with stored refs; payment teams <strong>never outrun</strong> compliance
        checks.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    imageAlt: 'Server room abstract',
  },
  {
    id: '6',
    badge: 'Harden',
    title: 'Re-KYC and aging',
    body: (
      <>
        <strong>Section-wise re-KYC</strong>, expiries, and filters keep the master clean
        without a project team per refresh.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    imageAlt: 'Dashboard',
  },
  {
    id: '7',
    badge: 'Prove',
    title: 'Audit-ready trail',
    body: (
      <>
        Exports and logs match how regulators read the story — <strong>end to end</strong>,
        with owners on every line.
      </>
    ),
    imageSrc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    imageAlt: 'Compliance',
  },
]
