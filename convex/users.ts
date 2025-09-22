import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (user) {
      // If the user exists, return their ID
      return user._id;
    }

    // If the user doesn't exist, create a new one
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      firstName: typeof identity.firstName === "string" ? identity.firstName : undefined,
      lastName: typeof identity.lastName === "string" ? identity.lastName : undefined,
      imageUrl: typeof identity.imageUrl === "string" ? identity.imageUrl : undefined,      
      role: 'customer',
    });

    return userId;
  },
});

// Get the currently authenticated user by their tokenIdentifier
export const getUserByUserId = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null; // User is not authenticated
    }

    // Find the user by their tokenIdentifier (which includes the Clerk user ID)
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    return user; // Returns the user document or null if not found
  },
});

// Get all users (Admin only)
export const listUsers = query({
  handler: async (ctx) => {
    // Add authorization check here if needed (e.g., only admin can list users)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== 'admin') {
       throw new Error("Not authorized");
    }

    return await ctx.db.query("users").collect();
  },
});

// Update user profile fields
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        country: v.string(),
      })
    ),
    phoneNumber: v.optional(v.string()),
  },
  handler: async ({ db, auth }, args) => {
    // Ensure the user is authenticated and is updating their own profile
    const identity = await auth.getUserIdentity();
    const user = await db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity?.subject))
      .first();

    if (!identity || !user || user._id !== args.id) {
      throw new Error("Not authorized to update this user.");
    }

    const { id, ...updates } = args;
    await db.patch(id, updates);
  },
});

// Delete a user
export const deleteUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async ({ db, auth }, { id }) => {
    // Ensure the user is authenticated and is deleting their own profile (or is admin)
    const identity = await auth.getUserIdentity();
    const user = await db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity?.subject))
      .first();

    // Basic check: User must be authenticated and trying to delete their own profile
    // More robust admin check could be added here
    if (!identity || !user || user._id !== id) {
      throw new Error("Not authorized to delete this user.");
    }

    await db.delete(id);
  },
});

// Change a user's role
export const changeUserRole = mutation({
  args: {
    id: v.id("users"),
    role: v.string(),
  },
  handler: async ({ db, auth }, { id, role }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user who is making the request
    const currentUser = await db
      .query("users")
        .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("Current user not found.");
    }

    // Get the user whose role is being changed
    const userToUpdate = await db.get(id);

    if (!userToUpdate) {
      throw new Error("User to update not found.");
    }

    // Authorization Logic:
    // 1. Admins can change any user's role.
    // 2. Non-admins can only change their own role, and only from an initial state (undefined or 'user')
    //    to 'customer' or 'grower'.

    const isAdmin = currentUser.role === 'admin';
    const isUpdatingSelf = currentUser._id.toString() === id.toString();
    const isInitialRole = userToUpdate.role === undefined || userToUpdate.role === 'user';
    const isValidOnboardingRole = role === 'customer' || role === 'grower';

    if (!isAdmin) {
      // Non-admin checks
      if (!isUpdatingSelf) {
        throw new Error("Not authorized to change this user's role.");
      }
      if (!isInitialRole) {
        throw new Error("Cannot change role from current state.");
      }
      if (!isValidOnboardingRole) {
        throw new Error("Can only set role to 'customer' or 'grower' during onboarding.");
      }
    }

    // If authorized, patch the user's role
    await db.patch(id, { role });
  },
});

// List all admins (accessible to any authenticated user)
export const listAdmins = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Return only users with admin role
    return await ctx.db.query("users").filter(q => q.eq(q.field("role"), "admin")).collect();
  },
});

// List all growers (accessible to any authenticated user)
export const listGrowers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Return only users with grower role
    return await ctx.db.query("users").filter(q => q.eq(q.field("role"), "grower")).collect();
  },
});

// List all growers and admins (accessible to any authenticated user)
export const listGrowersAndAdmins = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Return users with role 'grower' or 'admin'
    return await ctx.db.query("users").filter(q =>
      q.or(
        q.eq(q.field("role"), "grower"),
        q.eq(q.field("role"), "admin")
      )
    ).collect();
  },
}); 