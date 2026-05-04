// Shared lead capture utility — posts to Lockated CRM public API
// Each product page calls hookLeadForm() inside its useEffect after HTML is injected.

const CRM_API = import.meta.env.VITE_CRM_API_URL ?? 'http://localhost:3001/api'
const API_TOKEN = import.meta.env.VITE_CRM_API_TOKEN ?? ''

export interface LeadPayload {
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  phone?: string
  company?: string
  job_title?: string
  industry?: string
  message?: string
  source: string
  // product-specific extras
  portfolio_size?: string
  cp_network_size?: string
  number_of_properties?: string
  use_case?: string
  challenge?: string
  // UTM / tracking
  landing_page?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

function getUTM() {
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') ?? undefined,
    utm_medium: p.get('utm_medium') ?? undefined,
    utm_campaign: p.get('utm_campaign') ?? undefined,
    utm_term: p.get('utm_term') ?? undefined,
    utm_content: p.get('utm_content') ?? undefined,
    landing_page: window.location.href,
  }
}

export async function submitLead(payload: LeadPayload): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${CRM_API}/leads/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, ...getUTM(), api_token: API_TOKEN }),
    })
    const data = await res.json()
    return data
  } catch {
    return { success: false, error: 'Network error — please try again.' }
  }
}

// ── Read form fields from injected HTML ────────────────────────────────────────
function val(root: Element, selector: string): string {
  return (root.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector)?.value ?? '').trim()
}

function inputByPlaceholder(root: Element, text: string): string {
  return (
    (
      root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`input[placeholder*="${text}" i], textarea[placeholder*="${text}" i]`)
        ?.value ?? ''
    ).trim()
  )
}

function selectByLabel(root: Element, text: string): string {
  // find a label containing text, then the sibling/child select
  const labels = Array.from(root.querySelectorAll<HTMLElement>('label'))
  const label = labels.find((l) => l.textContent?.toLowerCase().includes(text.toLowerCase()))
  if (!label) return ''
  const sel = label.querySelector<HTMLSelectElement>('select') ?? label.nextElementSibling?.querySelector<HTMLSelectElement>('select')
  return sel?.value?.trim() ?? ''
}

// Splits "Full Name" into first/last
function splitName(full: string): { first_name: string; last_name: string } {
  const parts = full.trim().split(/\s+/)
  return { first_name: parts[0] ?? '', last_name: parts.slice(1).join(' ') || parts[0] ?? '' }
}

