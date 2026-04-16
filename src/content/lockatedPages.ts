export type LockatedPage = {
  key: string
  title: string
  subtitle?: string
  heroImage?: string
  youtubeUrl?: string
}

// These keys are aligned to your routes like:
// /category/client-types/:item
// /category/property-type/:item
// /category/solution-type/:item
export const lockatedPages: Record<string, LockatedPage> = {
  // Client Types
  'client-types/offices': {
    key: 'client-types/offices',
    title: 'Offices',
    heroImage: '/lockated/offices.png',
  },
  'client-types/commercial-buildings': {
    key: 'client-types/commercial-buildings',
    title: 'Commercial Buildings',
    heroImage: '/lockated/commercial-buildings.png',
  },
  'client-types/hotels': { key: 'client-types/hotels', title: 'Hotels', heroImage: '/lockated/hotels.png' },
  'client-types/residential-communities': {
    key: 'client-types/residential-communities',
    title: 'Residential Communities',
    heroImage: '/lockated/residential-communities.png',
  },
  'client-types/real-estate-developer': {
    key: 'client-types/real-estate-developer',
    title: 'Real Estate Developer',
    heroImage: '/lockated/real-estate-developer.png',
  },

  // Property Type
  'property-type/commercial-property': {
    key: 'property-type/commercial-property',
    title: 'Commercial Property',
  },
  'property-type/residential-property': {
    key: 'property-type/residential-property',
    title: 'Residential Property',
  },

  // Solution Type
  'solution-type/community-management-offices': {
    key: 'solution-type/community-management-offices',
    title: 'Community Management Offices',
  },
  'solution-type/community-management-building': {
    key: 'solution-type/community-management-building',
    title: 'Community Management Building',
  },
  'solution-type/residential-community-management': {
    key: 'solution-type/residential-community-management',
    title: 'Residential Community Management',
  },
  'solution-type/lead-management': { key: 'solution-type/lead-management', title: 'Lead Management' },
  'solution-type/site-management': { key: 'solution-type/site-management', title: 'Site Management' },
  'solution-type/brokers-management': { key: 'solution-type/brokers-management', title: 'Brokers Management' },
  'solution-type/snagging-and-qc-management': {
    key: 'solution-type/snagging-and-qc-management',
    title: 'Snagging & QC Management',
  },
  'solution-type/handover-management': {
    key: 'solution-type/handover-management',
    title: 'Handover Management',
  },
}

