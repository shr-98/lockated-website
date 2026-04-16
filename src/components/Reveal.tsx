import { type HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

type RevealProps = {
  /** Delay in ms (stagger). */
  delay?: number
  /** Vertical offset in px for the entrance motion. */
  y?: number
  /** Reveal again when leaving viewport. Default false (one-time). */
  repeat?: boolean
  /** IntersectionObserver threshold. */
  threshold?: number
  /** IntersectionObserver rootMargin. */
  rootMargin?: string
} & HTMLAttributes<HTMLDivElement>

export function Reveal({
  delay,
  y,
  repeat = false,
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [inView, setInView] = useState(prefersReducedMotion)

  const mergedStyle = useMemo(() => {
    const next = { ...(style ?? {}) } as React.CSSProperties & {
      ['--reveal-delay']?: string
      ['--reveal-y']?: string
    }
    if (typeof delay === 'number') next['--reveal-delay'] = `${delay}ms`
    if (typeof y === 'number') next['--reveal-y'] = `${y}px`
    return next as React.CSSProperties
  }, [delay, style, y])

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
          } else if (repeat) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [prefersReducedMotion, repeat, rootMargin, threshold])

  return (
    <div
      ref={ref}
      className={['reveal', inView ? 'reveal--in' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  )
}

