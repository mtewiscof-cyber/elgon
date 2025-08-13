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
  
  return `${currency}${price.toFixed(2)}`
}

// Generate a URL-friendly slug from a string
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
