import { Reveal } from '../components/Reveal'

function VideoPlayOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.25)] ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105">
          <span className="translate-x-[1px]" aria-hidden>
            ▶
          </span>
        </div>
      </div>
    </>
  )
}

const WHY_CHOOSE = [
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
    desc: 'Scale with the only VMS offering unlimited visitors, hots, and kiosks.',
    icon: '/lockated/replica/006-domain.png',
  },
] as const

const INDUSTRY = [
  { title: 'Corporate Office', img: '/lockated/offices.png', href: '/offices' },
  {
    title: (
      <>
        Commercial <br />
        Buildings
      </>
    ),
    img: '/lockated/commercial-buildings.png',
    href: '/commercial-buildings',
  },
  { title: 'Hotels', img: '/lockated/hotels.png', href: '/hotels' },
  { title: 'Warehouses', img: '/lockated/warehouses.png', href: '/warehouses' },
  {
    title: (
      <>
        Residential <br />
        Communities
      </>
    ),
    img: '/lockated/residential-communities.png',
    href: '/residential-communities',
  },
  {
    title: (
      <>
        Real Estate
        <br />
        Developer
      </>
    ),
    img: '/lockated/property-management-company.png',
    href: '/real-estate-developer',
  },
] as const

const SOLUTION_ROWS = [
  {
    title: 'Commercial Office',
    desc: 'A new way to welcome your employees, visitors, and operations back to the workplace',
    thumb: '/lockated/commercial-office-bg.jpg',
    url: 'https://youtu.be/HROxI6CvY90',
    videoFirst: true,
    bg: '/lockated/bg-more-about-the-services.png',
    bgPosition: 'bottom center' as const,
  },
  {
    title: 'Commercial Building',
    desc: 'One platform to deliver exceptional tenant experience and drive better ROI',
    thumb: '/lockated/commercial-building-bg.jpg',
    url: 'https://youtu.be/W_S5Ev1l0EM',
    videoFirst: false,
    bg: '/lockated/bg-home-new4.png',
    bgPosition: 'center center' as const,
  },
  {
    title: 'Residential Community',
    desc: 'Connect and manage your residential community on the go with the more secure and reliable community management app.',
    thumb: '/lockated/residential-community-bg-1.jpg',
    url: 'https://youtu.be/uq9v-WdzSSY',
    videoFirst: true,
    bg: '/lockated/shapes-icons.png',
    bgPosition: 'center right' as const,
  },
  {
    title: 'Real Estate Company',
    desc: 'An integrated solution serving across project lifecycle focusing on delivering value with data backed intelligence.',
    thumb: '/lockated/real-estate-company-bg.jpg',
    url: 'https://youtu.be/uEPQ9_CAKrU',
    videoFirst: false,
    bg: '/lockated/bg-home-new4.png',
    bgPosition: 'center center' as const,
  },
] as const

