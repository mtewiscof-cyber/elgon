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