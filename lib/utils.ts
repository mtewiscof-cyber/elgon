import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price in Ugandan Shillings (UGX)
 * @param price - The price in cents or base units
 * @param showCurrency - Whether to show the UGX currency symbol (default: true)
 * @returns Formatted price string (e.g., "UGX 25,000" or "25,000")
 */
export function formatPrice(price: number, showCurrency: boolean = true): string {
  if (!price || price === 0) return showCurrency ? "UGX 0" : "0";
  
  // Convert to UGX (assuming price is stored in cents or base units)
  const ugxPrice = price;
  
  // Format with thousands separators
  const formattedPrice = ugxPrice.toLocaleString('en-US');
  
  return showCurrency ? `UGX ${formattedPrice}` : formattedPrice;
}

/**
 * Formats a price range in Ugandan Shillings (UGX)
 * @param minPrice - The minimum price
 * @param maxPrice - The maximum price
 * @returns Formatted price range string (e.g., "UGX 25,000 - 50,000")
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (!minPrice || !maxPrice) return "UGX 0";
  
  const minFormatted = formatPrice(minPrice, false);
  const maxFormatted = formatPrice(maxPrice, false);
  
  return `UGX ${minFormatted} - ${maxFormatted}`;
}

// Utility function to normalize shipping address from both old and new formats
export function normalizeShippingAddress(shippingAddress: any) {
  if (!shippingAddress) return null;
  
  return {
    name: shippingAddress.name || 'Customer Name',
    email: shippingAddress.email || 'customer@example.com',
    phone: shippingAddress.phone || '+256700000000',
    address: shippingAddress.address || shippingAddress.street || '',
    city: shippingAddress.city || '',
    state: shippingAddress.state || '',
    zipCode: shippingAddress.zipCode || shippingAddress.zip || '',
    country: shippingAddress.country || 'Uganda',
  };
}

// Check if shipping address is in old format
export function isOldShippingAddressFormat(shippingAddress: any): boolean {
  if (!shippingAddress) return false;
  return 'street' in shippingAddress && 'zip' in shippingAddress && 
         (!('address' in shippingAddress) || !('zipCode' in shippingAddress));
} 