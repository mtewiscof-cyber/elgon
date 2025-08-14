import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price value for display
 * @param price - The price value to format
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'shs'): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'N/A'
  }
  // Format with commas, no decimal places
  const formatted = Math.round(price).toLocaleString()
  return `${currency} ${formatted}`
}

// Generate a URL-friendly slug from a string
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Normalizes various shipping address shapes into a consistent structure
export type NormalizedShippingAddress = {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
} | null

type ShippingAddressInput = Partial<{
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  street: string
  zip: string
}> | undefined | null

export function normalizeShippingAddress(address: ShippingAddressInput): NormalizedShippingAddress {
  if (!address || typeof address !== 'object') return null

  const normalized = {
    name: typeof address.name === 'string' ? address.name : undefined,
    email: typeof address.email === 'string' ? address.email : undefined,
    phone: typeof address.phone === 'string' ? address.phone : undefined,
    address:
      typeof address.address === 'string' && address.address !== ''
        ? address.address
        : typeof address.street === 'string'
          ? address.street
          : undefined,
    city: typeof address.city === 'string' ? address.city : undefined,
    state: typeof address.state === 'string' ? address.state : undefined,
    zipCode:
      typeof address.zipCode === 'string' && address.zipCode !== ''
        ? address.zipCode
        : typeof address.zip === 'string'
          ? address.zip
          : undefined,
    country: typeof address.country === 'string' ? address.country : undefined,
  }

  const hasAnyValue = Object.values(normalized).some(v => v !== undefined && v !== null && v !== '')
  return hasAnyValue ? normalized : null
}
