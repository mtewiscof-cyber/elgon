import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSubscription = mutation({
  args: {
    customerId: v.id("customers"),
    productId: v.id("products"),
    frequency: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    status: v.string(),
    shippingAddress: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Get the current user identity for authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user to check authorization
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get customer to verify ownership
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Only allow customers to create their own subscriptions or admins
    if (user.role !== "admin" && customer.userId !== user._id) {
      throw new Error("Not authorized to create subscription for this customer");
    }

    const subscriptionId = await ctx.db.insert("subscriptions", args);
    return subscriptionId;
  },
});

export const updateSubscription = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    frequency: v.optional(v.string()),
    endDate: v.optional(v.number()),
    status: v.optional(v.string()),
    shippingAddress: v.optional(v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    // Get the current user identity for authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get subscription to verify ownership
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const customer = await ctx.db.get(subscription.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Only allow customers to update their own subscriptions or admins
    if (user.role !== "admin" && customer.userId !== user._id) {
      throw new Error("Not authorized to update this subscription");
    }

    const { subscriptionId, ...rest } = args;
    await ctx.db.patch(subscriptionId, rest);
  },
});

export const cancelSubscription = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    // Get the current user identity for authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get subscription to verify ownership
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const customer = await ctx.db.get(subscription.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Only allow customers to cancel their own subscriptions or admins
    if (user.role !== "admin" && customer.userId !== user._id) {
      throw new Error("Not authorized to cancel this subscription");
    }

    await ctx.db.patch(args.subscriptionId, { 
      status: "cancelled",
      endDate: Date.now()
    });
  },
});

export const pauseSubscription = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    // Get the current user identity for authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get subscription to verify ownership
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const customer = await ctx.db.get(subscription.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Only allow customers to pause their own subscriptions or admins
    if (user.role !== "admin" && customer.userId !== user._id) {
      throw new Error("Not authorized to pause this subscription");
    }

    await ctx.db.patch(args.subscriptionId, { status: "paused" });
  },
});

export const resumeSubscription = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    // Get the current user identity for authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get subscription to verify ownership
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const customer = await ctx.db.get(subscription.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Only allow customers to resume their own subscriptions or admins
    if (user.role !== "admin" && customer.userId !== user._id) {
      throw new Error("Not authorized to resume this subscription");
    }

    await ctx.db.patch(args.subscriptionId, { status: "active" });
  },
});

export const listSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subscriptions").collect();
  },
});

export const getSubscription = query({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.subscriptionId);
  },
});

export const listSubscriptionsByCustomer = query({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("subscriptions")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .collect();
  },
});

export const getSubscriptionsWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const subscriptions = await ctx.db.query("subscriptions").collect();
    
    // Get all products and customers for detailed display
    const products = await ctx.db.query("products").collect();
    const customers = await ctx.db.query("customers").collect();
    const users = await ctx.db.query("users").collect();
    
    // Create maps for quick lookup
    const productsMap = new Map(products.map(p => [p._id, p]));
    const customersMap = new Map(customers.map(c => [c._id, c]));
    const usersMap = new Map(users.map(u => [u._id, u]));
    
    return subscriptions.map(subscription => {
      const product = productsMap.get(subscription.productId);
      const customer = customersMap.get(subscription.customerId);
      const user = customer ? usersMap.get(customer.userId) : null;
      
      return {
        ...subscription,
        product,
        customer,
        user
      };
    });
  },
}); 