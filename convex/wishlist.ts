import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggleWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async ({ db, auth }, { productId }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await db
      .query("wishlistItems")
      .withIndex("by_user_product", q => q.eq("userId", user._id).eq("productId", productId))
      .unique();
    if (existing) {
      await db.delete(existing._id);
      return { wished: false };
    }
    await db.insert("wishlistItems", { userId: user._id, productId, addedAt: Date.now() });
    return { wished: true };
  },
});

export const getWishlist = query({
  args: {},
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) return [];
    const user = await db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    return await db
      .query("wishlistItems")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
  },
});


