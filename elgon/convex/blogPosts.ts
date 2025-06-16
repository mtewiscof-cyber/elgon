import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createBlogPost = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    author: v.string(),
    date: v.number(),
    category: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const blogPostId = await ctx.db.insert("blogPosts", args);
    return blogPostId;
  },
});

export const updateBlogPost = mutation({
  args: {
    blogPostId: v.id("blogPosts"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    date: v.optional(v.number()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { blogPostId, ...rest } = args;
    await ctx.db.patch(blogPostId, rest);
  },
});

export const deleteBlogPost = mutation({
  args: {
    blogPostId: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.blogPostId);
  },
});

export const listBlogPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogPosts").collect();
  },
});

export const getBlogPost = query({
  args: {
    blogPostId: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.blogPostId);
  },
});

// Potentially add a query to list blog posts by category or author later 