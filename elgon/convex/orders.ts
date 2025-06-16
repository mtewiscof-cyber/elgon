import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createOrder = mutation({
  args: {
    userId: v.id("users"),
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
    const orderId = await ctx.db.insert("orders", args);
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