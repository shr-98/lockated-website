import { Reveal } from '../components/Reveal'

export default function AboutPage() {
  return (
    <>
      {/* Our Story */}
      <section className="bg-[#1A3A6A]">
        <div className="mx-auto max-w-[1000px] px-4 pb-0 pt-[70px]">
          <Reveal y={18}>
            <h1 className="text-center font-heading text-[40px] font-normal capitalize leading-[1.9] text-white">
              Our Story
            </h1>
            <p className="mt-2 px-0 text-center font-sans text-[18px] font-extralight text-white sm:px-[50px] sm:pb-[30px]">
              Lockated is an integrated multi-solution prop-tech platform that caters to all stakeholders across a
              project lifecycle for residential &amp; commercial real estate, driving to collaboratively enhance the
              end consumer experience. It envisions being the largest community &amp; aggregator for the industry,
              and catering to the customers needs in an integrated manner for technical solutions for prop-tech.
            </p>
          </Reveal>

          <Reveal y={18} delay={120} className="-mb-40">
            <a
              href="https://www.youtube.com/watch?v=h1_k4g34HTs"
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-video overflow-hidden rounded-md"
              aria-label="Play video"
            >
              <img
                src="/lockated/pages/about-video-thumb.jpg"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105">
                  ▶
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Stay tuned */}
      <section className="bg-[#F99F1D]">
        <div className="mx-auto max-w-[1140px] px-4 pb-[100px] pt-[100px]">
          <Reveal y={14}>
            <h2 className="text-center font-heading text-[22px] font-normal text-black sm:text-[35px]">
              Stay tuned and receive updates
            </h2>
            <div className="mt-5 flex justify-center">
              <div className="inline-flex h-14 w-14 items-center justify-center text-black">
                <span className="text-[35px] leading-none">✓</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-16">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5 md:pr-[19%]">
              <Reveal y={14}>
                <h3 className="text-center font-heading text-[30px] font-normal text-black md:text-left">
                  Our Mission
                </h3>
                <p className="mt-4 text-center font-sans text-[15px] text-[#353535] md:text-left">
                  To be a dependable, integrated, and customer-centric tech solution provider for all stakeholders of
                  the real estate eco-system.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:-mt-10">
              <Reveal y={14} delay={120}>
                <div className="border-[15px] border-white shadow-[0_1px_20px_rgba(0,0,0,0.5)]">
                  <img
                    src="/lockated/pages/about-architecture-3.jpg"
                    alt=""
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-16">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7 md:-mt-16">
              <Reveal y={14}>
                <div className="border-[15px] border-white shadow-[0_1px_20px_rgba(0,0,0,0.5)]">
                  <img
                    src="/lockated/pages/about-architecture-1.jpg"
                    alt=""
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:pl-[19%]">
              <Reveal y={14} delay={120}>
                <h3 className="text-center font-heading text-[31px] font-normal text-black md:text-left">
                  Our Vision
                </h3>
                <p className="mt-4 text-center font-sans text-[15px] text-[#353535] md:text-left">
                  To be an integrated multi-product prop-tech platform that bridges the gap between what customers
                  need and what the supplier provides.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Locations */}
      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-4 pb-[100px] pt-10">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5 md:pr-[19%]">
              <Reveal y={14}>
                <h3 className="text-center font-heading text-[31px] font-normal text-black md:text-left">
                  Our Locations
                </h3>
                <p className="mt-4 text-center font-sans text-[15px] text-[#353535] md:text-left">
                  We are headquartered in Mumbai, India and just launched in UAE. We serve customers across the globle.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:-mt-10">
              <Reveal y={14} delay={120}>
                <div className="border-[15px] border-white shadow-[0_1px_20px_rgba(0,0,0,0.5)]">
                  <img
                    src="/lockated/pages/about-architecture-2.jpg"
                    alt=""
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

