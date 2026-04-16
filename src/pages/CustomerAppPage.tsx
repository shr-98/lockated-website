import { useEffect, useMemo, useState } from 'react'
import './CustomerAppPage.css'

type WtData = {
  label: string
  featureNum: string
  title: string
  desc: string
  feats: string[]
  image: string
}

const heroSlides = [
  'Make your customers your brand advocates.',
  'Reduce your cost of sales by 75% through referrals.',
  'Transition your real estate business from transactional to relationship-driven.',
]

const uspItems = [
  {
    name: 'Customer Mobile App',
    icon: 'fa-mobile-screen-button',
    body: "A white-labelled buyer app that puts the developer's brand in every homebuyer's pocket.",
  },
  {
    name: 'Customer Journey Dashboard',
    icon: 'fa-compass',
    body: 'Lifecycle engine from booking to possession with guided next actions and milestone tracking.',
  },
  {
    name: 'Referral & Loyalty Engine',
    icon: 'fa-bullhorn',
    body: 'Gamified referral hub with rewards, tracking, and campaign automation.',
  },
  {
    name: 'Construction Transparency',
    icon: 'fa-hard-hat',
    body: 'Real-time verified image and milestone updates to increase trust.',
  },
]

const testimonials = [
  {
    metric: '18% bookings from referrals',
    quote:
      'In 6 months of using Customer App, 18% of our new bookings came from existing homebuyer referrals.',
    name: 'Rajesh Kumar',
    role: 'VP Sales, Kalpataru Group',
    initials: 'RK',
  },
  {
    metric: '1.1 Cr in home loan commissions',
    quote:
      'Customer App structured our bank referral process into a measurable, high-conversion revenue line.',
    name: 'Amit Desai',
    role: 'CFO, Runwal Group',
    initials: 'AD',
  },
  {
    metric: 'NPS jumped from 32 to 54',
    quote:
      'Journey visibility and instant support improved trust and referral participation.',
    name: 'Priya Menon',
    role: 'Head of Loyalty, Panchshil Realty',
    initials: 'PM',
  },
]

const wtData: WtData[] = [
  {
    label: 'customer.app · Home',
    featureNum: 'Feature 1 of 4',
    title: 'Everything a buyer needs. Right on the home screen.',
    desc: 'A unified dashboard with booking, payments, support, loyalty and updates.',
    feats: [
      'Personalized welcome and unit details',
      'Quick actions: support, documents, payments',
      'Milestone snapshot and reminders',
      'Referral and rewards visibility',
    ],
    image: '/lockated/lockated-intro-pic.png',
  },
  {
    label: 'customer.app · Journey',
    featureNum: 'Feature 2 of 4',
    title: 'Every buyer. Every milestone. Zero missed steps.',
    desc: 'From booking to possession with smart alerts and approval checkpoints.',
    feats: [
      'Live milestone tracking',
      'Pending action alerts',
      'Registration and handover checkpoints',
      'Automated communication timeline',
    ],
    image: '/lockated/stack.png',
  },
  {
    label: 'customer.app · Support',
    featureNum: 'Feature 3 of 4',
    title: 'Every query tracked. Every issue resolved.',
    desc: 'Structured ticketing with assignment, SLA, and resolution updates.',
    feats: [
      'In-app issue raising',
      'Status visibility with timeline',
      'RM assignment and escalation',
      'CSAT capture on closure',
    ],
    image: '/lockated/contact-hero-art.png',
  },
  {
    label: 'customer.app · Referral',
    featureNum: 'Feature 4 of 4',
    title: 'Turn every happy buyer into a brand advocate.',
    desc: 'A gamified referral flow with campaign hooks and transparent reward tracking.',
    feats: [
      'Share-ready referral cards',
      'Tier-based loyalty',
      'Reward wallet and history',
      'Pipeline analytics',
    ],
    image: '/lockated/clients.png',
  },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let current = 0
    const step = Math.max(1, Math.floor(target / 60))
    const timer = window.setInterval(() => {
      current = Math.min(current + step, target)
      setValue(current)
      if (current >= target) window.clearInterval(timer)
    }, 20)
    return () => window.clearInterval(timer)
  }, [target])

  return <span className="metric-num">{value}{suffix}</span>
}

