import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const migrateOrdersShippingAddress = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all orders
    const orders = await ctx.db.query("orders").collect();
    
    let migratedCount = 0;
    
    for (const order of orders) {
      if (order.shippingAddress) {
        // Check if this is the old format (has 'street' and 'zip' instead of 'address' and 'zipCode')
        const oldFormat = 'street' in order.shippingAddress && 'zip' in order.shippingAddress;
        const missingNewFields = !('name' in order.shippingAddress) || !('email' in order.shippingAddress) || !('phone' in order.shippingAddress);
        
        if (oldFormat || missingNewFields) {
          // Create new shipping address with defaults for missing fields
          const newShippingAddress = {
            name: order.shippingAddress.name || 'Customer Name',
            email: order.shippingAddress.email || 'customer@example.com',
            phone: order.shippingAddress.phone || '+256700000000',
            address: order.shippingAddress.street || order.shippingAddress.address || '',
            city: order.shippingAddress.city || '',
            state: order.shippingAddress.state || '',
            zipCode: order.shippingAddress.zip || order.shippingAddress.zipCode || '',
            country: order.shippingAddress.country || 'Uganda',
          };
          
          // Update the order with the new format
          await ctx.db.patch(order._id, {
            shippingAddress: newShippingAddress,
            updatedAt: Date.now()
          });
          
          migratedCount++;
        }
      }
    }
    
    return {
      message: `Migration completed. ${migratedCount} orders updated.`,
      migratedCount
    };
  },
});

export const migrateSubscriptionsShippingAddress = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all subscriptions
    const subscriptions = await ctx.db.query("subscriptions").collect();
    
    let migratedCount = 0;
    
    for (const subscription of subscriptions) {
      if (subscription.shippingAddress) {
        // Check if this is the old format (missing new fields)
        const missingNewFields = !('name' in subscription.shippingAddress) || 
                                !('email' in subscription.shippingAddress) || 
                                !('phone' in subscription.shippingAddress) ||
                                !('address' in subscription.shippingAddress) ||
                                !('zipCode' in subscription.shippingAddress);
        
        if (missingNewFields) {
          // Create new shipping address with defaults for missing fields
          const newShippingAddress = {
            name: subscription.shippingAddress.name || 'Customer Name',
            email: subscription.shippingAddress.email || 'customer@example.com',
            phone: subscription.shippingAddress.phone || '+256700000000',
            address: subscription.shippingAddress.street || subscription.shippingAddress.address || '',
            city: subscription.shippingAddress.city || '',
            state: subscription.shippingAddress.state || '',
            zipCode: subscription.shippingAddress.zip || subscription.shippingAddress.zipCode || '',
            country: subscription.shippingAddress.country || 'Uganda',
          };
          
          // Update the subscription with the new format
          await ctx.db.patch(subscription._id, {
            shippingAddress: newShippingAddress
          });
          
          migratedCount++;
        }
      }
    }
    
    return {
      message: `Migration completed. ${migratedCount} subscriptions updated.`,
      migratedCount
    };
  },
}); 