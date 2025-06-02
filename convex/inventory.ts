import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createInventory = mutation({
  args: {
    productId: v.id("products"),
    growerId: v.optional(v.id("growers")),
    quantityAvailable: v.number(),
  },
  handler: async (ctx, args) => {
    const inventoryId = await ctx.db.insert("inventory", args);
    return inventoryId;
  },
});

export const updateInventory = mutation({
  args: {
    inventoryId: v.id("inventory"),
    productId: v.optional(v.id("products")),
    growerId: v.optional(v.id("growers")),
    quantityAvailable: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { inventoryId, ...rest } = args;
    await ctx.db.patch(inventoryId, rest);
  },
});

export const deleteInventory = mutation({
  args: {
    inventoryId: v.id("inventory"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.inventoryId);
  },
});

export const listInventory = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("inventory").collect();
  },
});

export const getInventoryByProduct = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("inventory")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

export const getInventoryByGrower = query({
  args: {
    growerId: v.id("growers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("inventory")
      .withIndex("by_grower", (q) => q.eq("growerId", args.growerId))
      .collect();
  },
}); 