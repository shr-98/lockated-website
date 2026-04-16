import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { slugContent } from '../content/slugContent'

function MultilineHeading(props: { text: string; className?: string }) {
  const parts = props.text.split('\n')
  return (
    <span className={props.className}>
      {parts.map((p, idx) => (
        <span key={`${p}-${idx}`}>
          {p}
          {idx < parts.length - 1 ? <br /> : null}
        </span>
      ))}
    </span>
  )
}

export default function SlugPage() {
  const location = useLocation()
  const pathname = useMemo(() => {
    const p = location.pathname.replace(/\/+$/, '')
    return p.length ? p : '/'
  }, [location.pathname])
  const content = useMemo(() => slugContent[pathname], [pathname])

  const title = content?.title ?? 'Lockated'
  const eyebrow = content?.eyebrow ?? 'Lockated'
  const primaryCtaLabel = content?.primaryCtaLabel
  const primaryCtaHref = content?.primaryCtaHref
  const template = content?.template ?? 'default'
  const [pricingCycle, setPricingCycle] = useState<'Monthly' | 'Yearly'>('Monthly')
  const isResidentialProperty = pathname === '/residential-property'
  const isCommercialProperty = pathname === '/commercial-property'
  const isOffices = pathname === '/offices'
  const isCommercialBuildings = pathname === '/commercial-buildings'
  const isHotels = pathname === '/hotels'
  const isResidentialCommunities = pathname === '/residential-communities'
  const isRealEstateDeveloper = pathname === '/real-estate-developer'
  const isLeadManagement = pathname === '/lead-management'
  const isSiteManagement = pathname === '/site-management'
  const isBrokersManagement = pathname === '/brokers-management'
  const isSnaggingQc = pathname === '/snagging-qc-management'
  const isHandoverManagement = pathname === '/handover-management'

  return (
    <>
      {!isOffices &&
      !isCommercialBuildings &&
      !isHotels &&
      !isResidentialCommunities &&
      !isRealEstateDeveloper &&
      !isLeadManagement &&
      !isSiteManagement &&
      !isBrokersManagement &&
      !isSnaggingQc &&
      !isHandoverManagement ? (
        <section
          className={`relative overflow-hidden border-b border-slate-200 ${
            template === 'property' ? 'min-h-[72vh] sm:min-h-[80vh]' : ''
          }`}
        >
          {template === 'property' && content?.heroBackgroundImage ? (
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${content.heroBackgroundImage})` }}
              />
              <div
                className={`absolute inset-0 ${isResidentialProperty ? 'bg-black/50' : 'bg-black/55'}`}
              />
            </div>
          ) : (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_10%_-20%,rgba(99,102,241,0.16),transparent_50%),radial-gradient(900px_circle_at_100%_0%,rgba(168,85,247,0.12),transparent_45%)]" />
            </div>
          )}

          <div
            className={`relative mx-auto max-w-screen-2xl px-4 lg:px-10 ${
              template === 'property'
                ? isResidentialProperty || isCommercialProperty
                  ? 'flex min-h-[72vh] flex-col justify-center py-14 sm:min-h-[80vh] sm:py-16'
                  : 'flex min-h-[72vh] flex-col justify-center py-14 sm:min-h-[80vh] sm:py-16'
                : 'py-8 sm:py-12'
            }`}
          >
            {!isCommercialProperty ? (
              <p
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                  template === 'property' ? 'text-white/80' : 'text-slate-500'
                }`}
              >
                {eyebrow}
              </p>
            ) : null}
            <h1
              className={`text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl ${
                template === 'property' ? 'text-white' : 'text-slate-900'
              } ${
                isResidentialProperty || isCommercialProperty
                  ? 'text-center font-heading text-4xl sm:text-5xl md:text-[53px]'
                  : ''
              } ${!isCommercialProperty ? 'mt-3 sm:mt-4' : ''}`}
            >
              <MultilineHeading text={title} />
            </h1>
            {!isResidentialProperty && !isCommercialProperty ? (
              <>
                {content?.subtitle ? (
                  <h2
                    className={`mt-3 text-xl font-semibold sm:text-2xl ${
                      template === 'property' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {content.subtitle}
                  </h2>
                ) : null}
                {content?.intro ? (
                  <p
                    className={`mt-3 max-w-3xl text-sm leading-6 sm:mt-4 sm:text-base ${
                      template === 'property' ? 'text-white/80' : 'text-slate-600'
                    }`}
                  >
                    {content.intro}
                  </p>
                ) : null}
              </>
            ) : null}

            {primaryCtaLabel && primaryCtaHref && !isCommercialProperty ? (
              <div
                className={`mt-6 flex flex-wrap gap-3 ${
                  isResidentialProperty || isCommercialProperty ? 'justify-center' : ''
                }`}
              >
                <a
                  href={primaryCtaHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#f6d54a] px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f2cc2a] sm:px-6 sm:py-3"
                >
                  {primaryCtaLabel}
                </a>
                {!isResidentialProperty && !isCommercialProperty ? (
                  <Link
                    to="/contact-us"
                    className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10 sm:px-6 sm:py-3 ${
                      template === 'property'
                        ? 'border border-white/40 bg-transparent text-white'
                        : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Contact Us
                  </Link>
                ) : null}
              </div>
            ) : null}
            {content?.purposeImage && !isResidentialProperty && !isCommercialProperty && (
              <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={content.purposeImage}
                    alt={content.purposeImageAlt ?? ''}
                    className="h-36 w-full object-cover sm:h-72"
                    loading="lazy"
                  />
                </div>
                <div>
                  {content.featuresTitle && (
                    <div className="text-sm font-semibold text-slate-900">{content.featuresTitle}</div>
                  )}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {(content.features ?? []).slice(0, 4).map((f) => (
                      <div
                        key={f.title}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 sm:h-10 sm:w-10">
                          <img
                            src={f.icon}
                            alt=""
                            className="h-6 w-6 sm:h-7 sm:w-7"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{f.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {isResidentialCommunities ? (
        <>
          <section className="bg-black">
            <div className="mx-auto flex min-h-[46vh] max-w-[900px] items-start px-4 pb-[25px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-bold leading-[1.4] text-white sm:text-[38px]">
                <MultilineHeading text={title} />
              </h1>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal leading-[1.3] text-slate-900 md:text-left md:text-[35px]">
                    {content?.subtitle}
                  </h2>
                  {content?.intro ? (
                    <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-justify md:text-[18px]">
                      {content.intro}
                    </p>
                  ) : null}
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/residential-community-bg.jpg"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.featuresTitle ?? 'Sailent Features'}
              </h2>
            </div>
          </section>

          <section className="bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-16 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-10 md:pr-[10%]">
                  {(content?.features ?? []).slice(0, 3).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 1 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  {content?.showcaseImage ? (
                    <img
                      src={content.showcaseImage}
                      alt={content.showcaseAlt ?? ''}
                      className="h-auto w-full max-w-[420px] md:max-w-none md:w-4/5"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="space-y-10 md:pl-[10%]">
                  {(content?.features ?? []).slice(3, 6).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 0 || idx === 2 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.secondaryFeaturesTitle ?? 'Sailent features like this'}
              </h2>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 pb-6 lg:px-10">
              <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {(content?.secondaryFeatures ?? []).slice(0, 6).map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-16 w-16" loading="lazy" />
                    <div className="mt-2 font-heading text-[18px] font-normal leading-[1.4] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Product Walkthrough
              </h2>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/bg-home-new4.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="text-center">
                  <div className="font-heading text-[32px] font-black text-slate-900 sm:text-[40px]">
                    Residential Community
                  </div>
                  <div className="font-heading text-[32px] font-normal text-slate-900 sm:text-[40px]">
                    For Residents
                  </div>
                </div>
                <div>
                  <a
                    href={content?.walkthroughUrl ?? '#'}
                    target={content?.walkthroughUrl ? '_blank' : undefined}
                    rel={content?.walkthroughUrl ? 'noreferrer' : undefined}
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    {content?.walkthroughThumb ? (
                      <img
                        src={content.walkthroughThumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                        ▶
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/mid-way.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="md:order-1">
                  <a
                    href={content?.walkthrough2Url ?? '#'}
                    target={content?.walkthrough2Url ? '_blank' : undefined}
                    rel={content?.walkthrough2Url ? 'noreferrer' : undefined}
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    {content?.walkthrough2Thumb ? (
                      <img
                        src={content.walkthrough2Thumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                        ▶
                      </div>
                    </div>
                  </a>
                </div>
                <div className="text-center md:order-2">
                  <div className="font-heading text-[32px] font-black text-slate-900 sm:text-[40px]">
                    Residential Community
                  </div>
                  <div className="font-heading text-[32px] font-normal leading-[1.2] text-slate-900 sm:text-[40px]">
                    For Management
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-14 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                {content?.showPricingPlans ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-base font-semibold text-slate-900" />
                      <div className="inline-flex w-full max-w-xs rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-auto">
                        {(['Monthly', 'Yearly'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setPricingCycle(v)}
                            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                              pricingCycle === v
                                ? 'bg-[#f6d54a] text-slate-900'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      {(content.pricingPlans ?? []).map((p) => {
                        const price = pricingCycle === 'Monthly' ? p.priceMonthly : p.priceYearly
                        return (
                          <div
                            key={p.title}
                            className={`rounded-2xl border p-6 shadow-sm ${
                              p.featured
                                ? 'border-[#f6d54a] bg-white ring-2 ring-[#f6d54a]/30'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-lg font-semibold text-slate-900">{p.title}</div>
                                {p.badge ? (
                                  <div className="mt-1 inline-flex rounded-full bg-[#f6d54a]/25 px-3 py-1 text-xs font-semibold text-slate-900">
                                    {p.badge}
                                  </div>
                                ) : null}
                              </div>
                              {p.featured ? (
                                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                  Popular
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-6 flex items-end gap-2">
                              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                                {p.currencySymbol ?? '₹'}
                                {price}
                              </div>
                              <div className="pb-1 text-sm font-semibold text-slate-500">
                                / {pricingCycle.toLowerCase()}
                              </div>
                            </div>

                            <ul className="mt-5 space-y-2 text-sm text-slate-700">
                              {p.features.map((f) => (
                                <li key={f} className="flex gap-2">
                                  <span className="mt-0.5 text-[#f6d54a]" aria-hidden>
                                    ✓
                                  </span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-6">
                              <a
                                href={primaryCtaHref ?? '#demo'}
                                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                                  p.featured
                                    ? 'bg-[#f6d54a] text-slate-900 hover:bg-[#f2cc2a]'
                                    : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                {p.ctaLabel}
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isHotels ? (
        <>
          <section className="bg-black">
            <div className="mx-auto flex min-h-[46vh] max-w-[900px] items-start px-4 pb-[25px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-bold leading-[1.4] text-white sm:text-[38px]">
                {title}
              </h1>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal leading-[1.3] text-slate-900 md:text-left md:text-[35px]">
                    {content?.subtitle}
                  </h2>
                  {content?.intro ? (
                    <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-justify md:text-[18px]">
                      {content.intro}
                    </p>
                  ) : null}
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/hotels-client-type.jpg"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.featuresTitle ?? 'Sailent Features'}
              </h2>
            </div>
          </section>

          <section className="bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-16 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-10 md:pr-[10%]">
                  {(content?.features ?? []).slice(0, 3).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 1 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  {content?.showcaseImage ? (
                    <img
                      src={content.showcaseImage}
                      alt={content.showcaseAlt ?? ''}
                      className="h-auto w-full max-w-[420px] md:max-w-none md:w-4/5"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="space-y-10 md:pl-[10%]">
                  {(content?.features ?? []).slice(3, 6).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 0 || idx === 2 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.secondaryFeaturesTitle ?? 'Additional features'}
              </h2>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 pb-6 lg:px-10">
              <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {(content?.secondaryFeatures ?? []).slice(0, 6).map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-16 w-16" loading="lazy" />
                    <div className="mt-2 font-heading text-[18px] font-normal leading-[1.4] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          {(() => {
            const blocks = (content?.sections ?? []).slice(0, 4)
            const backgrounds = [
              '/lockated/pages/access-visitor-management-2.png',
              '/lockated/pages/hotel-room-scaled.jpg',
              '/lockated/pages/contactless-payments.jpg',
              '/lockated/pages/access-visitor-management-2.png',
            ]
            const layouts: Array<'imageLeft' | 'imageRight'> = [
              'imageLeft',
              'imageRight',
              'imageLeft',
              'imageRight',
            ]
            return blocks.map((s, idx) => {
              const imageColFirst = layouts[idx] === 'imageLeft'
              const bg = backgrounds[idx] ?? backgrounds[0]
              return (
                <section
                  key={s.title}
                  className="relative"
                  style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative mx-auto max-w-[976px] px-4 py-10">
                    <div className="grid min-h-[510px] items-center gap-0 md:grid-cols-3">
                      <div
                        className={`h-full min-h-[220px] bg-[#e1e1e1] md:col-span-1 ${
                          imageColFirst ? '' : 'md:order-2'
                        }`}
                      >
                        {s.image ? (
                          <div className="flex h-full items-center justify-center p-4">
                            <img
                              src={s.image}
                              alt=""
                              className="h-auto w-4/5"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className={`md:col-span-2 ${imageColFirst ? '' : 'md:order-1'}`}>
                        <div className="px-6 py-10 md:px-[100px]">
                          <h3 className="text-center font-heading text-2xl font-medium text-white sm:text-3xl">
                            {s.title}
                          </h3>
                          {s.description ? (
                            <p className="mt-6 text-center font-heading text-base font-medium leading-7 text-white sm:text-lg">
                              {s.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })
          })()}

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isCommercialBuildings ? (
        <>
          <section className="bg-black">
            <div className="mx-auto flex min-h-[46vh] max-w-[900px] items-start px-4 pb-[25px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-bold leading-[1.4] text-white sm:text-[38px]">
                {title}
              </h1>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal leading-[1.3] text-slate-900 md:text-left md:text-[35px]">
                    {content?.subtitle}
                  </h2>
                  {content?.intro ? (
                    <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-justify md:text-[18px]">
                      {content.intro}
                    </p>
                  ) : null}
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/commercial-client-type-bg-1.jpg"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.featuresTitle ?? 'Sailent Features'}
              </h2>
            </div>
          </section>

          <section className="bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-16 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-10 md:pr-[10%]">
                  {(content?.features ?? []).slice(0, 3).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 1 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  {content?.showcaseImage ? (
                    <img
                      src={content.showcaseImage}
                      alt={content.showcaseAlt ?? ''}
                      className="h-auto w-full max-w-[420px] md:max-w-none md:w-4/5"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="space-y-10 md:pl-[10%]">
                  {(content?.features ?? []).slice(3, 6).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 0 || idx === 2 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.secondaryFeaturesTitle ?? 'Sailent features like this'}
              </h2>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 pb-6 lg:px-10">
              <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {(content?.secondaryFeatures ?? []).slice(0, 6).map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-16 w-16" loading="lazy" />
                    <div className="mt-2 font-heading text-[18px] font-normal leading-[1.4] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Product Walkthrough
              </h2>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/bg-home-new4.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="text-center">
                  <div className="font-heading text-[32px] font-black text-slate-900 sm:text-[40px]">
                    FM Matrix
                  </div>
                  <div className="font-heading text-[32px] font-normal text-slate-900 sm:text-[40px]">
                    For Tenants
                  </div>
                </div>
                <div>
                  <a
                    href={content?.walkthroughUrl ?? '#'}
                    target={content?.walkthroughUrl ? '_blank' : undefined}
                    rel={content?.walkthroughUrl ? 'noreferrer' : undefined}
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    {content?.walkthroughThumb ? (
                      <img
                        src={content.walkthroughThumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                        ▶
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/mid-way.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="md:order-1">
                  <a
                    href={content?.walkthrough2Url ?? '#'}
                    target={content?.walkthrough2Url ? '_blank' : undefined}
                    rel={content?.walkthrough2Url ? 'noreferrer' : undefined}
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    {content?.walkthrough2Thumb ? (
                      <img
                        src={content.walkthrough2Thumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                        ▶
                      </div>
                    </div>
                  </a>
                </div>
                <div className="text-center md:order-2">
                  <div className="font-heading text-[32px] font-black text-slate-900 sm:text-[40px]">
                    FM Matrix
                  </div>
                  <div className="font-heading text-[32px] font-normal leading-[1.2] text-slate-900 sm:text-[40px]">
                    For Facility Managers
                    <br />
                    and Management
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Why leading companies choose Lockated
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading Customer Success team based across the globe.',
                    icon: '/lockated/replica/003-support.png',
                  },
                  {
                    title: 'Powerful Access Control Integrations',
                    desc: 'Explore the dept and volume of possibilities with first-rate systems.',
                    icon: '/lockated/replica/004-access-control.png',
                  },
                  {
                    title: 'Best-of-breed Applications',
                    desc: 'Work with tools your team already uses for seamless implementations.',
                    icon: '/lockated/replica/002-iot.png',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Trust in the only VMS with full ISAE 3000 Type | Privacy Attestation.',
                    icon: '/lockated/replica/005-secure-data.png',
                  },
                  {
                    title: 'Proven and Innovative',
                    desc: 'Rely on the team that’s supported 30 million visits at 7,000 locations.',
                    icon: '/lockated/replica/001-idea.png',
                  },
                  {
                    title: 'Truly Unlimited',
                    desc: 'Scale with the only VMS offering unlimited visitors, hots, and kiosks.',
                    icon: '/lockated/replica/006-domain.png',
                  },
                ].map((b) => (
                  <div key={b.title} className="text-center">
                    <img src={b.icon} alt="" className="mx-auto h-12 w-12" loading="lazy" />
                    <div className="mt-5 inline-flex rounded-lg bg-[#facc48] px-3 py-1.5 font-heading text-lg">
                      {b.title}
                    </div>
                    <p className="mt-4 px-6 text-sm font-light leading-6 text-slate-700">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-14 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                {content?.showPricingPlans ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-base font-semibold text-slate-900" />
                      <div className="inline-flex w-full max-w-xs rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-auto">
                        {(['Monthly', 'Yearly'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setPricingCycle(v)}
                            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                              pricingCycle === v
                                ? 'bg-[#f6d54a] text-slate-900'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      {(content.pricingPlans ?? []).map((p) => {
                        const price = pricingCycle === 'Monthly' ? p.priceMonthly : p.priceYearly
                        return (
                          <div
                            key={p.title}
                            className={`rounded-2xl border p-6 shadow-sm ${
                              p.featured
                                ? 'border-[#f6d54a] bg-white ring-2 ring-[#f6d54a]/30'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-lg font-semibold text-slate-900">{p.title}</div>
                                {p.badge ? (
                                  <div className="mt-1 inline-flex rounded-full bg-[#f6d54a]/25 px-3 py-1 text-xs font-semibold text-slate-900">
                                    {p.badge}
                                  </div>
                                ) : null}
                              </div>
                              {p.featured ? (
                                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                  Popular
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-6 flex items-end gap-2">
                              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                                {p.currencySymbol ?? '₹'}
                                {price}
                              </div>
                              <div className="pb-1 text-sm font-semibold text-slate-500">
                                / {pricingCycle.toLowerCase()}
                              </div>
                            </div>

                            <ul className="mt-5 space-y-2 text-sm text-slate-700">
                              {p.features.map((f) => (
                                <li key={f} className="flex gap-2">
                                  <span className="mt-0.5 text-[#f6d54a]" aria-hidden>
                                    ✓
                                  </span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-6">
                              <a
                                href={primaryCtaHref ?? '#demo'}
                                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                                  p.featured
                                    ? 'bg-[#f6d54a] text-slate-900 hover:bg-[#f2cc2a]'
                                    : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                {p.ctaLabel}
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isOffices ? (
        <>
          <section className="bg-black">
            <div className="mx-auto flex min-h-[46vh] max-w-[900px] items-start px-4 pb-[25px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-bold leading-[1.4] text-white sm:text-[38px]">
                {title}
              </h1>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal leading-[1.3] text-slate-900 md:text-left md:text-[35px]">
                    {content?.subtitle}
                  </h2>
                  {content?.intro ? (
                    <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-justify md:text-[18px]">
                      {content.intro}
                    </p>
                  ) : null}
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  {content?.purposeImage ? (
                    <div className="bg-white">
                      <img
                        src={content.purposeImage}
                        alt=""
                        className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.featuresTitle ?? 'Sailent Features'}
              </h2>
            </div>
          </section>

          <section className="bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-16 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-10 md:pr-[10%]">
                  {(content?.features ?? []).slice(0, 3).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 1 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  {content?.showcaseImage ? (
                    <img
                      src={content.showcaseImage}
                      alt={content.showcaseAlt ?? ''}
                      className="h-auto w-full max-w-[420px] md:max-w-none md:w-4/5"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="space-y-10 md:pl-[10%]">
                  {(content?.features ?? []).slice(3, 6).map((f, idx) => (
                    <div
                      key={f.title}
                      className={`rounded-sm border-dotted border-slate-400/70 py-2 ${
                        idx === 0 || idx === 2 ? 'border-r-[5px]' : 'border-l-[5px]'
                      }`}
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[20px] text-slate-900">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.secondaryFeaturesTitle ?? 'Additional features'}
              </h2>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 pb-6 lg:px-10">
              <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {(content?.secondaryFeatures ?? []).slice(0, 6).map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-16 w-16" loading="lazy" />
                    <div className="mt-2 font-heading text-[18px] font-normal leading-[1.4] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.walkthroughTitle ?? 'Product Walkthrough'}
              </h2>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/bg-home-new4.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="text-center">
                  <div className="font-heading text-[32px] font-black text-slate-900 sm:text-[40px]">
                    FM Matrix
                  </div>
                  <div className="font-heading text-[32px] font-normal text-slate-900 sm:text-[40px]">
                    For Employees
                  </div>
                </div>
                <div>
                  <a
                    href={content?.walkthroughUrl ?? '#'}
                    target={content?.walkthroughUrl ? '_blank' : undefined}
                    rel={content?.walkthroughUrl ? 'noreferrer' : undefined}
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    {content?.walkthroughThumb ? (
                      <img
                        src={content.walkthroughThumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                        ▶
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/mid-way.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="md:order-1">
                  <a
                    href={content?.walkthrough2Url ?? '#'}
                    target={content?.walkthrough2Url ? '_blank' : undefined}
                    rel={content?.walkthrough2Url ? 'noreferrer' : undefined}
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    {content?.walkthrough2Thumb ? (
                      <img
                        src={content.walkthrough2Thumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                        ▶
                      </div>
                    </div>
                  </a>
                </div>
                <div className="text-center md:order-2">
                  <div className="font-heading text-[32px] font-black text-slate-900 sm:text-[40px]">
                    FM Matrix
                  </div>
                  <div className="font-heading text-[32px] font-normal leading-[1.2] text-slate-900 sm:text-[40px]">
                    For Facility Managers
                    <br />
                    and Management
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Why leading companies choose Lockated
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading Customer Success team based across the globe.',
                    icon: '/lockated/replica/003-support.png',
                  },
                  {
                    title: 'Powerful Access Control Integrations',
                    desc: 'Explore the dept and volume of possibilities with first-rate systems.',
                    icon: '/lockated/replica/004-access-control.png',
                  },
                  {
                    title: 'Best-of-breed Applications',
                    desc: 'Work with tools your team already uses for seamless implementations.',
                    icon: '/lockated/replica/002-iot.png',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Trust in the only VMS with full ISAE 3000 Type | Privacy Attestation.',
                    icon: '/lockated/replica/005-secure-data.png',
                  },
                  {
                    title: 'Proven and Innovative',
                    desc: 'Rely on the team that’s supported 30 million visits at 7,000 locations.',
                    icon: '/lockated/replica/001-idea.png',
                  },
                  {
                    title: 'Truly Unlimited',
                    desc: 'Scale with the only VMS offering unlimited visitors, hots, and kiosks.',
                    icon: '/lockated/replica/006-domain.png',
                  },
                ].map((b) => (
                  <div key={b.title} className="text-center">
                    <img src={b.icon} alt="" className="mx-auto h-12 w-12" loading="lazy" />
                    <div className="mt-5 inline-flex rounded-lg bg-[#facc48] px-3 py-1.5 font-heading text-lg">
                      {b.title}
                    </div>
                    <p className="mt-4 px-6 text-sm font-light leading-6 text-slate-700">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-14 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                {content?.showPricingPlans ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-base font-semibold text-slate-900" />
                      <div className="inline-flex w-full max-w-xs rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-auto">
                        {(['Monthly', 'Yearly'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setPricingCycle(v)}
                            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                              pricingCycle === v
                                ? 'bg-[#f6d54a] text-slate-900'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      {(content.pricingPlans ?? []).map((p) => {
                        const price = pricingCycle === 'Monthly' ? p.priceMonthly : p.priceYearly
                        return (
                          <div
                            key={p.title}
                            className={`rounded-2xl border p-6 shadow-sm ${
                              p.featured
                                ? 'border-[#f6d54a] bg-white ring-2 ring-[#f6d54a]/30'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-lg font-semibold text-slate-900">{p.title}</div>
                                {p.badge ? (
                                  <div className="mt-1 inline-flex rounded-full bg-[#f6d54a]/25 px-3 py-1 text-xs font-semibold text-slate-900">
                                    {p.badge}
                                  </div>
                                ) : null}
                              </div>
                              {p.featured ? (
                                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                  Popular
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-6 flex items-end gap-2">
                              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                                {p.currencySymbol ?? '₹'}
                                {price}
                              </div>
                              <div className="pb-1 text-sm font-semibold text-slate-500">
                                / {pricingCycle.toLowerCase()}
                              </div>
                            </div>

                            <ul className="mt-5 space-y-2 text-sm text-slate-700">
                              {p.features.map((f) => (
                                <li key={f} className="flex gap-2">
                                  <span className="mt-0.5 text-[#f6d54a]" aria-hidden>
                                    ✓
                                  </span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-6">
                              <a
                                href={primaryCtaHref ?? '#demo'}
                                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                                  p.featured
                                    ? 'bg-[#f6d54a] text-slate-900 hover:bg-[#f2cc2a]'
                                    : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                {p.ctaLabel}
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isCommercialProperty ? (
        <>
          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-10">
              {content?.subtitle ? (
                <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                  <MultilineHeading text={content.subtitle} />
                </h2>
              ) : null}
              {content?.intro ? (
                <p className="mt-6 text-center text-[15px] font-light leading-[1.7] text-slate-700 sm:text-[18px]">
                  {content.intro}
                </p>
              ) : null}
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 pb-12">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-6">
              <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                {content?.featuresTitle ?? 'Solution Applicability'}
              </h2>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 pb-10 lg:px-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {(content?.features ?? []).slice(0, 5).map((f) => {
                  const to =
                    f.title === 'Corporate Office'
                      ? '/offices'
                      : f.title === 'Multi Tenant Buildings'
                        ? '/commercial-buildings'
                        : f.title === 'Hotels'
                          ? '/hotels'
                          : null
                  const body = (
                    <>
                      <div className="bg-white">
                        <img src={f.icon} alt="" className="w-full object-cover" loading="lazy" />
                      </div>
                      <div className="mt-3 text-center font-heading text-lg font-medium text-slate-900">
                        {f.title}
                      </div>
                    </>
                  )
                  return to ? (
                    <Link
                      key={f.title}
                      to={to}
                      className="group block bg-white transition-shadow hover:shadow-[0_0_5px_rgba(0,0,0,0.5)]"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div key={f.title} className="bg-white">
                      {body}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {(() => {
            const blocks = (content?.sections ?? []).filter(
              (s) => s.title.toLowerCase() !== 'clients',
            )
            const layouts: Array<'imageLeft' | 'imageRight' | 'noImage'> = [
              'noImage',
              'noImage',
              'noImage',
              'imageRight',
              'imageLeft',
              'imageRight',
            ]
            return blocks.slice(0, 6).map((s, idx) => {
              const layout = layouts[idx] ?? 'imageLeft'
              const showImage = layout !== 'noImage' && !!s.image
              const imageColFirst = layout === 'imageLeft'
              return (
                <section
                  key={s.title}
                  className="relative"
                  style={{
                    backgroundImage:
                      'url(/lockated/pages/access-visitor-management-2.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative mx-auto max-w-[976px] px-4 py-10">
                    <div className="grid min-h-[510px] items-center gap-0 md:grid-cols-3">
                      <div
                        className={`h-full min-h-[220px] md:col-span-1 ${
                          imageColFirst ? '' : 'md:order-2'
                        }`}
                      >
                        {showImage ? (
                          <div className="flex h-full items-center justify-center p-4">
                            <img
                              src={s.image}
                              alt=""
                              className="h-auto w-full"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                      </div>
                      <div
                        className={`md:col-span-2 ${
                          imageColFirst ? '' : 'md:order-1'
                        }`}
                      >
                        <div className="px-6 py-10 md:px-[100px]">
                          <h3 className="text-center font-heading text-2xl font-medium text-white sm:text-3xl">
                            {s.title}
                          </h3>
                          {s.description ? (
                            <p className="mt-6 text-center font-heading text-base font-medium leading-7 text-white sm:text-lg">
                              {s.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })
          })()}

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-8">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-10">
              <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                Some of our Clients
              </h2>
              <div className="mt-8">
                <img
                  src="/lockated/pages/clientile-fullsize.png"
                  alt="Clients"
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-10">
              <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                Why leading companies choose Lockated
              </h2>
              <div className="mx-auto mt-10 grid max-w-6xl gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading Customer Success team based across the globe.',
                    icon: '/lockated/replica/003-support.png',
                  },
                  {
                    title: 'Powerful Access Control Integrations',
                    desc: 'Explore the dept and volume of possibilities with first-rate systems.',
                    icon: '/lockated/replica/004-access-control.png',
                  },
                  {
                    title: 'Best-of-breed Applications',
                    desc: 'Work with tools your team already uses for seamless implementations.',
                    icon: '/lockated/replica/002-iot.png',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Trust in the only VMS with full ISAE 3000 Type | Privacy Attestation.',
                    icon: '/lockated/replica/005-secure-data.png',
                  },
                  {
                    title: 'Proven and Innovative',
                    desc: "Rely on the team that's supported 30 million visits at 7,000 locations.",
                    icon: '/lockated/replica/001-idea.png',
                  },
                  {
                    title: 'Truly Unlimited',
                    desc: 'Scale with the only VMS offering unlimited visitors, hosts, and kiosks.',
                    icon: '/lockated/replica/006-domain.png',
                  },
                ].map((b) => (
                  <div key={b.title} className="flex flex-col items-center px-2 text-center sm:px-8">
                    <img src={b.icon} alt="" className="h-14 w-14 object-contain" loading="lazy" />
                    <div className="mt-4 rounded-lg bg-[#facc48] px-1.5 py-1">
                      <h3 className="font-heading text-[18px] font-medium text-black">{b.title}</h3>
                    </div>
                    <p className="mt-3 max-w-sm font-heading text-[15px] font-light leading-[1.4] text-black">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/pages/contact-us.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative mx-auto max-w-[900px] px-4 py-14">
              <h2 className="text-center font-heading text-2xl font-medium text-white sm:text-3xl">
                Schedule a Demo Today
              </h2>
              {content?.showDemoForm ? (
                <div
                  id="demo"
                  className="mt-10 scroll-mt-24 rounded-2xl border border-white/20 bg-black/10 p-6"
                >
                  <form className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>First Name</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="First Name"
                        name="firstName"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Last Name</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Last Name"
                        name="lastName"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80 sm:col-span-2">
                      <span>Work Email</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Work Email"
                        name="email"
                        type="email"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Phone Number</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Phone Number"
                        name="phone"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Company Name</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Company Name"
                        name="company"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Country / Region</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Country / Region"
                        name="country"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Your Real Estate Category</span>
                      <select
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        name="category"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Your Real Estate Category
                        </option>
                        <option>Corporate Office</option>
                        <option>Commercial Building</option>
                        <option>Residential Community</option>
                        <option>Real Estate Developer</option>
                        <option>Hotel & Hospitality</option>
                        <option>Warehouse & Logistics</option>
                        <option>Mixed Use</option>
                        <option>Industrial</option>
                      </select>
                    </label>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 sm:col-span-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                      >
                        Request Call Back
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      {isResidentialProperty ? (
        <>
          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-10">
              {content?.subtitle ? (
                <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                  {content.subtitle}
                </h2>
              ) : null}
              {content?.intro ? (
                <p className="mt-6 text-center font-heading text-base leading-8 text-slate-600 sm:text-xl">
                  {content.intro}
                </p>
              ) : null}
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 pb-10">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-6">
              <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                The Platform
              </h2>
            </div>
          </section>

          {(() => {
            const blocks = (content?.sections ?? []).filter(
              (s) => s.title.toLowerCase() !== 'clients',
            )
            const layouts: Array<'imageLeft' | 'imageRight' | 'noImage'> = [
              'imageLeft',
              'imageRight',
              'noImage',
              'imageRight',
              'imageLeft',
              'imageRight',
            ]
            return blocks.slice(0, 6).map((s, idx) => {
              const layout = layouts[idx] ?? 'imageLeft'
              const image = s.image
              const showImage = layout !== 'noImage' && !!image
              const imageColFirst = layout === 'imageLeft'
              return (
                <section
                  key={s.title}
                  className="relative"
                  style={{
                    backgroundImage:
                      'url(/lockated/pages/access-visitor-management-2.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative mx-auto max-w-[976px] px-4 py-10">
                    <div className="grid min-h-[510px] items-center gap-0 md:grid-cols-3">
                      <div
                        className={`h-full min-h-[220px] bg-[#e1e1e1] md:col-span-1 ${
                          imageColFirst ? '' : 'md:order-2'
                        }`}
                      >
                        {showImage ? (
                          <div className="flex h-full items-center justify-center p-4">
                            <img
                              src={image}
                              alt=""
                              className="h-auto w-full max-w-[420px]"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                      </div>
                      <div
                        className={`md:col-span-2 ${
                          imageColFirst ? '' : 'md:order-1'
                        }`}
                      >
                        <div className="px-6 py-10 md:px-[100px]">
                          <h3 className="text-center font-heading text-2xl font-medium text-white sm:text-3xl">
                            <MultilineHeading text={s.title.replace('  ', ' ')} />
                          </h3>
                          {s.description ? (
                            <p className="mt-6 text-center font-heading text-base font-medium leading-7 text-white sm:text-lg">
                              {s.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })
          })()}

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-8">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-10">
              <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                Clients
              </h2>
              <div className="mt-8">
                <img
                  src="/lockated/pages/clientile-fullsize.png"
                  alt="Clients"
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-10">
              <h2 className="text-center font-heading text-2xl font-medium text-slate-900 sm:text-3xl">
                Why leading companies choose Lockated
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading Customer Success team based across the globe.',
                  },
                  {
                    title: 'Powerful Access Control Integrations',
                    desc: 'Explore the dept and volume of possibilities with first-rate systems.',
                  },
                  {
                    title: 'Best-of-breed Applications',
                    desc: 'Work with tools your team already uses for seamless implementations.',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Trust in the only VMS with full ISAE 3000 Type | Privacy Attestation.',
                  },
                  {
                    title: 'Proven and Innovative',
                    desc: 'Rely on the team that’s supported 30 million visits at 7,000 locations.',
                  },
                  {
                    title: 'Truly Unlimited',
                    desc: 'Scale with the only VMS offering unlimited visitors, hots, and kiosks.',
                  },
                ].map((b) => (
                  <div key={b.title} className="text-center">
                    <div className="inline-flex rounded-lg bg-[#facc48] px-3 py-1.5 font-heading text-lg">
                      {b.title}
                    </div>
                    <p className="mt-4 px-6 text-sm font-light leading-6 text-slate-700">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="relative"
            style={{
              backgroundImage: 'url(/lockated/pages/contact-us.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative mx-auto max-w-[900px] px-4 py-14">
              <h2 className="text-center font-heading text-2xl font-medium text-white sm:text-3xl">
                Schedule a Demo Today
              </h2>
              {content?.showDemoForm ? (
                <div
                  id="demo"
                  className="mt-10 scroll-mt-24 rounded-2xl border border-white/20 bg-black/10 p-6"
                >
                  <form className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>First Name</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="First Name"
                        name="firstName"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Last Name</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Last Name"
                        name="lastName"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80 sm:col-span-2">
                      <span>Work Email</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Work Email"
                        name="email"
                        type="email"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Phone Number</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Phone Number"
                        name="phone"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Company Name</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Company Name"
                        name="company"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Country / Region</span>
                      <input
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        placeholder="Country / Region"
                        name="country"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/80">
                      <span>Your Real Estate Category</span>
                      <select
                        className="h-11 rounded-lg border border-white/20 bg-white px-4 text-slate-900 outline-none focus:border-white/50"
                        name="category"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Your Real Estate Category
                        </option>
                        <option>Corporate Office</option>
                        <option>Commercial Building</option>
                        <option>Residential Community</option>
                        <option>Real Estate Developer</option>
                        <option>Hotel & Hospitality</option>
                        <option>Warehouse & Logistics</option>
                        <option>Mixed Use</option>
                        <option>Industrial</option>
                      </select>
                    </label>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 sm:col-span-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                      >
                        Request Call Back
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      {isRealEstateDeveloper ? (
        <>
          {/* Replica hero (Elementor section split) */}
          <section
            className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat lg:bg-fixed"
            style={{ backgroundImage: 'url(/lockated/pages/client-type-real-estate-company.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative mx-auto w-full max-w-screen-2xl px-4 lg:px-10">
              <h1 className="text-center font-heading text-[40px] font-bold leading-[1.4] text-white sm:text-[46px] md:text-[53px]">
                {eyebrow}
              </h1>
              <div className="h-[65px]" />
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 py-6">
              <h2 className="text-center font-heading text-[25px] font-medium capitalize leading-[1.2] text-black sm:text-[30px]">
                <MultilineHeading text={title} />
              </h2>
              {content?.intro ? (
                <p className="pt-[30px] text-center font-heading text-[16px] font-normal leading-[1.8] text-[#414040] sm:text-[20px]">
                  {content.intro}
                </p>
              ) : null}
            </div>
          </section>

          {content?.purposeImage ? (
            <section className="bg-white">
              <div className="mx-auto max-w-[976px] px-4 pb-2">
                <div className="flex justify-center">
                  <img
                    src={content.purposeImage}
                    alt={content.purposeImageAlt ?? ''}
                    className="h-auto w-full max-w-[768px]"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          ) : null}

          <section className="bg-white">
            <div className="mx-auto max-w-[976px] px-4 pb-10 pt-2">
              <div className="flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.stagesTitle ?? 'Solutions By Real Estate Project Stages'}
              </h2>
              <div className="mx-auto mt-10 max-w-4xl">
                <a
                  href={content?.stagesVideoUrl ?? '#'}
                  target={content?.stagesVideoUrl ? '_blank' : undefined}
                  rel={content?.stagesVideoUrl ? 'noreferrer' : undefined}
                  className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                >
                  {content?.stagesThumb ? (
                    <img
                      src={content.stagesThumb}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                      ▶
                    </div>
                  </div>
                </a>
              </div>

              {content?.stages?.length ? (
                <div className="mx-auto mt-10 max-w-4xl space-y-10">
                  {content.stages.map((s) => (
                    <div key={s.title}>
                      <div className="font-heading text-[22px] font-medium text-slate-900">{s.title}</div>
                      <p className="mt-3 text-[15px] font-light leading-[1.8] text-slate-700 sm:text-[16px]">
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-10 flex justify-center">
                <a
                  href={primaryCtaHref ?? '#demo'}
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  {primaryCtaLabel ?? 'BOOK A DEMO'}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                {content?.featuresTitle ?? 'Sailent Features'}
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                {(content?.features ?? []).map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-[70px] w-[70px] object-contain" loading="lazy" />
                    <div className="mt-4 font-heading text-[18px] font-normal leading-[1.25] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Clients
              </h2>
              <div className="mt-10 flex justify-center">
                <img
                  src="/lockated/pages/clientile-fullsize.png"
                  alt=""
                  className="h-auto w-full max-w-5xl"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Why leading companies choose Lockated
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading Customer Success team based across the globe.',
                    icon: '/lockated/replica/003-support.png',
                  },
                  {
                    title: 'Powerful Access Control Integrations',
                    desc: 'Explore the dept and volume of possibilities with first-rate systems.',
                    icon: '/lockated/replica/004-access-control.png',
                  },
                  {
                    title: 'Best-of-breed Applications',
                    desc: 'Work with tools your team already uses for seamless implementations.',
                    icon: '/lockated/replica/002-iot.png',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Trust in the only VMS with full ISAE 3000 Type | Privacy Attestation.',
                    icon: '/lockated/replica/005-secure-data.png',
                  },
                  {
                    title: 'Proven and Innovative',
                    desc: 'Rely on the team that’s supported 30 million visits at 7,000 locations.',
                    icon: '/lockated/replica/001-idea.png',
                  },
                  {
                    title: 'Truly Unlimited',
                    desc: 'Scale with the only VMS offering unlimited visitors, hots, and kiosks.',
                    icon: '/lockated/replica/006-domain.png',
                  },
                ].map((b) => (
                  <div key={b.title} className="text-center">
                    <img src={b.icon} alt="" className="mx-auto h-12 w-12" loading="lazy" />
                    <div className="mt-5 inline-flex rounded-lg bg-[#facc48] px-3 py-1.5 font-heading text-lg">
                      {b.title}
                    </div>
                    <p className="mt-4 px-6 text-sm font-light leading-6 text-slate-700">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isLeadManagement ? (
        <>
          {/* Lead Management replica hero */}
          <section className="bg-black">
            <div className="mx-auto flex min-h-[40vh] max-w-[900px] items-center justify-center px-4 pb-[100px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-normal leading-[1.4] tracking-[5px] text-white sm:text-[50px]">
                Lead Management Built for
                <br />
                Real Estate
              </h1>
            </div>
          </section>

          {/* Intro + purpose image with negative offset */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal capitalize leading-[1.3] text-black md:text-left md:text-[35px]">
                    One Dashboard Solution to Lead Management
                  </h2>
                  <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-left md:text-[18px]">
                    Lead Management helps you capture leads from sources and sub-sources like web-forms,
                    marketing campaigns, property portals, etc. Deliver high sales at your existing platform
                    with a seamless integration
                  </p>
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/lead-management-purpose.png"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sailent features (top row) + Lead-Infinity center image + bottom row */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-normal capitalize leading-[1.2] text-black sm:text-[30px]">
                Sailent features
              </h2>

              <div className="relative mt-10">
                {/* Vertical dotted divider lines like replica */}
                <div className="pointer-events-none absolute left-0 top-6 hidden h-[260px] border-l-[4px] border-dotted border-black/25 md:block" />
                <div className="pointer-events-none absolute left-1/3 top-24 hidden h-[180px] -translate-x-1/2 border-l-[4px] border-dotted border-black/25 md:block" />
                <div className="pointer-events-none absolute left-2/3 top-24 hidden h-[180px] -translate-x-1/2 border-l-[4px] border-dotted border-black/25 md:block" />
                <div className="pointer-events-none absolute right-0 top-6 hidden h-[260px] border-l-[4px] border-dotted border-black/25 md:block" />

                <div className="grid items-center gap-10 md:grid-cols-3">
                  <div className="space-y-14">
                    {[
                      { title: 'Multiple\nLead Sources', icon: '/lockated/pages/lead-multiple-lead-sources.png' },
                      { title: 'Campaign\nBuilding', icon: '/lockated/pages/lead-campaign.png' },
                      { title: 'Performance\nTracking', icon: '/lockated/pages/lead-performance.png' },
                    ].map((f) => (
                      <div key={f.title} className="flex flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <img
                      src="/lockated/pages/lead-infinity.png"
                      alt=""
                      className="h-auto w-full max-w-[320px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:max-w-[360px] md:max-w-[380px]"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-14">
                    {[
                      { title: 'Real Time\nAnalysis', icon: '/lockated/pages/lead-multiple-lead-sources.png' },
                      { title: 'Cloud\nTelephony', icon: '/lockated/pages/lead-telephony.png' },
                      { title: 'Automate\nCustomer Journeys', icon: '/lockated/pages/lead-journeys.png' },
                    ].map((f) => (
                      <div key={f.title} className="flex flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Sailent features grid (6 tiles like replica) */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { title: 'Crowd\nManagement', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'On-Site\nRegistration', icon: '/lockated/pages/real-estate/soft-services-full.png' },
                  { title: 'Flat\nInventory', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
                  { title: 'Site\nManagement', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Payment\nPlans', icon: '/lockated/pages/real-estate/inventory-management-full.png' },
                  { title: 'Feedback\nScoring', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-[70px] w-[70px] object-contain" loading="lazy" />
                    <div className="mt-4 font-heading text-[18px] font-normal leading-[1.25] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  BOOK A DEMO
                </a>
              </div>
            </div>
          </section>

          {/* Pricing Plans (replica section heading) */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-3">
                    {[
                      { title: 'Basic', badge: '' },
                      { title: 'Essential', badge: 'Most popular' },
                      { title: 'Advanced', badge: '' },
                    ].map((p) => (
                      <div
                        key={p.title}
                        className={`rounded-2xl border p-6 text-center ${
                          p.badge ? 'border-[#facc48] shadow-[0_0_0_1px_#facc48]' : 'border-slate-200'
                        }`}
                      >
                        <div className="font-heading text-[22px] font-semibold text-slate-900">{p.title}</div>
                        {p.badge ? (
                          <div className="mt-2 inline-flex rounded-full bg-[#facc48] px-3 py-1 text-xs font-semibold text-slate-900">
                            {p.badge}
                          </div>
                        ) : null}
                        <div className="mt-5 text-4xl font-semibold text-slate-900">₹9</div>
                        <div className="mt-2 text-sm text-slate-600">per month</div>
                        <div className="mt-6">
                          <a
                            href="#demo"
                            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Select
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Speak to expert CTA */}
          <section
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(130deg, #F69380 0%, #CA575D 89%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'url(/lockated/pages/lead/cta-shapes.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="font-heading text-[28px] font-light capitalize leading-[1.2] text-white sm:text-[42px]">
                    Speak to our solutions expert today
                  </div>
                  <div className="mt-6">
                    <a
                      href="https://india.lockated.co/free-consultation/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border-2 border-white bg-transparent px-10 py-4 text-[12px] font-normal uppercase tracking-[4px] text-white transition hover:bg-white hover:text-[#CA575D]"
                    >
                      Schedule a Free Consultation
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <img
                    src="/lockated/pages/lead/cta-our-services.png"
                    alt=""
                    className="mx-auto h-auto w-full max-w-[420px] rounded-[120px_40px_40px_40px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:ml-auto md:mt-[-10%]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Demo form */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div
                id="demo"
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-slate-900">Schedule a Demo Today</div>
                <form className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>First Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Last Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                    <span>Work Email</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Work Email"
                      name="email"
                      type="email"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Phone Number</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Phone Number"
                      name="phone"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Company Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Company Name"
                      name="company"
                    />
                  </label>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Request Call Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isSiteManagement ? (
        <>
          {/* Site Management replica hero */}
          <section className="bg-black">
            <div className="mx-auto flex min-h-[40vh] max-w-[900px] items-center justify-center px-4 pb-[100px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-normal leading-[1.4] tracking-[5px] text-white sm:text-[50px]">
                Site Management
              </h1>
            </div>
          </section>

          {/* Intro + purpose image with negative offset */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal capitalize leading-[1.3] text-black md:text-left md:text-[35px]">
                    Site Management simplified
                  </h2>
                  <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-left md:text-[18px]">
                    Lockated’s Site Management gives real estate company a win over every potential lead as you can
                    carry out on-site registration and integration of the lead in the CRM.
                  </p>
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/site-management-purpose.png"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sailent features (6 icons + center image) */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>

              <div className="relative mt-10">
                <div className="grid items-center gap-10 md:grid-cols-3">
                  <div className="space-y-14">
                    {[
                      { title: 'Site Visit\nScheduling', icon: '/lockated/pages/site-visit.png' },
                      { title: 'On-Site\nRegistration', icon: '/lockated/pages/site-registration.png' },
                      { title: 'Site\nStagging', icon: '/lockated/pages/site-stagging.png' },
                    ].map((f) => (
                      <div key={f.title} className="flex flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <img
                      src="/lockated/pages/site-management-hero.png"
                      alt=""
                      className="h-auto w-full max-w-[520px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:max-w-[560px] md:max-w-[600px]"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-14">
                    {[
                      { title: 'Aging\nReports', icon: '/lockated/pages/site-visit.png' },
                      { title: 'Sync\nInventory', icon: '/lockated/pages/site-inventory.png' },
                      { title: 'Track Multiple\nPayments', icon: '/lockated/pages/site-payments.png' },
                    ].map((f) => (
                      <div key={f.title} className="flex flex-col items-center text-center">
                        <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                        <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                          <MultilineHeading text={f.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Sailent features grid + demo CTA */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { title: 'Lead Infinity\nIntegration', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Block & Sync\nInventory', icon: '/lockated/pages/real-estate/soft-services-full.png' },
                  { title: 'Expression Of\nInterest', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
                  { title: 'AR & VR\nIntegration', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Digital\nBrochure', icon: '/lockated/pages/real-estate/inventory-management-full.png' },
                  { title: 'Content\nSharing', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-[70px] w-[70px] object-contain" loading="lazy" />
                    <div className="mt-4 font-heading text-[18px] font-normal leading-[1.25] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  BOOK A DEMO
                </a>
              </div>
            </div>
          </section>

          {/* Reuse the same bottom sections as Lead Management */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-3">
                    {[
                      { title: 'Basic', badge: '' },
                      { title: 'Essential', badge: 'Most popular' },
                      { title: 'Advanced', badge: '' },
                    ].map((p) => (
                      <div
                        key={p.title}
                        className={`rounded-2xl border p-6 text-center ${
                          p.badge ? 'border-[#facc48] shadow-[0_0_0_1px_#facc48]' : 'border-slate-200'
                        }`}
                      >
                        <div className="font-heading text-[22px] font-semibold text-slate-900">{p.title}</div>
                        {p.badge ? (
                          <div className="mt-2 inline-flex rounded-full bg-[#facc48] px-3 py-1 text-xs font-semibold text-slate-900">
                            {p.badge}
                          </div>
                        ) : null}
                        <div className="mt-5 text-4xl font-semibold text-slate-900">₹9</div>
                        <div className="mt-2 text-sm text-slate-600">per month</div>
                        <div className="mt-6">
                          <a
                            href="#demo"
                            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Select
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(130deg, #F69380 0%, #CA575D 89%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'url(/lockated/pages/lead/cta-shapes.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="font-heading text-[28px] font-light capitalize leading-[1.2] text-white sm:text-[42px]">
                    Speak to our solutions expert today
                  </div>
                  <div className="mt-6">
                    <a
                      href="https://india.lockated.co/free-consultation/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border-2 border-white bg-transparent px-10 py-4 text-[12px] font-normal uppercase tracking-[4px] text-white transition hover:bg-white hover:text-[#CA575D]"
                    >
                      Schedule a Free Consultation
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <img
                    src="/lockated/pages/lead/cta-our-services.png"
                    alt=""
                    className="mx-auto h-auto w-full max-w-[420px] rounded-[120px_40px_40px_40px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:ml-auto md:mt-[-10%]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div
                id="demo"
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-slate-900">Schedule a Demo Today</div>
                <form className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>First Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Last Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                    <span>Work Email</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Work Email"
                      name="email"
                      type="email"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Phone Number</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Phone Number"
                      name="phone"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Company Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Company Name"
                      name="company"
                    />
                  </label>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Request Call Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isBrokersManagement ? (
        <>
          {/* Brokers Management replica hero */}
          <section className="bg-black">
            <div className="mx-auto flex min-h-[40vh] max-w-[900px] items-center justify-center px-4 pb-[100px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-normal leading-[1.4] tracking-[5px] text-white sm:text-[50px]">
                Brokers Management
              </h1>
            </div>
          </section>

          {/* Intro + purpose image with negative offset */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal capitalize leading-[1.3] text-black md:text-left md:text-[35px]">
                    Brokers / Channel Partner Management
                  </h2>
                  <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-left md:text-[18px]">
                    A unique tool designed to manage channel partner leads in a much smart and different manner.
                    Brokers Management helps you schedule site visits, track customer journeys, assign leads and much
                    more at just a click of a button.
                  </p>
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/broker-management-purpose.png"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sailent features (6 icons + center image) */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>

              <div className="mt-10 grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-14">
                  {[
                    { title: 'Channel Partner\nManagement', icon: '/lockated/pages/broker-channel.png' },
                    { title: 'Appointment &\nReminders', icon: '/lockated/pages/broker-appointments.png' },
                    { title: 'Virtual Tours &\nCustomer Journey', icon: '/lockated/pages/broker-tours.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center">
                      <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                      <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                        <MultilineHeading text={f.title} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <img
                    src="/lockated/pages/brokerz.png"
                    alt=""
                    className="h-auto w-full max-w-[520px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:max-w-[560px] md:max-w-[600px]"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-14">
                  {[
                    { title: 'Digital\nBrochure', icon: '/lockated/pages/broker-channel.png' },
                    { title: 'Inventory\nManagement', icon: '/lockated/pages/broker-inventory.png' },
                    { title: 'Inventory\nBlocking', icon: '/lockated/pages/broker-blocking.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center">
                      <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                      <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                        <MultilineHeading text={f.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Sailent features grid + demo CTA */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { title: 'Content\nSharing', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Flexible\nSetup', icon: '/lockated/pages/real-estate/soft-services-full.png' },
                  { title: 'Sync\nInventory', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
                  { title: 'Lead Infinity\nIntegration', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Live In Site\nIntegration', icon: '/lockated/pages/real-estate/inventory-management-full.png' },
                  { title: 'Automated\nReminders', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-[70px] w-[70px] object-contain" loading="lazy" />
                    <div className="mt-4 font-heading text-[18px] font-normal leading-[1.25] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  BOOK A DEMO
                </a>
              </div>
            </div>
          </section>

          {/* Pricing / testimonial / CTA / demo form */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-3">
                    {[
                      { title: 'Basic', badge: '' },
                      { title: 'Essential', badge: 'Most popular' },
                      { title: 'Advanced', badge: '' },
                    ].map((p) => (
                      <div
                        key={p.title}
                        className={`rounded-2xl border p-6 text-center ${
                          p.badge ? 'border-[#facc48] shadow-[0_0_0_1px_#facc48]' : 'border-slate-200'
                        }`}
                      >
                        <div className="font-heading text-[22px] font-semibold text-slate-900">{p.title}</div>
                        {p.badge ? (
                          <div className="mt-2 inline-flex rounded-full bg-[#facc48] px-3 py-1 text-xs font-semibold text-slate-900">
                            {p.badge}
                          </div>
                        ) : null}
                        <div className="mt-5 text-4xl font-semibold text-slate-900">₹9</div>
                        <div className="mt-2 text-sm text-slate-600">per month</div>
                        <div className="mt-6">
                          <a
                            href="#demo"
                            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Select
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(130deg, #F69380 0%, #CA575D 89%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'url(/lockated/pages/lead/cta-shapes.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="font-heading text-[28px] font-light capitalize leading-[1.2] text-white sm:text-[42px]">
                    Speak to our solutions expert today
                  </div>
                  <div className="mt-6">
                    <a
                      href="https://india.lockated.co/free-consultation/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border-2 border-white bg-transparent px-10 py-4 text-[12px] font-normal uppercase tracking-[4px] text-white transition hover:bg-white hover:text-[#CA575D]"
                    >
                      Schedule a Free Consultation
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <img
                    src="/lockated/pages/lead/cta-our-services.png"
                    alt=""
                    className="mx-auto h-auto w-full max-w-[420px] rounded-[120px_40px_40px_40px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:ml-auto md:mt-[-10%]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div
                id="demo"
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-slate-900">Schedule a Demo Today</div>
                <form className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>First Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Last Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                    <span>Work Email</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Work Email"
                      name="email"
                      type="email"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Phone Number</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Phone Number"
                      name="phone"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Company Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Company Name"
                      name="company"
                    />
                  </label>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Request Call Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isSnaggingQc ? (
        <>
          {/* Snagging & QC Management replica hero */}
          <section className="bg-black">
            <div className="mx-auto flex min-h-[40vh] max-w-[900px] items-center justify-center px-4 pb-[100px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-normal leading-[1.4] tracking-[5px] text-white sm:text-[50px]">
                Snagging &amp; QC Management
              </h1>
            </div>
          </section>

          {/* Intro + purpose image with negative offset */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal capitalize leading-[1.3] text-black md:text-left md:text-[35px]">
                    Powerful Snagging &amp; QC Control Suite
                  </h2>
                  <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-left md:text-[18px]">
                    Snagging &amp; QC Management is a Mobile Based Application specially designed and developed for
                    the Real Estate Industry. It enables dynamic workflow and validations of multiple check points
                    across various configurations ensuring a defect free delivery. Ensuring reduction in follow up on
                    customer complaints and establish a smooth, dynamic workflow across all quality checkpoints.
                  </p>
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/snagging-purpose.png"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sailent features (6 icons + center image) */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>

              <div className="mt-10 grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-14">
                  {[
                    { title: 'Realtime\nDashboard', icon: '/lockated/pages/snag-dashboard.png' },
                    { title: 'Digital\nChecklist', icon: '/lockated/pages/snag-checklist.png' },
                    { title: 'Customizable\nWorkflow', icon: '/lockated/pages/snag-workflow.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center">
                      <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                      <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                        <MultilineHeading text={f.title} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <img
                    src="/lockated/pages/snag-360.png"
                    alt=""
                    className="h-auto w-full max-w-[320px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:max-w-[360px] md:max-w-[380px]"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-14">
                  {[
                    { title: 'Role Based\nAccess', icon: '/lockated/pages/snag-access.png' },
                    { title: 'Work\nScheduling', icon: '/lockated/pages/snag-scheduling.png' },
                    { title: 'Multi Level\nEscalations', icon: '/lockated/pages/snag-escalations.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center">
                      <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                      <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                        <MultilineHeading text={f.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Sailent features grid + demo CTA */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { title: 'Request &\nApproval', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Offline\nMode', icon: '/lockated/pages/real-estate/soft-services-full.png' },
                  { title: 'Multiple\nIndicators', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
                  { title: 'Escalation\nNotification', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Progress\nTracking', icon: '/lockated/pages/real-estate/inventory-management-full.png' },
                  { title: 'Detailed\nReporting', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-[70px] w-[70px] object-contain" loading="lazy" />
                    <div className="mt-4 font-heading text-[18px] font-normal leading-[1.25] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  BOOK A DEMO
                </a>
              </div>
            </div>
          </section>

          {/* Product Walkthrough */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Product Walkthrough
              </h2>
              <div className="mx-auto mt-8 max-w-4xl">
                <a
                  href="https://www.youtube.com/watch?v=fEHoeM_82a4"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src="/lockated/pages/snagging-lp.jpg"
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                      ▶
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Why leading companies choose Lockated */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Why leading companies choose Lockated
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'First-Class Support',
                    desc: 'Count on our industry-leading Customer Success team based across the globe.',
                    icon: '/lockated/replica/003-support.png',
                  },
                  {
                    title: 'Powerful Access Control Integrations',
                    desc: 'Explore the dept and volume of possibilities with first-rate systems.',
                    icon: '/lockated/replica/004-access-control.png',
                  },
                  {
                    title: 'Best-of-breed Applications',
                    desc: 'Work with tools your team already uses for seamless implementations.',
                    icon: '/lockated/replica/002-iot.png',
                  },
                  {
                    title: 'Data Privacy',
                    desc: 'Trust in the only VMS with full ISAE 3000 Type | Privacy Attestation.',
                    icon: '/lockated/replica/005-secure-data.png',
                  },
                  {
                    title: 'Proven and Innovative',
                    desc: 'Rely on the team that’s supported 30 million visits at 7,000 locations.',
                    icon: '/lockated/replica/001-idea.png',
                  },
                  {
                    title: 'Truly Unlimited',
                    desc: 'Scale with the only VMS offering unlimited visitors, hots, and kiosks.',
                    icon: '/lockated/replica/006-domain.png',
                  },
                ].map((b) => (
                  <div key={b.title} className="text-center">
                    <img src={b.icon} alt="" className="mx-auto h-12 w-12" loading="lazy" />
                    <div className="mt-5 inline-flex rounded-lg bg-[#facc48] px-3 py-1.5 font-heading text-lg">
                      {b.title}
                    </div>
                    <p className="mt-4 px-6 text-sm font-light leading-6 text-slate-700">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing / testimonial / CTA / demo form */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-3">
                    {[
                      { title: 'Basic', badge: '' },
                      { title: 'Essential', badge: 'Most popular' },
                      { title: 'Advanced', badge: '' },
                    ].map((p) => (
                      <div
                        key={p.title}
                        className={`rounded-2xl border p-6 text-center ${
                          p.badge ? 'border-[#facc48] shadow-[0_0_0_1px_#facc48]' : 'border-slate-200'
                        }`}
                      >
                        <div className="font-heading text-[22px] font-semibold text-slate-900">{p.title}</div>
                        {p.badge ? (
                          <div className="mt-2 inline-flex rounded-full bg-[#facc48] px-3 py-1 text-xs font-semibold text-slate-900">
                            {p.badge}
                          </div>
                        ) : null}
                        <div className="mt-5 text-4xl font-semibold text-slate-900">₹9</div>
                        <div className="mt-2 text-sm text-slate-600">per month</div>
                        <div className="mt-6">
                          <a
                            href="#demo"
                            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Select
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(130deg, #F69380 0%, #CA575D 89%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'url(/lockated/pages/lead/cta-shapes.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="font-heading text-[28px] font-light capitalize leading-[1.2] text-white sm:text-[42px]">
                    Speak to our solutions expert today
                  </div>
                  <div className="mt-6">
                    <a
                      href="https://india.lockated.co/free-consultation/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border-2 border-white bg-transparent px-10 py-4 text-[12px] font-normal uppercase tracking-[4px] text-white transition hover:bg-white hover:text-[#CA575D]"
                    >
                      Schedule a Free Consultation
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <img
                    src="/lockated/pages/lead/cta-our-services.png"
                    alt=""
                    className="mx-auto h-auto w-full max-w-[420px] rounded-[120px_40px_40px_40px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:ml-auto md:mt-[-10%]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div
                id="demo"
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-slate-900">Schedule a Demo Today</div>
                <form className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>First Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Last Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                    <span>Work Email</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Work Email"
                      name="email"
                      type="email"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Phone Number</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Phone Number"
                      name="phone"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Company Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Company Name"
                      name="company"
                    />
                  </label>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Request Call Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {isHandoverManagement ? (
        <>
          {/* Handover Management replica hero */}
          <section className="bg-black">
            <div className="mx-auto flex min-h-[40vh] max-w-[900px] items-center justify-center px-4 pb-[100px] pt-[60px]">
              <h1 className="w-full text-center font-heading text-[30px] font-normal leading-[1.4] tracking-[5px] text-white sm:text-[50px]">
                Handover Management
              </h1>
            </div>
          </section>

          {/* Intro + purpose image with negative offset */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
              <div className="grid gap-8 py-10 md:grid-cols-12 md:items-start md:gap-10">
                <div className="md:col-span-5 md:pr-20 md:pt-[60px]">
                  <h2 className="text-center font-heading text-[30px] font-normal capitalize leading-[1.3] text-black md:text-left md:text-[35px]">
                    handover management for smooth handover for your customers
                  </h2>
                  <p className="mt-5 text-center text-[15px] font-light leading-[1.7] text-slate-700 md:text-left md:text-[18px]">
                    Lockated’s Handover Management solution allows your team to complete the entire handover and
                    interact with customers adding a personal touch while smoothening the entire process.
                  </p>
                </div>
                <div className="md:col-span-7 md:-mt-[110px]">
                  <div className="bg-white">
                    <img
                      src="/lockated/pages/handover-purpose.png"
                      alt=""
                      className="h-auto w-full shadow-[0_9px_40px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sailent features (6 icons + center image) */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>

              <div className="mt-10 grid items-center gap-10 md:grid-cols-3">
                <div className="space-y-14">
                  {[
                    { title: 'Site Visit\nScheduling', icon: '/lockated/pages/handover-site-visit.png' },
                    { title: 'Roster\nManagement', icon: '/lockated/pages/handover-roster.png' },
                    { title: 'Automated\nScheduling', icon: '/lockated/pages/handover-automated.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center">
                      <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                      <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                        <MultilineHeading text={f.title} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <img
                    src="/lockated/pages/virtual-handover.png"
                    alt=""
                    className="h-auto w-full max-w-[520px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:max-w-[560px] md:max-w-[600px]"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-14">
                  {[
                    { title: 'Virtual Live\nStreaming', icon: '/lockated/pages/handover-streaming.png' },
                    { title: 'Video Calling\nPersonalised Setup', icon: '/lockated/pages/handover-video-calling.png' },
                    { title: 'Online\nConsent', icon: '/lockated/pages/handover-consent.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center">
                      <img src={f.icon} alt="" className="h-[70px] w-[70px]" loading="lazy" />
                      <div className="mt-3 font-heading text-[18px] font-normal leading-[1.2] text-black">
                        <MultilineHeading text={f.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Sailent features grid + demo CTA */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Sailent features
              </h2>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { title: 'Video\nRecording', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Appointment\nScheduling', icon: '/lockated/pages/real-estate/soft-services-full.png' },
                  { title: 'Bi\nReporting', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
                  { title: 'Feedback\nCapture', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
                  { title: 'Integration\nWith Snagging', icon: '/lockated/pages/real-estate/inventory-management-full.png' },
                  { title: 'Integration With\nQC Monitoring', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-center text-center">
                    <img src={f.icon} alt="" className="h-[70px] w-[70px] object-contain" loading="lazy" />
                    <div className="mt-4 font-heading text-[18px] font-normal leading-[1.25] text-slate-900">
                      <MultilineHeading text={f.title} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-7 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  BOOK A DEMO
                </a>
              </div>
            </div>
          </section>

          {/* Pricing / testimonial / CTA / demo form */}
          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-10">
              <h2 className="text-center font-heading text-[25px] font-medium leading-[1.2] text-slate-900 sm:text-[30px]">
                Pricing Plans
              </h2>
              <div className="mt-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-3">
                    {[
                      { title: 'Basic', badge: '' },
                      { title: 'Essential', badge: 'Most popular' },
                      { title: 'Advanced', badge: '' },
                    ].map((p) => (
                      <div
                        key={p.title}
                        className={`rounded-2xl border p-6 text-center ${
                          p.badge ? 'border-[#facc48] shadow-[0_0_0_1px_#facc48]' : 'border-slate-200'
                        }`}
                      >
                        <div className="font-heading text-[22px] font-semibold text-slate-900">{p.title}</div>
                        {p.badge ? (
                          <div className="mt-2 inline-flex rounded-full bg-[#facc48] px-3 py-1 text-xs font-semibold text-slate-900">
                            {p.badge}
                          </div>
                        ) : null}
                        <div className="mt-5 text-4xl font-semibold text-slate-900">₹9</div>
                        <div className="mt-2 text-sm text-slate-600">per month</div>
                        <div className="mt-6">
                          <a
                            href="#demo"
                            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Select
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(130deg, #F69380 0%, #CA575D 89%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'url(/lockated/pages/lead/cta-shapes.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div className="grid items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="font-heading text-[28px] font-light capitalize leading-[1.2] text-white sm:text-[42px]">
                    Speak to our solutions expert today
                  </div>
                  <div className="mt-6">
                    <a
                      href="https://india.lockated.co/free-consultation/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border-2 border-white bg-transparent px-10 py-4 text-[12px] font-normal uppercase tracking-[4px] text-white transition hover:bg-white hover:text-[#CA575D]"
                    >
                      Schedule a Free Consultation
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <img
                    src="/lockated/pages/lead/cta-our-services.png"
                    alt=""
                    className="mx-auto h-auto w-full max-w-[420px] rounded-[120px_40px_40px_40px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:ml-auto md:mt-[-10%]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-14 lg:px-10">
              <div
                id="demo"
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-slate-900">Schedule a Demo Today</div>
                <form className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>First Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Last Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                    <span>Work Email</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Work Email"
                      name="email"
                      type="email"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Phone Number</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Phone Number"
                      name="phone"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span>Company Name</span>
                    <input
                      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="Company Name"
                      name="company"
                    />
                  </label>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Request Call Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {!isResidentialProperty &&
      !isCommercialProperty &&
      !isOffices &&
      !isCommercialBuildings &&
      !isHotels &&
      !isResidentialCommunities &&
      !isRealEstateDeveloper &&
      !isLeadManagement &&
      !isSiteManagement &&
      !isBrokersManagement &&
      !isSnaggingQc &&
      !isHandoverManagement ? (
        <section className="bg-slate-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:py-14 lg:px-10">
          <div className="grid gap-6">
            <div className="space-y-6">
              {isResidentialProperty ? null : null}

              {content?.showcaseImage && content.showShowcaseImage !== false && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-slate-100 p-4 sm:p-0">
                    <div className="mx-auto w-[240px] max-w-full sm:w-[420px] lg:w-[520px]">
                    <img
                      src={content.showcaseImage}
                      alt={content.showcaseAlt ?? ''}
                      className="h-[150px] w-full bg-white object-contain sm:h-auto sm:bg-transparent"
                      loading="lazy"
                    />
                    </div>
                  </div>
                </div>
              )}

              {content?.features?.length ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-base font-semibold text-slate-900">
                    {content.featuresTitle ?? 'Sailent features'}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {content.features.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                          <img src={f.icon} alt="" className="h-8 w-8" loading="lazy" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-slate-900">
                          {f.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {content?.secondaryFeatures?.length ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-base font-semibold text-slate-900">
                    {content.secondaryFeaturesTitle ?? 'Sailent features'}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {content.secondaryFeatures.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                          <img src={f.icon} alt="" className="h-8 w-8" loading="lazy" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-slate-900">
                          {f.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {content?.stages?.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="grid md:grid-cols-2">
                    <div className="p-6 sm:p-8">
                      <div className="text-base font-semibold text-slate-900">
                        {content.stagesTitle ?? 'Solutions By Real Estate Project Stages'}
                      </div>
                      <div className="mt-5 space-y-5">
                        {content.stages.map((s) => (
                          <div key={s.title}>
                            <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                            <div className="mt-2 text-sm leading-6 text-slate-600">{s.description}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <a
                          href={primaryCtaHref ?? '#demo'}
                          className="inline-flex items-center justify-center rounded-full bg-[#f6d54a] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-[#f2cc2a]"
                        >
                          {primaryCtaLabel ?? 'BOOK A DEMO'}
                        </a>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 bg-slate-100 md:border-l md:border-t-0">
                      {content.stagesThumb ? (
                        <div className="relative h-64 w-full sm:h-80 md:h-full">
                          <img
                            src={content.stagesThumb}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                              ▶
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 w-full sm:h-80 md:h-full" />
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {content?.sections?.length ? (
                template === 'property' ? (
                  <div className="space-y-6">
                    {content.sections.map((s, idx) => {
                      const isClientsOnly = s.title.toLowerCase() === 'clients' && !s.description
                      const reversed = idx % 2 === 1
                      return (
                        <section
                          key={s.title}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div className={`grid gap-0 md:grid-cols-2 ${reversed ? 'md:[&>*:first-child]:order-2' : ''}`}>
                            <div className="p-6 sm:p-8">
                              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                                {s.title}
                              </h2>
                              {s.description ? (
                                <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                                  {s.description}
                                </p>
                              ) : null}
                              {!isClientsOnly ? (
                                <div className="mt-6">
                                  <a
                                    href={primaryCtaHref ?? '#demo'}
                                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                                  >
                                    {primaryCtaLabel ?? 'BOOK A DEMO'}
                                  </a>
                                </div>
                              ) : null}
                            </div>
                            <div className="border-t border-slate-200 bg-slate-100 md:border-l md:border-t-0">
                              {s.image ? (
                                <img
                                  src={s.image}
                                  alt=""
                                  className={`h-56 w-full object-cover sm:h-72 md:h-full ${isClientsOnly ? 'object-contain bg-white p-6' : ''}`}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-56 w-full sm:h-72 md:h-full" />
                              )}
                            </div>
                          </div>
                        </section>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-base font-semibold text-slate-900">Overview</div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {content.sections.map((s) => (
                        <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                          {s.image ? (
                            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              <img src={s.image} alt="" className="h-32 w-full object-cover" loading="lazy" />
                            </div>
                          ) : null}
                          <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                          {s.description ? (
                            <div className="mt-2 text-sm text-slate-600">{s.description}</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : null}

              {content?.showDemoForm ? (
                <div
                  id="demo"
                  className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="text-base font-semibold text-slate-900">Schedule a Demo Today</div>
                  <form className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span>First Name</span>
                      <input
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        placeholder="First Name"
                        name="firstName"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span>Last Name</span>
                      <input
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        placeholder="Last Name"
                        name="lastName"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                      <span>Work Email</span>
                      <input
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        placeholder="Work Email"
                        name="email"
                        type="email"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span>Phone Number</span>
                      <input
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        placeholder="Phone Number"
                        name="phone"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span>Company Name</span>
                      <input
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        placeholder="Company Name"
                        name="company"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span>Country / Region</span>
                      <input
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        placeholder="Country / Region"
                        name="country"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span>Your Real Estate Category</span>
                      <select
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-slate-500"
                        name="category"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Your Real Estate Category
                        </option>
                        <option>Corporate Office</option>
                        <option>Commercial Building</option>
                        <option>Residential Community</option>
                        <option>Real Estate Developer</option>
                        <option>Hotel & Hospitality</option>
                        <option>Warehouse & Logistics</option>
                        <option>Mixed Use</option>
                        <option>Industrial</option>
                      </select>
                    </label>
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        Request Call Back
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {content?.walkthroughTitle && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-base font-semibold text-slate-900">
                      {content.walkthroughTitle}
                    </div>
                    {content.walkthroughUrl && (
                      <a
                        href={content.walkthroughUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        Play Video <span aria-hidden>▶</span>
                      </a>
                    )}
                  </div>

                  <div className="mt-5">
                    {content.walkthroughThumb ? (
                      <a
                        href={content.walkthroughUrl ?? '#'}
                        target={content.walkthroughUrl ? '_blank' : undefined}
                        rel={content.walkthroughUrl ? 'noreferrer' : undefined}
                        className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={content.walkthroughThumb}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                            ▶
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-slate-200 bg-slate-100" />
                    )}
                  </div>
                </div>
              )}

              {content?.walkthrough2Title && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-base font-semibold text-slate-900">
                      {content.walkthrough2Title}
                    </div>
                    {content.walkthrough2Url && (
                      <a
                        href={content.walkthrough2Url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        Play Video <span aria-hidden>▶</span>
                      </a>
                    )}
                  </div>

                  <div className="mt-5">
                    {content.walkthrough2Thumb ? (
                      <a
                        href={content.walkthrough2Url ?? '#'}
                        target={content.walkthrough2Url ? '_blank' : undefined}
                        rel={content.walkthrough2Url ? 'noreferrer' : undefined}
                        className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={content.walkthrough2Thumb}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-slate-950/0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30">
                            ▶
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-slate-200 bg-slate-100" />
                    )}
                  </div>
                </div>
              )}

              {content?.showPricingPlans ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-base font-semibold text-slate-900">Pricing Plans</div>
                    <div className="inline-flex w-full max-w-xs rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-auto">
                      {(['Monthly', 'Yearly'] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setPricingCycle(v)}
                          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            pricingCycle === v
                              ? 'bg-[#f6d54a] text-slate-900'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {(content.pricingPlans ?? []).map((p) => {
                      const price = pricingCycle === 'Monthly' ? p.priceMonthly : p.priceYearly
                      return (
                        <div
                          key={p.title}
                          className={`rounded-2xl border p-6 shadow-sm ${
                            p.featured
                              ? 'border-[#f6d54a] bg-white ring-2 ring-[#f6d54a]/30'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-lg font-semibold text-slate-900">{p.title}</div>
                              {p.badge ? (
                                <div className="mt-1 inline-flex rounded-full bg-[#f6d54a]/25 px-3 py-1 text-xs font-semibold text-slate-900">
                                  {p.badge}
                                </div>
                              ) : null}
                            </div>
                            {p.featured ? (
                              <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                Popular
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-6 flex items-end gap-2">
                            <div className="text-3xl font-semibold tracking-tight text-slate-900">
                              {p.currencySymbol ?? '₹'}
                              {price}
                            </div>
                            <div className="pb-1 text-sm font-semibold text-slate-500">
                              / {pricingCycle.toLowerCase()}
                            </div>
                          </div>

                          <ul className="mt-5 space-y-2 text-sm text-slate-700">
                            {p.features.map((f) => (
                              <li key={f} className="flex gap-2">
                                <span className="mt-0.5 text-[#f6d54a]" aria-hidden>
                                  ✓
                                </span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6">
                            <a
                              href={primaryCtaHref ?? '#demo'}
                              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                                p.featured
                                  ? 'bg-[#f6d54a] text-slate-900 hover:bg-[#f2cc2a]'
                                  : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              {p.ctaLabel}
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        </section>
      ) : null}
    </>
  )
}