// ── Generic form extractor — works across all product HTML files ──────────────
export function extractFormData(root: Element, source: string): LeadPayload {
  // Try explicit name / first+last
  const fullName =
    inputByPlaceholder(root, 'full name') ||
    inputByPlaceholder(root, 'your name') ||
    inputByPlaceholder(root, 'john doe') ||
    inputByPlaceholder(root, 'rajesh') ||
    inputByPlaceholder(root, 'rahul') ||
    inputByPlaceholder(root, 'arjun') ||
    val(root, 'input[name="name"]') ||
    val(root, 'input[name="full_name"]')

  const firstName =
    inputByPlaceholder(root, 'first name') || val(root, 'input[name="first_name"]')
  const lastName =
    inputByPlaceholder(root, 'last name') || val(root, 'input[name="last_name"]')

  const names = fullName
    ? splitName(fullName)
    : { first_name: firstName, last_name: lastName }

  const email =
    val(root, 'input[type="email"]') ||
    inputByPlaceholder(root, 'email') ||
    inputByPlaceholder(root, '@company')

  const phone =
    val(root, 'input[type="tel"]') ||
    inputByPlaceholder(root, 'phone') ||
    inputByPlaceholder(root, '98765') ||
    inputByPlaceholder(root, '+91')

  const company =
    inputByPlaceholder(root, 'company') ||
    inputByPlaceholder(root, 'developer name') ||
    inputByPlaceholder(root, 'developer') ||
    val(root, 'input[name="company"]')

  const jobTitle =
    inputByPlaceholder(root, 'job title') ||
    inputByPlaceholder(root, 'head of') ||
    inputByPlaceholder(root, 'designation') ||
    val(root, 'input[name="job_title"]')

  const industry =
    selectByLabel(root, 'industry') ||
    val(root, 'select[name="industry"]')

  const message =
    val(root, 'textarea') ||
    inputByPlaceholder(root, 'challenge') ||
    inputByPlaceholder(root, 'pain point') ||
    inputByPlaceholder(root, 'message') ||
    inputByPlaceholder(root, 'use case') ||
    inputByPlaceholder(root, 'primary use case')

  const portfolioSize =
    selectByLabel(root, 'portfolio size') ||
    selectByLabel(root, 'portfolio') ||
    inputByPlaceholder(root, 'portfolio')

  const cpNetworkSize =
    selectByLabel(root, 'cp network') ||
    selectByLabel(root, 'network size') ||
    inputByPlaceholder(root, 'cp network')

  const numberOfProperties =
    selectByLabel(root, 'number of properties') ||
    selectByLabel(root, 'properties') ||
    inputByPlaceholder(root, 'properties')

  return {
    ...names,
    email,
    phone,
    company,
    job_title: jobTitle,
    industry,
    message,
    source,
    portfolio_size: portfolioSize || undefined,
    cp_network_size: cpNetworkSize || undefined,
    number_of_properties: numberOfProperties || undefined,
  }
}

// ── Wire up a submit button in an injected HTML root ─────────────────────────
// Returns cleanup function.
export function hookLeadForm(
  root: Element,
  source: string,
  options?: {
    /** Extra selectors to try for the submit button. Defaults include common patterns. */
    submitSelectors?: string[]
    /** Called with success/fail result after API responds */
    onResult?: (ok: boolean, msg: string) => void
  },
): () => void {
  const selectors = options?.submitSelectors ?? [
    '.form-submit button',
    '.btn-form-submit',
    'button.form-submit',
    '.contact-form button[type="submit"]',
    '.contact-form .btn-primary',
    '.demo-form button',
    'form button[type="submit"]',
    // fallback: any .btn-primary inside a form-like container
    '.contact-section .btn-primary',
    '.contact .btn-primary',
    '#contact .btn-primary',
    '.cta-form .btn-primary',
    '.form-row ~ .form-submit .btn-primary',
  ]

  let submitBtn: HTMLButtonElement | null = null
  for (const sel of selectors) {
    submitBtn = root.querySelector<HTMLButtonElement>(sel)
    if (submitBtn) break
  }

  if (!submitBtn) return () => {}

  const originalText = submitBtn.textContent ?? 'Submit'

  const handler = async (e: Event) => {
    e.preventDefault()
    e.stopImmediatePropagation()

    submitBtn!.disabled = true
    submitBtn!.textContent = 'Sending…'

    const payload = extractFormData(root, source)

    // Basic validation
    if (!payload.email) {
      submitBtn!.disabled = false
      submitBtn!.textContent = originalText
      alert('Please enter your work email.')
      return
    }

    const result = await submitLead(payload)

    if (result.success) {
      submitBtn!.textContent = '✓ Request Sent!'
      submitBtn!.style.background = '#798C5E'
      options?.onResult?.(true, result.message ?? 'Thank you! We'll be in touch shortly.')
      setTimeout(() => {
        submitBtn!.disabled = false
        submitBtn!.textContent = originalText
        submitBtn!.style.background = ''
      }, 4000)
    } else {
      submitBtn!.disabled = false
      submitBtn!.textContent = originalText
      const msg = result.error ?? 'Something went wrong. Please try again.'
      options?.onResult?.(false, msg)
      alert(msg)
    }
  }

  submitBtn.addEventListener('click', handler)
  return () => submitBtn!.removeEventListener('click', handler)
}