export default function HomePage() {
  return (
    <>
      {/* Hero — 40.7% / ~59% (replica Elementor columns) */}
      <section className="bg-black">
        <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-6 sm:pb-12 md:px-5">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,40.7%)_minmax(0,1fr)] lg:gap-10">
            <Reveal y={14}>
              <h1 className="font-heading text-[34px] font-bold leading-[1.4] text-white sm:text-[44px] lg:pt-[70px] lg:pl-6 lg:text-[53px]">
                Return to the Workplace with Confidence
              </h1>
              <div className="mt-6 flex flex-col items-center gap-3 lg:items-start lg:pl-6">
                <a
                  href="#video"
                  className="inline-flex items-center justify-center rounded-md bg-[#facc48] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                >
                  Play Video
                </a>
              </div>
            </Reveal>

            <Reveal y={14} delay={80}>
              <a
                id="video"
                href="https://www.youtube.com/watch?v=B7YB8XtCtvk"
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-video w-full overflow-hidden rounded-md bg-slate-900 lg:mt-0"
                aria-label="Play video"
              >
                <img
                  src="/lockated/workplace-bg1.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <VideoPlayOverlay />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Community Management — bordered inner column, replica post-37 */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-[5%] lg:px-10 lg:py-14">
          <div className="border-x border-[rgba(1,22,64,0.05)]">
            <Reveal y={14} className="px-4 py-[2%] text-center sm:px-6">
              <h2 className="font-heading text-[25px] font-medium capitalize leading-[1.2] text-black md:text-[30px]">
                Community Management
              </h2>
              <p className="mx-auto mt-8 max-w-4xl font-heading text-lg font-normal leading-[1.8] text-[#414040] md:text-xl">
                A new way to welcome your employees, visitors, and operations back to the workplace
              </p>
            </Reveal>

            <div className="grid gap-6 px-2 pb-12 sm:px-4 md:grid-cols-2 md:pb-[60px]">
              <Reveal delay={80}>
                <div className="group mx-[10px] overflow-hidden rounded-[10px] transition-shadow duration-300 hover:shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                  <a href="/commercial-property" className="block p-1" aria-label="Commercial Community">
                    <img
                      src="/lockated/commercial-community-bg.jpg"
                      alt=""
                      className="w-full rounded-[10px_10px_0_10px] object-cover"
                      loading="lazy"
                    />
                  </a>
                  <h3 className="px-2 pb-2 pt-2 text-center font-heading text-[22px] font-medium capitalize leading-[1.2] text-black">
                    <a href="/commercial-property" className="hover:underline">
                      Commercial Community
                    </a>
                  </h3>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="group mx-[10px] overflow-hidden rounded-[10px] transition-shadow duration-300 hover:shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                  <a href="/residential-property" className="block p-1" aria-label="Residential Community">
                    <img
                      src="/lockated/residential-community-bg.jpg"
                      alt=""
                      className="w-full rounded-[10px_10px_0_10px] object-cover"
                      loading="lazy"
                    />
                  </a>
                  <h3 className="px-2 pb-2 pt-2 text-center font-heading text-[22px] font-medium capitalize leading-[1.2] text-black">
                    <a href="/residential-property" className="hover:underline">
                      Residential Community
                    </a>
                  </h3>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Why leading companies choose Lockated — yellow title pills */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-10">
          <Reveal y={14} className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-[25px] font-medium capitalize leading-[1.2] text-black md:text-[30px]">
              Why leading companies choose Lockated
            </h2>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-6xl gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((b, idx) => (
              <Reveal key={b.title} delay={60 + idx * 50}>
                <div className="flex flex-col items-center px-2 text-center sm:px-8">
                  <img src={b.icon} alt="" className="h-14 w-14 object-contain" loading="lazy" />
                  <div className="mt-4 rounded-lg bg-[#facc48] px-1.5 py-1">
                    <h3 className="font-heading text-[18px] font-medium text-black">{b.title}</h3>
                  </div>
                  <p className="mt-3 max-w-sm font-heading text-[15px] font-light leading-[1.4] text-black">
                    {b.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section
        className="bg-white bg-cover bg-center bg-no-repeat py-10 lg:py-14"
        style={{ backgroundImage: 'url(/lockated/bg-home-new4.png)' }}
      >
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
          <Reveal y={14} className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-[25px] font-medium capitalize leading-[1.2] text-black md:text-[30px]">
              Industry Solutions
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY.map((t, idx) => (
              <Reveal key={idx} delay={50 + idx * 55}>
                <div className="group mx-[10px] overflow-hidden rounded-[10px] transition-shadow duration-300 hover:shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                  <a href={t.href} className="block p-1" aria-label={typeof t.title === 'string' ? t.title : 'Industry'}>
                    <img
                      src={t.img}
                      alt=""
                      className="w-full rounded-[10px_10px_0_10px] object-cover"
                      loading="lazy"
                    />
                  </a>
                  <h4 className="px-2 pb-2 pt-2 text-center font-heading text-lg leading-[1.4] text-black">
                    <a href={t.href} className="hover:underline">
                      {t.title}
                    </a>
                  </h4>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Some of our Clients */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
          <Reveal y={14} className="text-center">
            <h2 className="font-heading text-[25px] font-medium leading-[1.2] text-black md:text-[30px]">
              Some of our Clients
            </h2>
          </Reveal>
          <Reveal y={14} delay={80} className="mt-6 pb-5">
            <div className="mx-auto max-w-5xl">
              <img
                src="/lockated/clientile-fullsize.png"
                alt="Clients"
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* The Lockated Stack — hm-bg-video (replica) */}
      <section
        className="bg-cover bg-center bg-no-repeat py-4"
        style={{ backgroundImage: 'url(/lockated/hm-bg-video.jpg)' }}
      >
        <div className="mx-auto max-w-[1030px] px-[15px] py-[15px]">
          <Reveal y={14} className="text-center">
            <h2 className="font-heading text-[25px] font-medium capitalize leading-[1.2] text-black md:text-[30px]">
              The Lockated Stack
            </h2>
          </Reveal>
          <Reveal y={14} delay={90} className="mt-6">
            <a
              href="https://www.youtube.com/watch?v=h1_k4g34HTs"
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-video w-full overflow-hidden rounded-md bg-slate-900"
              aria-label="Play The Lockated Stack video"
            >
              <img
                src="/lockated/lockated-intro-pic.png"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <VideoPlayOverlay />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Divider + Solutionwise Videos */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
          <div className="border-t border-black py-4" />
          <Reveal y={14} className="text-center">
            <h2 className="font-heading text-[25px] font-medium capitalize leading-[1.2] text-black md:text-[30px]">
              Solutionwise Videos
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Alternating video rows — per-row backgrounds like replica */}
      {SOLUTION_ROWS.map((row, idx) => (
        <section
          key={row.title}
          className="bg-cover bg-no-repeat py-8 lg:py-[30px]"
          style={{
            backgroundImage: `url(${row.bg})`,
            backgroundPosition: row.bgPosition,
          }}
        >
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-10">
            <Reveal y={14} delay={40 + idx * 40}>
              <div
                className={`grid gap-8 md:grid-cols-3 md:items-start md:gap-10 ${
                  row.videoFirst ? '' : ''
                }`}
              >
                {row.videoFirst ? (
                  <>
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block aspect-video overflow-hidden rounded-md bg-slate-900 md:col-span-2"
                      aria-label={`Play ${row.title} video`}
                    >
                      <img
                        src={row.thumb}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <VideoPlayOverlay />
                    </a>
                    <div className="md:col-span-1 md:pt-12">
                      <h3 className="font-heading text-[28px] font-bold leading-[1.4] text-black md:pt-16 md:text-[32px]">
                        {row.title}
                      </h3>
                      <p className="mt-4 font-heading text-base font-normal leading-[1.8] text-black">
                        {row.desc}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:order-1 md:col-span-1 md:pt-12">
                      <h3 className="font-heading text-[28px] font-bold leading-[1.4] text-black md:pt-16 md:text-[32px]">
                        {row.title}
                      </h3>
                      <p className="mt-4 font-heading text-base font-normal leading-[1.8] text-black">
                        {row.desc}
                      </p>
                    </div>
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block aspect-video overflow-hidden rounded-md bg-slate-900 md:order-2 md:col-span-2"
                      aria-label={`Play ${row.title} video`}
                    >
                      <img
                        src={row.thumb}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <VideoPlayOverlay />
                    </a>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Media Coverage */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-10">
          <Reveal y={14} className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-[25px] font-medium capitalize leading-[1.2] text-black md:text-[30px]">
              Media Coverage
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 md:grid-cols-4">
            {(
              [
                { src: '/lockated/replica/EntrepreneurIndia.png', href: null },
                {
                  src: '/lockated/replica/cio-review.png',
                  href: 'https://real-estate.cioreviewindia.com/vendor/2018/lockated',
                },
                {
                  src: '/lockated/replica/et-logo.png',
                  href: 'https://brandequity.economictimes.indiatimes.com/news/business-of-brands/lock-stock-and-barrel/63293182',
                },
                {
                  src: '/lockated/replica/money-control-logo.png',
                  href: 'https://www.moneycontrol.com/news/business/startup/luxury-apartments-get-smarter-with-alexa-2580777.html',
                },
              ] as const
            ).map((x, i) => (
              <Reveal key={x.src} delay={40 + i * 70}>
                {x.href ? (
                  <a href={x.href} target="_blank" rel="noreferrer" className="block">
                    <img src={x.src} alt="" className="mx-auto h-10 w-auto max-w-full" loading="lazy" />
                  </a>
                ) : (
                  <img src={x.src} alt="" className="mx-auto h-10 w-auto max-w-full" loading="lazy" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
