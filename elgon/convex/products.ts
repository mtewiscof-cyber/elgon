import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    origin: v.string(),
    tastingNotes: v.array(v.string()),
    certifications: v.array(v.string()),
    price: v.number(),
    weight: v.string(),
    imageUrl: v.string(),
    stock: v.number(),
    growerId: v.optional(v.id("growers")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const productId = await ctx.db.insert("products", args);
    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    origin: v.optional(v.string()),
    tastingNotes: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    price: v.optional(v.number()),
    weight: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    stock: v.optional(v.number()),
    growerId: v.optional(v.id("growers")),
    featured: v.optional(v.boolean()),
    },
  handler: async (ctx, args) => {
    const { productId, ...rest } = args;
    await ctx.db.patch(productId, rest);
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
  },
});

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getProductById = query({
  args: {
    productId: v.id("products")
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    return product;
  }
});

// New function to get featured products
export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  }
});