export type Feature = { title: string; icon: string }

export type PricingPlan = {
  title: string
  badge?: string
  featured?: boolean
  priceMonthly: string
  priceYearly: string
  currencySymbol?: string
  features: string[]
  ctaLabel: string
}

export type SlugContent = {
  slug: string
  eyebrow: string
  title: string
  subtitle?: string
  intro?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  template?: 'default' | 'property'
  heroBackgroundImage?: string
  purposeImage?: string
  purposeImageAlt?: string
  stagesVideoUrl?: string
  showcaseImage?: string
  showcaseAlt?: string
  showShowcaseImage?: boolean
  featuresTitle?: string
  features: Feature[]
  secondaryFeaturesTitle?: string
  secondaryFeatures?: Feature[]
  sections?: Array<{ title: string; description?: string; image?: string }>
  showDemoForm?: boolean
  walkthroughTitle?: string
  walkthroughThumb?: string
  walkthroughUrl?: string
  walkthrough2Title?: string
  walkthrough2Thumb?: string
  walkthrough2Url?: string
  showPricingPlans?: boolean
  pricingPlans?: PricingPlan[]
  stagesTitle?: string
  stagesThumb?: string
  stages?: Array<{ title: string; description: string }>
}

export const slugContent: Record<string, SlugContent> = {
  '/hotels': {
    slug: '/hotels',
    eyebrow: 'Hotels',
    title: 'Contactless Solutions for Hotels',
    subtitle: 'Post COVID is the new era for hospitality.',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    template: 'property',
    heroBackgroundImage: '/lockated/pages/hotels-client-type.jpg',
    showcaseImage: '/lockated/pages/hotels-mobile-phone-mockup.png',
    showcaseAlt: 'Hotels Mobile Phone Mockup',
    featuresTitle: 'Sailent Features',
    features: [
      { title: 'Guest Self Registration', icon: '/lockated/pages/hotel-guest-self-registration.png' },
      { title: 'In Room Dining Bookings & Service', icon: '/lockated/pages/hotel-in-room-dining.png' },
      { title: 'Restaurant Table Reservation', icon: '/lockated/pages/hotel-table-reservation.png' },
      { title: 'QR Based Elevator Access', icon: '/lockated/pages/hotel-elevator-access.png' },
      { title: 'Room Info & Click to Call', icon: '/lockated/pages/hotel-click-to-call.png' },
      { title: 'Helpdesk & Room Service Request', icon: '/lockated/pages/hotel-room-service-request.png' },
    ],
    secondaryFeaturesTitle: 'Additional features',
    secondaryFeatures: [
      { title: 'Asset Management', icon: '/lockated/pages/cb-asset.png' },
      { title: 'Soft Services', icon: '/lockated/pages/cb-soft-services.png' },
      { title: 'Digital Checklist', icon: '/lockated/pages/cb-digital-checklist.png' },
      { title: 'Compliance Tracker', icon: '/lockated/pages/cb-asset.png' },
      { title: 'Inventory Management', icon: '/lockated/pages/cb-inventory.png' },
      { title: 'Soft Services', icon: '/lockated/pages/cb-soft-services.png' },
    ],
    sections: [
      {
        title: 'Contactless Check-in',
        description:
          'Guests can get the room ID by finishing off the check-in process online just like how airline check-in works.',
        image: '/lockated/pages/equipment-failure.jpg',
      },
      {
        title: 'Mobile App for In-Room Services',
        description:
          'Phone calls to front desk and services staff is just too old and lot of communications overhead. With contactless digital in-room services, your guests can place orders right from their mobile app.',
        image: '/lockated/pages/residential-platform.png',
      },
      {
        title: 'Digital Payments',
        description: 'Our contactless payment services let customers pay directly from their mobile devices.',
        image: '/lockated/pages/equipment-failure.jpg',
      },
      {
        title: 'Self Check-out',
        description:
          'Guests can settle dues online and check-out the property or extend their check-out without visiting front desk. Post check-out, they can leave reviews or comments.',
        image: '/lockated/pages/residential-platform.png',
      },
    ],
    showDemoForm: true,
  },

  '/commercial-buildings': {
    slug: '/commercial-buildings',
    eyebrow: 'Commercial Buildings',
    title: 'One Platform To Deliver Exceptional Tenant Experience and Drive Better ROI',
    subtitle: 'Integrated Community Management Platform',
    intro:
      'Maximise the value of your built environment with data driven insights. Get 360 degree portfolio visibility, drive continuous sustainability, predict and extend asset lifecycle. Enhance your tenant experience and loyalty by delivering exceptional experiences and drive better ROI.',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    heroBackgroundImage: '/lockated/pages/commercial-client-type-bg-1.jpg',
    template: 'property',

    featuresTitle: 'Sailent Features',
    features: [
      { title: 'Communication \nManagement', icon: '/lockated/pages/offices/Comunication.png' },
      { title: 'Helpdesk\nManagement', icon: '/lockated/pages/offices/Helpdesk-Management.png' },
      { title: 'Social Distancing\nAlerts', icon: '/lockated/pages/offices/Social-Distancing-Alerts.png' },
      { title: 'Space Booking\nManagement', icon: '/lockated/pages/offices/Space-Booking-Management.png' },
      {
        title: 'Visitor & Attendance\nManagement',
        icon: '/lockated/pages/offices/Visitor-Attendance-Management.png',
      },
      { title: 'Cafeteria\nManagement', icon: '/lockated/pages/offices/Cafeteria-Management.png' },
    ],

    secondaryFeaturesTitle: 'Sailent features like this',
    secondaryFeatures: [
      { title: 'Asset\nManagement', icon: '/lockated/pages/offices/Asset-Management.png' },
      { title: 'Soft\nServices', icon: '/lockated/pages/offices/Soft-Services.png' },
      { title: 'Digital \nChecklist', icon: '/lockated/pages/offices/Digital-Checklist.png' },
      { title: 'Compliance \nTracker', icon: '/lockated/pages/offices/Asset-Management.png' },
      { title: 'Inventory \nManagement', icon: '/lockated/pages/offices/Inventory-Management.png' },
      { title: 'Digital \nSafe', icon: '/lockated/pages/offices/Digital-Safe.png' },
    ],

    showcaseImage: '/lockated/pages/fm-matrix.png',
    showcaseAlt: 'FM Matrix',

    walkthroughTitle: 'Product Walkthrough',
    walkthroughThumb: '/lockated/pages/client-type-real-estate-company.jpg',
    walkthroughUrl: 'https://www.youtube.com/watch?v=W_S5Ev1l0EM',

    walkthrough2Title: 'FM Matrix — For Facility Managers and Management',
    walkthrough2Thumb: '/lockated/pages/visitor-suite-scaled.jpg',
    walkthrough2Url: 'https://www.youtube.com/watch?v=BLhzOHxrnpQ',

    showPricingPlans: true,
    pricingPlans: [
      {
        title: 'Basic',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'BOOK A DEMO',
      },
      {
        title: 'Essential',
        featured: true,
        badge: 'Most popular',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'BOOK A DEMO',
      },
      {
        title: 'Advanced',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'BOOK A DEMO',
      },
    ],
    showDemoForm: true,
  },

  '/commercial-property': {
    slug: '/commercial-property',
    eyebrow: 'Commercial Property',
    title: 'Commercial Real Estate \nGrows On Lockated',
    subtitle: 'A Tool to realise \nthe full value of your Smart real estate',
    intro:
      'An End-to-End Commercial Real Estate Management Software which enables real estate Owners, Occupants & Operators to boost Management and Maximize performance & returns.',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    template: 'property',
    heroBackgroundImage: '/lockated/pages/commercial-community-lp2.jpg',
    showcaseImage: '/lockated/pages/10x-2.png',
    showcaseAlt: 'Commercial property graphic',
    featuresTitle: 'Solution Applicability',
    features: [
      { title: 'Corporate Office', icon: '/lockated/offices.png' },
      { title: 'Multi Tenant Buildings', icon: '/lockated/commercial-buildings.png' },
      { title: 'Hotels', icon: '/lockated/hotels.png' },
      { title: 'Warehouse', icon: '/lockated/warehouses.png' },
      { title: 'Manufacturing', icon: '/lockated/pages/manufacturing.jpeg' },
    ],
    sections: [
      {
        title: 'Enhance Performance',
        description:
          'Detect and diagnose equipment failure by applying sophisticated IoT solutions & at your comfort monitor energy inefficiency by automatic data collection & monitoring',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'Maximise Your Property RoI',
        description:
          'Reduce costs and timelines. Drive an unsurpassed experience by data centralization and analytics leading to data backed decision making.',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'A System Built around consumer centricity',
        description:
          'Reduce costs and timelines. Drive an unsurpassed experience by data centralization and analytics leading to data backed decision making.',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'Reduce Time and Cost of R&M',
        description:
          'Bring Contracts, Vendors, Assets, Inventory, Labour and Tenant on a single unified app. And easily drill dow on an operational inefficiency thereby saving cost and time',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'Provide Faster and Better Support to Tenants',
        description:
          'Define Workflow Automations & let customers be Real Time notified about the Progress of their Tickets, Track TAT & SLA’s & Capture Feedbacks, to improve your service standards.',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'Role Based Reporting',
        description:
          'Get Smart Reporting, based on Role, Function & Hierarchy facilitating to view a single Property or Portfolio of Properties on a Single Dashboard depending on the assigned access.',
        image: '/lockated/pages/10x-2.png',
      },
      { title: 'Clients', image: '/lockated/pages/clientile-fullsize.png' },
    ],
    showDemoForm: true,
  },

  '/residential-property': {
    slug: '/residential-property',
    eyebrow: 'Residential Property',
    title: 'Residential Communities Connect\nOn Lockated',
    subtitle: 'A Single Connected Residential Solution',
    intro:
      'Connect your community with a single solution to meet a broad range of needs. Reap the efficiency, peace of mind, connectivity, security and cost rewards of an integrated residential community',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    template: 'property',
    heroBackgroundImage: '/lockated/pages/residential-community-lp3-scaled.jpeg',
    purposeImage: '/lockated/pages/equipment-failure.jpg',
    showcaseImage: '/lockated/pages/Screenshot-2021-04-29-at-6.46.50-PM.png',
    showcaseAlt: 'The Platform',
    showShowcaseImage: false,
    featuresTitle: 'The Platform',
    features: [
      { title: 'Connect with Fellow Residents', icon: '/lockated/pages/res-notices.png' },
      { title: 'Stay Connected With Your Property', icon: '/lockated/pages/res-helpdesk.png' },
      { title: 'Unleash the Benefits of a Connected Community', icon: '/lockated/pages/res-club.png' },
      { title: 'Security & Convenience', icon: '/lockated/pages/res-visitor.png' },
      { title: 'Bills & Payments', icon: '/lockated/pages/res-billing.png' },
      { title: 'Provide Faster & Better Support to Residents', icon: '/lockated/pages/res-helpdesk.png' },
    ],
    sections: [
      {
        title: 'Connect with Fellow Residents',
        description:
          'Lockated provides a mobile first approach for connecting residents and keeping them updated about the community. It enables discussing important topics, requesting follow residents for help. It further provides platform for forum discussions, online polls, groups and etc.',
        image: '/lockated/pages/equipment-failure.jpg',
      },
      {
        title: 'Stay Connected With Your Property',
        description:
          'Manage multiple properties with a connected solution even if you are staying away. Raise a service request, pay property dues, maintaining accounts history to managing tenants data. Lockated’s makes it super easy to manage it all.',
        image: '/lockated/pages/Screenshot-2021-04-29-at-6.46.50-PM.png',
      },
      {
        title: 'Unleash the Benefits of a Connected Community',
        description:
          'Whether it’s about the new Mental Fitness Classes or Yoga Sessions in the clubhouse, or a fellow resident is hosting a party. All community related information and activities are available right on the Lockated App. Get the most of a connected community with Lockated.',
      },
      {
        title: 'Security & Convenience',
        description:
          'Get notified about your visitors automatically. Be in control of your visitors & staff from anywhere in the world. Pre-authorize expected visitors, instruct security, mobile intercom, and maintain visitor list.',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'Bills & Payments',
        description:
          'Enable bill utility payments, due collections with integrated and automated solution. Raise invoices, collect society dues, generate instant receipts and much more.',
        image: '/lockated/pages/10x-2.png',
      },
      {
        title: 'Provide Faster & Better Support to Residents',
        description:
          'Define Workflow Automations. And Digitize asset management, parking management, amenities management, flat management, access management, fitout management much more. Track stats, SLA’s and capture feedbacks to improve your service standars.',
        image: '/lockated/pages/10x-2.png',
      },
      { title: 'Clients', image: '/lockated/pages/clientile-fullsize.png' },
    ],
    showDemoForm: true,
  },

  '/real-estate-developer': {
    slug: '/real-estate-developer',
    eyebrow: 'Integrated Solution Serving Across Project Lifecycle',
    title: 'Real Estate Runs on Lockated',
    intro:
      'An Integrated PropTech platform catering to all stakeholders across a Project Lifecycle focusing on delivering value to Real Estate Developers using data backed intelligence.',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    template: 'property',
    heroBackgroundImage: '/lockated/pages/client-type-real-estate-company.jpg',
    purposeImage: '/lockated/pages/real-estate-icon1.png',
    stagesTitle: 'Solutions By Real Estate Project Stages',
    stagesThumb: '/lockated/pages/snagging-lp.jpg',
    stagesVideoUrl: 'https://youtu.be/uEPQ9_CAKrU',
    stages: [
      {
        title: 'Pre-Sales Stage',
        description:
          'Focuses on Lead Management, Campaign Management, Channel Partner Management, Site Sales Management for Real Estate Companies',
      },
      {
        title: 'Post-Sales Stage',
        description:
          'CRM for Real Estate Companies along with a Mobile Application for the user to provide regular updates on the Project Progress such as Construction, Demand Notes, etc. Helps companies to run gratification programmes for existing customer and generates more leads.',
      },
      {
        title: 'Transitioning Stage',
        description:
          'Undertake Real Estate QC across various check points for Real Estate Project and schedule virtual handovers for customers to enable a smooth handover.',
      },
      {
        title: 'Possession Stage',
        description:
          'Community and property management solution for Residential & Commercial properties along with Visitor & Access Management which can be used by the Property Owners, Property Management Companies and the Real Estate Developer. The Package includes solutions such as Security Management, Club Management, Help Desk Management in a very engaging platform.',
      },
    ],
    featuresTitle: 'Sailent Features',
    features: [
      { title: 'Optimize\nLeads Cost', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
      { title: 'CRM\nSolution', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
      { title: 'AR/VR\nBrochures', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
      { title: 'Improve Sales\nConversion', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
      { title: 'Real Time\nReports', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
      { title: 'Construction\nMonitoring', icon: '/lockated/pages/real-estate/digital-safe-full.png' },
      { title: 'Loyalty\nPlatform', icon: '/lockated/pages/real-estate/soft-services-full.png' },
      { title: 'Snagging & QC Monitoring', icon: '/lockated/pages/real-estate/digital-checklist-full.png' },
      { title: 'Future Ready\nHomes', icon: '/lockated/pages/real-estate/compliance-tracker-full.png' },
      { title: 'Value Added Services', icon: '/lockated/pages/real-estate/inventory-management-full.png' },
    ],
    sections: [{ title: 'Clients', image: '/lockated/pages/clientile-fullsize.png' }],
    showDemoForm: true,
  },

  '/offices': {
    slug: '/offices',
    eyebrow: 'Community Management Offices',
    title: 'An Integrated Tool Managing Multiple Facilities Driving Employee Centricity',
    subtitle: 'Manage your Real Estate Portfolio',
    intro:
      'Maximize the value of your built environment by streamlining your property management with a single integrated solution that addresses all your current and future needs. Drive excellent experience by covering all aspects of your workplace management with space utilisation, room booking, occupant service request, and visitor management, assets,',
    purposeImage: '/lockated/workplace-bg1.jpg',
    showcaseImage: '/lockated/pages/fm-matrix.png',
    showcaseAlt: 'FM Matrix',
    featuresTitle: 'Sailent Features',
    features: [
      { title: 'Communication \nManagement', icon: '/lockated/pages/offices/Comunication.png' },
      { title: 'Helpdesk\nManagement', icon: '/lockated/pages/offices/Helpdesk-Management.png' },
      { title: 'Social Distancing\nAlerts', icon: '/lockated/pages/offices/Social-Distancing-Alerts.png' },
      { title: 'Space Booking\nManagement', icon: '/lockated/pages/offices/Space-Booking-Management.png' },
      {
        title: 'Visitor & Attendance\nManagement',
        icon: '/lockated/pages/offices/Visitor-Attendance-Management.png',
      },
      { title: 'Cafeteria\nManagement', icon: '/lockated/pages/offices/Cafeteria-Management.png' },
    ],
    secondaryFeaturesTitle: 'Additional features',
    secondaryFeatures: [
      { title: 'Asset\nManagement', icon: '/lockated/pages/offices/Asset-Management.png' },
      { title: 'Soft\nServices', icon: '/lockated/pages/offices/Soft-Services.png' },
      { title: 'Digital \nChecklist', icon: '/lockated/pages/offices/Digital-Checklist.png' },
      { title: 'Compliance \nTracker', icon: '/lockated/pages/offices/Asset-Management.png' },
      { title: 'Inventory \nManagement', icon: '/lockated/pages/offices/Inventory-Management.png' },
      { title: 'Digital \nSafe', icon: '/lockated/pages/offices/Digital-Safe.png' },
    ],
    walkthroughTitle: 'Product Walkthrough',
    walkthroughThumb: '/lockated/pages/fm-suite-scaled.jpg',
    walkthroughUrl: 'https://www.youtube.com/watch?v=2KILrKZ8umM',
    walkthrough2Title: 'FM Matrix — For Facility Managers and Management',
    walkthrough2Thumb: '/lockated/pages/visitor-suite-scaled.jpg',
    walkthrough2Url: 'https://www.youtube.com/watch?v=BLhzOHxrnpQ',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    showPricingPlans: true,
    pricingPlans: [
      {
        title: 'Basic',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Select',
      },
      {
        title: 'Essential',
        featured: true,
        badge: 'Most popular',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Select',
      },
      {
        title: 'Advanced',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Select',
      },
    ],
  },

  '/residential-communities': {
    slug: '/residential-communities',
    eyebrow: 'Residential Community Management',
    title: 'Residential Communities Connect \nOn Lockated',
    subtitle: 'Connected Residence, Connected Community',
    intro:
      'Connect and manage your residential community on the go with the more secure and reliable community management app. An integrated solution for Tenants, Owners, Facility Managers and Managing Committees to stay on top off the day to day operations on the go.',
    purposeImage: '/lockated/pages/residential-community-bg.jpg',
    showcaseImage: '/lockated/pages/residential-community-management-app.png',
    showcaseAlt: 'Residential Community Management App',
    featuresTitle: 'Sailent Features',
    features: [
      { title: 'Visitor\nManagement', icon: '/lockated/pages/residential/visitor-management.png' },
      {
        title: 'Accounting & Billing\nManagement',
        icon: '/lockated/pages/residential/accounts-billing.png',
      },
      { title: 'Helpdesk\nManagement', icon: '/lockated/pages/residential/helpdesk-management.png' },
      { title: 'Notices, Events \n& Polls', icon: '/lockated/pages/residential/notices-events-polls.png' },
      { title: 'Club\nManagement', icon: '/lockated/pages/residential/club-management.png' },
      { title: 'Staff\nManagement', icon: '/lockated/pages/residential/staff-management.png' },
    ],
    secondaryFeaturesTitle: 'Sailent features like this',
    secondaryFeatures: [
      { title: 'Asset\nManagement', icon: '/lockated/pages/residential/asset-management.png' },
      { title: 'Parking\nManagement', icon: '/lockated/pages/residential/parking-management.png' },
      { title: 'Flat\nManagement', icon: '/lockated/pages/residential/flat-management.png' },
      { title: 'Access\nManagement', icon: '/lockated/pages/residential/access-management.png' },
      { title: 'Fitout\nManagement', icon: '/lockated/pages/residential/fitout-management.png' },
      { title: 'Concierge\nManagement', icon: '/lockated/pages/residential/concierge-management.png' },
    ],
    walkthroughTitle: 'Product Walkthrough',
    walkthroughThumb: '/lockated/pages/residential-community-lp.jpg',
    walkthroughUrl: 'https://www.youtube.com/watch?v=uq9v-WdzSSY',
    walkthrough2Title: 'Residential Community — For Management',
    walkthrough2Thumb: '/lockated/pages/residential-community-lp.jpg',
    walkthrough2Url: 'https://www.youtube.com/watch?v=uq9v-WdzSSY',
    primaryCtaLabel: 'BOOK A DEMO',
    primaryCtaHref: '#demo',
    showPricingPlans: true,
    pricingPlans: [
      {
        title: 'Basic',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Select',
      },
      {
        title: 'Essential',
        featured: true,
        badge: 'Most popular',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Select',
      },
      {
        title: 'Advanced',
        priceMonthly: '9',
        priceYearly: '9',
        currencySymbol: '₹',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Select',
      },
    ],
  },

  '/lead-management': {
    slug: '/lead-management',
    eyebrow: 'Lead Management',
    title: 'Lead Management Built for Real Estate',
    purposeImage: '/lockated/pages/lead-management-purpose.png',
    showcaseImage: '/lockated/pages/lead-infinity.png',
    showcaseAlt: 'Lead Infinity',
    featuresTitle: 'Sailent features',
    features: [
      { title: 'Multiple Lead Sources', icon: '/lockated/pages/lead-multiple-lead-sources.png' },
      { title: 'Campaign Building', icon: '/lockated/pages/lead-campaign.png' },
      { title: 'Performance Tracking', icon: '/lockated/pages/lead-performance.png' },
      { title: 'Real Time Analysis', icon: '/lockated/pages/lead-multiple-lead-sources.png' },
      { title: 'Cloud Telephony', icon: '/lockated/pages/lead-telephony.png' },
      { title: 'Automate Customer Journeys', icon: '/lockated/pages/lead-journeys.png' },
    ],
  },

  '/site-management': {
    slug: '/site-management',
    eyebrow: 'Site Management',
    title: 'Site Management',
    purposeImage: '/lockated/pages/site-management-purpose.png',
    showcaseImage: '/lockated/pages/site-management-hero.png',
    showcaseAlt: 'Site Management',
    featuresTitle: 'Sailent features',
    features: [
      { title: 'Site Visit Scheduling', icon: '/lockated/pages/site-visit.png' },
      { title: 'On-Site Registration', icon: '/lockated/pages/site-registration.png' },
      { title: 'Site Stagging', icon: '/lockated/pages/site-stagging.png' },
      { title: 'Aging Reports', icon: '/lockated/pages/site-visit.png' },
      { title: 'Sync Inventory', icon: '/lockated/pages/site-inventory.png' },
      { title: 'Track Multiple Payments', icon: '/lockated/pages/site-payments.png' },
    ],
  },

  '/brokers-management': {
    slug: '/brokers-management',
    eyebrow: 'Brokers Management',
    title: 'Brokers Management',
    purposeImage: '/lockated/pages/broker-management-purpose.png',
    showcaseImage: '/lockated/pages/brokerz.png',
    showcaseAlt: 'Brokerz',
    featuresTitle: 'Sailent features',
    features: [
      { title: 'Channel Partner Management', icon: '/lockated/pages/broker-channel.png' },
      { title: 'Appointment & Reminders', icon: '/lockated/pages/broker-appointments.png' },
      { title: 'Virtual Tours & Customer Journey', icon: '/lockated/pages/broker-tours.png' },
      { title: 'Digital Brochure', icon: '/lockated/pages/broker-channel.png' },
      { title: 'Inventory Management', icon: '/lockated/pages/broker-inventory.png' },
      { title: 'Inventory Blocking', icon: '/lockated/pages/broker-blocking.png' },
    ],
  },

  '/snagging-qc-management': {
    slug: '/snagging-qc-management',
    eyebrow: 'Snagging & QC Management',
    title: 'Snagging & QC Management',
    purposeImage: '/lockated/pages/snagging-purpose.png',
    showcaseImage: '/lockated/pages/snag-360.png',
    showcaseAlt: 'Snag 360',
    featuresTitle: 'Sailent features',
    features: [
      { title: 'Realtime Dashboard', icon: '/lockated/pages/snag-dashboard.png' },
      { title: 'Digital Checklist', icon: '/lockated/pages/snag-checklist.png' },
      { title: 'Customizable Workflow', icon: '/lockated/pages/snag-workflow.png' },
      { title: 'Role Based Access', icon: '/lockated/pages/snag-access.png' },
      { title: 'Work Scheduling', icon: '/lockated/pages/snag-scheduling.png' },
      { title: 'Multi Level Escalations', icon: '/lockated/pages/snag-escalations.png' },
    ],
    walkthroughTitle: 'Product Walkthrough',
    walkthroughUrl: 'https://www.youtube.com/watch?v=fEHoeM_82a4',
  },

  '/handover-management': {
    slug: '/handover-management',
    eyebrow: 'Handover Management',
    title: 'Handover Management',
    purposeImage: '/lockated/pages/handover-purpose.png',
    showcaseImage: '/lockated/pages/virtual-handover.png',
    showcaseAlt: 'Virtual Handover',
    featuresTitle: 'Sailent features',
    features: [
      { title: 'Site Visit Scheduling', icon: '/lockated/pages/handover-site-visit.png' },
      { title: 'Roster Management', icon: '/lockated/pages/handover-roster.png' },
      { title: 'Automated Scheduling', icon: '/lockated/pages/handover-automated.png' },
      { title: 'Virtual Live Streaming', icon: '/lockated/pages/handover-streaming.png' },
      { title: 'Video Calling Personalised Setup', icon: '/lockated/pages/handover-video-calling.png' },
      { title: 'Online Consent', icon: '/lockated/pages/handover-consent.png' },
    ],
  },
}

