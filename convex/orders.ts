import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      priceAtPurchase: v.number(),
    })),
    totalAmount: v.number(),
    shippingAddress: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      zipCode: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      country: v.string(),
      street: v.optional(v.string()),
      zip: v.optional(v.string()),
    }),
    status: v.string(),
    paymentStatus: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user in the 'users' table to get their ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check inventory availability before creating order
    for (const item of args.items) {
      // Check inventory table
      const inventoryItems = await ctx.db.query("inventory")
        .withIndex("by_product", (q) => q.eq("productId", item.productId))
        .collect();
      
      const totalInventory = inventoryItems.reduce((sum, inv) => sum + inv.quantityAvailable, 0);
      
      // Also check product stock
      const product = await ctx.db.get(item.productId);
      const productStock = product?.stock || 0;
      
      // Use the higher of the two values
      const availableStock = Math.max(totalInventory, productStock);
      
      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name || 'product'}. Available: ${availableStock}, Requested: ${item.quantity}`);
      }
    }

    const orderId = await ctx.db.insert("orders", {
      userId: user._id,
      ...args,
    });
    return orderId;
  },
});

export const updateOrder = mutation({
  args: {
    orderId: v.id("orders"),
    items: v.optional(v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      priceAtPurchase: v.number(),
    }))),
    totalAmount: v.optional(v.number()),
    shippingAddress: v.optional(v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      zipCode: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      country: v.string(),
      street: v.optional(v.string()),
      zip: v.optional(v.string()),
    })),
    status: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { orderId, ...rest } = args;
    await ctx.db.patch(orderId, rest);
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user in the 'users' table to check their role
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Only allow admins to update order status
    if (user.role !== "admin") {
      throw new Error("Only administrators can update order status");
    }

    // Get the current order to check previous status
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // If order is being approved/confirmed for the first time, reduce inventory
    if ((args.status === "processing" || args.status === "confirmed" || args.status === "shipped") && 
        (order.status === "pending" || order.status === "payment_pending")) {
      
      // Reduce inventory for each item in the order
      for (const item of order.items) {
        // First try to reduce from inventory table
        const inventoryItems = await ctx.db.query("inventory")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .collect();
        
        let remainingQuantity = item.quantity;
        
        // Reduce from inventory items first
        for (const invItem of inventoryItems) {
          if (remainingQuantity <= 0) break;
          
          const reductionAmount = Math.min(remainingQuantity, invItem.quantityAvailable);
          
          if (reductionAmount > 0) {
            await ctx.db.patch(invItem._id, {
              quantityAvailable: invItem.quantityAvailable - reductionAmount
            });
            remainingQuantity -= reductionAmount;
          }
        }
        
        // Also reduce from product stock
        const product = await ctx.db.get(item.productId);
        if (product && product.stock >= item.quantity) {
          await ctx.db.patch(item.productId, {
            stock: product.stock - item.quantity
          });
        }
      }
    }

    // Update the order status
    await ctx.db.patch(args.orderId, { 
      status: args.status,
      updatedAt: Date.now()
    });
  },
});

export const listOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

export const getOrder = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const listOrdersByUserId = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Find the user in the 'users' table to get their Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    // List orders for the authenticated user
    return await ctx.db.query("orders")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
}); 