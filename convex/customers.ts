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

// New function: Get customers with user details for admin view
export const listCustomersWithUserDetails = query({
  args: {},
  handler: async (ctx) => {
    // Check if the current user is an admin
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error("Not authorized - Admin access required");
    }

    // Get all customers with their associated user information
    const customers = await ctx.db.query("customers").collect();
    
    // For each customer, get the associated user details
    const customersWithDetails = await Promise.all(
      customers.map(async (customer) => {
        const user = await ctx.db.get(customer.userId);
        return {
          ...customer,
          user: user ? {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
          } : null,
        };
      })
    );

    return customersWithDetails;
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

// New function: Get customer with user details by customer ID
export const getCustomerWithUserDetails = query({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      return null;
    }

    const user = await ctx.db.get(customer.userId);
    return {
      ...customer,
      user: user ? {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
      } : null,
    };
  },
}); 

// New function: Get customer statistics for admin dashboard
export const getCustomerStats = query({
  args: {},
  handler: async (ctx) => {
    // Check if the current user is an admin
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error("Not authorized - Admin access required");
    }

    // Get all customers
    const customers = await ctx.db.query("customers").collect();
    
    // Calculate statistics
    const totalCustomers = customers.length;
    const companyCustomers = customers.filter(c => c.isCompany).length;
    const individualCustomers = totalCustomers - companyCustomers;
    const wholesaleCustomers = customers.filter(c => c.isWholesale).length;
    
    // Count customers with coffee preferences
    const customersWithPreferences = customers.filter(c => 
      c.coffeePreferences && (
        c.coffeePreferences.roastLevel || 
        (c.coffeePreferences.origin && c.coffeePreferences.origin.length > 0) ||
        (c.coffeePreferences.flavorProfiles && c.coffeePreferences.flavorProfiles.length > 0)
      )
    ).length;

    return {
      totalCustomers,
      companyCustomers,
      individualCustomers,
      wholesaleCustomers,
      customersWithPreferences,
      customersWithoutPreferences: totalCustomers - customersWithPreferences,
    };
  },
}); 