export default function CustomerAppPage() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const [uspIdx, setUspIdx] = useState(0)
  const [testiIdx, setTestiIdx] = useState(0)
  const [wtIdx, setWtIdx] = useState(0)

  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIdx((v) => (v + 1) % heroSlides.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestiIdx((v) => (v + 1) % testimonials.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="customer-app-page">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <nav className={navScrolled ? 'scrolled' : ''}>
        <div className="container nav-inner">
          <a href="#hero" className="nav-logo">
            <div className="logo-mark"><i className="fa-solid fa-bars" /></div>
            <span className="logo-name">Customer<span>App</span></span>
          </a>
          <ul className="nav-links">
            <li><a href="#solutions">Solutions</a></li>
            <li><a href="#walkthrough">Walkthrough</a></li>
            <li><a href="#teams">Teams</a></li>
            <li><a href="#contact">Pricing</a></li>
            <li><a href="#contact">About</a></li>
          </ul>
          <div className="nav-actions">
            <a href="#contact" className="nav-cta-text">Sign In</a>
            <a href="#contact" className="btn-primary nav-btn">Get Started <i className="fa-solid fa-arrow-right" /></a>
          </div>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <i className="fa-solid fa-circle-dot" />
            The Referral & Loyalty Platform for Real Estate Developers
          </div>
          <h1 className="hero-headline">Real Estate, <span className="hl">Reimagined.</span></h1>
          <p className="hero-sub">{heroSlides[heroIdx]}</p>
          <div className="hero-ctas">
            <a href="#contact" className="btn-primary"><i className="fa-solid fa-rocket" /> Get Started</a>
            <a href="#walkthrough" className="btn-outline"><i className="fa-solid fa-play" /> Watch Demo</a>
          </div>
          <div className="hero-metrics">
            <div className="metric-item"><Counter target={300} suffix="%" /><span className="metric-label">Increase in referral bookings</span></div>
            <div className="metric-sep" />
            <div className="metric-item"><Counter target={75} suffix="%" /><span className="metric-label">Reduction in cost of sales</span></div>
            <div className="metric-sep" />
            <div className="metric-item"><Counter target={25} suffix=" pts" /><span className="metric-label">Increase in buyer NPS</span></div>
          </div>
        </div>
      </section>

      <section id="solutions">
        <div className="container">
          <div className="sec-header">
            <div className="section-eyebrow">Solutions</div>
            <h2 className="section-title">One platform.<br />Every revenue lever. <span className="brand-text">Activated.</span></h2>
            <p className="section-sub">Customer App turns every satisfied homebuyer into a revenue-generating brand advocate.</p>
          </div>
          <div className="usp-layout">
            <div className="usp-list">
              {uspItems.map((item, i) => (
                <div
                  key={item.name}
                  className={`usp-item ${uspIdx === i ? 'active' : ''}`}
                  onClick={() => setUspIdx(i)}
                >
                  <div className="usp-header">
                    <div className="usp-header-left">
                      <div className="usp-icon"><i className={`fa-solid ${item.icon}`} /></div>
                      <span className="usp-name">{item.name}</span>
                    </div>
                    <div className="usp-toggle"><i className="fa-solid fa-plus" /></div>
                  </div>
                  <div className="usp-body">
                    <div className="usp-body-inner">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="usp-visual-wrap">
              <div className="usp-visual">
                <img src="/lockated/lockated-intro-pic.png" alt="Customer App" className="wt-app-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="container testi-layout">
          <div className="testi-left">
            <div className="testi-card active">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-metric">{testimonials[testiIdx].metric}</div>
              <div className="testi-quote">{testimonials[testiIdx].quote}</div>
              <div className="testi-author">
                <div className="testi-av">{testimonials[testiIdx].initials}</div>
                <div>
                  <div className="testi-name">{testimonials[testiIdx].name}</div>
                  <div className="testi-role">{testimonials[testiIdx].role}</div>
                </div>
              </div>
              <div className="testi-dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`testi-dot ${testiIdx === i ? 'active' : ''}`}
                    onClick={() => setTestiIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="testi-badge"><i className="fa-solid fa-star" /> Proven Results</div>
            <h2 className="testi-title">Revenue impact you can measure.</h2>
            <p className="testi-sub">Every metric is from real deployments with leading developers.</p>
          </div>
        </div>
      </section>

      <section id="walkthrough">
        <div className="container">
          <div className="sec-header">
            <div className="section-eyebrow">Product Walkthrough</div>
            <h2 className="section-title">See it <span className="brand-text">in action</span>.</h2>
          </div>
          <div className="wt-tabs">
            {wtData.map((w, i) => (
              <button
                key={w.label}
                type="button"
                className={`wt-tab ${wtIdx === i ? 'active' : ''}`}
                onClick={() => setWtIdx(i)}
              >
                <i className="fa-solid fa-circle" /> {w.label.split('·')[1]?.trim() ?? 'Feature'}
              </button>
            ))}
          </div>
          <div className="wt-layout">
            <div className="wt-screen">
              <img src={wtData[wtIdx].image} alt={wtData[wtIdx].title} className="wt-app-img" />
            </div>
            <div className="wt-info">
              <div className="wt-info-label">{wtData[wtIdx].featureNum}</div>
              <h3 className="wt-info-title">{wtData[wtIdx].title}</h3>
              <p className="wt-info-desc">{wtData[wtIdx].desc}</p>
              <div className="wt-features-list">
                {wtData[wtIdx].feats.map((f) => (
                  <div key={f} className="wt-feat-row">
                    <i className="fa-solid fa-check-circle" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" className="btn-primary"><i className="fa-solid fa-rocket" /> Get Started</a>
            </div>
          </div>
        </div>
      </section>

      <section id="teams">
        <div className="container">
          <div className="sec-header center">
            <div className="section-eyebrow center">Built for Every Team</div>
            <h2 className="section-title">One platform. <span className="brand-text">Every team aligned.</span></h2>
            <p className="section-sub">From loyalty and home loans to CRM and leadership.</p>
          </div>
          <div className="teams-tabs">
            {['CRM & RM', 'Construction', 'Loyalty & CX', 'Home Loans', 'Leadership'].map((t) => (
              <button key={t} type="button" className="team-tab">{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-form-card">
              <h3 className="contact-info-title">Talk to our team</h3>
              <div className="form-row">
                <input className="form-input" placeholder="First Name" />
                <input className="form-input" placeholder="Last Name" />
              </div>
              <input className="form-input" placeholder="Work Email" />
              <input className="form-input" placeholder="Company / Developer Name" />
              <button className="btn-primary full-btn"><i className="fa-solid fa-paper-plane" /> Request Your Demo</button>
            </div>
            <div>
              <h3 className="contact-info-title">We are building the category.<br /><span className="brand-text">Join us.</span></h3>
              <p className="contact-info-sub">Customer App is deployed across India with deep expertise in real estate loyalty and referral infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-bottom">
          <div className="footer-copy">© {year} Customer App. All rights reserved.</div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
