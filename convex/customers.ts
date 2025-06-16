import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCustomer = mutation({
  args: {
    coffeePreferences: v.optional(v.object({
      roastLevel: v.optional(v.string()),
      origin: v.optional(v.array(v.string())),
      flavorProfiles: v.optional(v.array(v.string())),
    })),
    isWholesale: v.optional(v.boolean()),
    isCompany: v.optional(v.boolean()),
    companyName: v.optional(v.string()),
    companyRole: v.optional(v.string()),
    companyAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    })),
    companyPhoneNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user document to get their _id
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) {
       throw new Error("User not found");
    }

    // Insert the new customer document with the user's _id
    const customerId = await ctx.db.insert("customers", {
      userId: user._id, // Use the fetched user's _id
      ...args, // Pass all provided args
    });
    return customerId;
  },
});

export const updateCustomer = mutation({
  args: {
    customerId: v.id("customers"),
    coffeePreferences: v.optional(v.object({
      roastLevel: v.optional(v.string()),
      origin: v.optional(v.array(v.string())),
      flavorProfiles: v.optional(v.array(v.string())),
    })),
    isWholesale: v.optional(v.boolean()),
    isCompany: v.optional(v.boolean()),
    companyName: v.optional(v.string()),
    companyRole: v.optional(v.string()),
    companyAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    })),
    companyPhoneNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { customerId, ...rest } = args;
    await ctx.db.patch(customerId, rest);
  },
});

export const listCustomers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("customers").collect();
  },
});

export const getCustomer = query({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.customerId);
  },
});

export const getCustomerByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("customers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
}); 