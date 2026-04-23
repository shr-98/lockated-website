/**
 * Full-viewport loading state for product landing routes that fetch static HTML.
 * Shown until `bodyHtml` is ready (common on Vercel cold starts / slow networks).
 */
export function LandingPageLoader({ message = 'Loading page…' }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-5 bg-[#F6F4EE] px-6 text-center"
    >
      <div
        className="h-11 w-11 shrink-0 rounded-full border-2 border-[#c4b89d] border-t-[#DA7756] motion-reduce:border-[#DA7756] motion-safe:animate-spin"
        aria-hidden
      />
      <p className="max-w-xs text-sm font-medium leading-relaxed tracking-wide text-[#2C2C2C]/75">
        {message}
      </p>
    </div>
  )
}
