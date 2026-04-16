export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(130deg,#F99F1D_0%,#FFCB06_89%)]">
        <div className="absolute inset-0 opacity-[0.15]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/lockated/pages/contact/bg-homepage-high.png)' }}
          />
        </div>
        <div className="relative mx-auto min-h-[534px] max-w-[1200px] px-5 pb-28 pt-0 lg:px-5">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="mt-[75px]">
              <h1 className="font-heading text-[45px] font-black capitalize leading-[1.2] text-black md:text-[45px]">
                Contact Lockated
              </h1>
              <p className="mt-4 text-[23px] font-normal leading-[1.4] text-black">
                Got a question? Our teams are here to help. Simply fill out the form, and we&#8217;ll be in touch as
                soon as possible.
              </p>
              <p className="mt-4 text-[23px] font-medium leading-[1.4] text-black">
                Customer Care: +91 7303434567
                <br />
                Email: customercare@lockated.com
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <img
                src="/lockated/pages/contact/hero-home.png"
                alt=""
                className="w-full max-w-[539px] rounded-[300px_100px_100px_100px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:-mb-[50%] md:w-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spacer + heading */}
      <section className="bg-[#f7f8f9]">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="h-[71px]" />
        </div>
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 className="py-1 text-center text-[25px] uppercase text-black">We had love to get you started</h2>
        </div>
      </section>

      {/* Form */}
      <section className="bg-[#f7f8f9] pb-14">
        <div className="mx-auto max-w-[1200px] px-4">
          <form className="mx-auto max-w-[1200px]">
            <div className="-mx-[5px] grid grid-cols-1 gap-y-[10px] md:grid-cols-3">
              {[
                { label: 'Name', placeholder: 'Full Name', type: 'text', autoComplete: 'name' },
                { label: 'Company Email', placeholder: 'yourname@companyname.com', type: 'email', autoComplete: 'email' },
                { label: 'Phone', placeholder: '555 666 7777', type: 'tel', autoComplete: 'tel' },
                { label: 'Country', placeholder: 'Your Country', type: 'text', autoComplete: 'country-name' },
                { label: 'Company Name', placeholder: 'Your Company Name', type: 'text', autoComplete: 'organization' },
              ].map((f) => (
                <label key={f.label} className="px-[5px]">
                  <div className="text-sm text-black">{f.label}</div>
                  <input
                    type={f.type}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    required={f.label !== 'Country'}
                    className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#CA575D]"
                  />
                </label>
              ))}

              <label className="px-[5px]">
                <div className="text-sm text-black">Property Type</div>
                <select
                  required
                  className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#CA575D]"
                  defaultValue="Residential"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Others">Others</option>
                </select>
              </label>
            </div>

            <div className="mt-[10px] grid grid-cols-1 gap-y-[10px] md:grid-cols-2">
              <label className="px-[5px]">
                <div className="text-sm text-black">Solution Interested In</div>
                <select className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#CA575D]">
                  {[
                    'Lead Management',
                    'CRM',
                    'Brokers Management',
                    'Site Management',
                    'Snagging / QC Management',
                    'Handover Management',
                    'Access & Visitor Management',
                    'Commercial Community Management',
                    'Residential Community Management',
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="px-[5px]">
                <div className="text-sm text-black">Your Message</div>
                <input
                  type="text"
                  placeholder="Your Messgae"
                  className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#CA575D]"
                />
              </label>
            </div>

            <div className="mt-[10px] px-[5px]">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded bg-[#CA575D] py-2.5 text-sm font-semibold text-white"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* HQ CTA */}
      <section className="relative overflow-hidden bg-[linear-gradient(130deg,#1A3A6A_0%,#82A9D0_89%)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/lockated/pages/contact/cta-shapes.png)' }}
          />
        </div>

        <div className="relative mx-auto min-h-[665px] max-w-[1200px] px-5 pb-16 pt-28">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="md:pr-[30px]">
              <h3 className="font-heading text-[45px] font-black capitalize leading-[1.2] text-white md:text-[45px]">
                Our Headquarters
              </h3>
              <p className="mt-4 text-[23px] font-normal leading-[1.4] text-white">Haven Infoline LLP</p>
              <p className="mt-2 text-[18px] font-normal leading-[1.4] text-white">
                2nd Floor, Jyoti Tower, Opp. Versova Police Station, Andheri (West), Mumbai 400053, India.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <img
                src="/lockated/pages/contact/cta-home.png"
                alt=""
                className="w-full max-w-[539px] rounded-[300px_100px_100px_100px] shadow-[0_0_30px_rgba(0,0,0,0.12)] md:-mt-[10%] md:w-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

