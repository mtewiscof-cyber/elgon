import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createGrower = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    story: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    farmName: v.optional(v.string()),
    farmLocationDetails: v.optional(v.string()),
    coffeeVarieties: v.optional(v.array(v.string())),
    processingMethods: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    elevation: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const growerId = await ctx.db.insert("growers", {
      userId: user._id,
      ...args,
    });
    return growerId;
  },
});

export const updateGrower = mutation({
  args: {
    growerId: v.id("growers"),
    userId: v.optional(v.id("users")),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    story: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    farmName: v.optional(v.string()),
    farmLocationDetails: v.optional(v.string()),
    coffeeVarieties: v.optional(v.array(v.string())),
    processingMethods: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    elevation: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { growerId, ...rest } = args;
    await ctx.db.patch(growerId, rest);
  },
});

export const listGrowers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("growers").collect();
  },
});

export const getGrower = query({
  args: {
    growerId: v.id("growers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.growerId);
  },
});

export const getGrowerByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("growers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
}); 