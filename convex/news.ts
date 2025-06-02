import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createNews = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    publishedAt: v.number(),
    author: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    excerpt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newsId = await ctx.db.insert("news", args);
    return newsId;
  },
});

export const updateNews = mutation({
  args: {
    newsId: v.id("news"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    author: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    excerpt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { newsId, ...rest } = args;
    await ctx.db.patch(newsId, rest);
  },
});

export const deleteNews = mutation({
  args: {
    newsId: v.id("news"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.newsId);
  },
});

export const listNews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("news").collect();
  },
});

export const getNews = query({
  args: {
    newsId: v.id("news"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.newsId);
  },
}); 