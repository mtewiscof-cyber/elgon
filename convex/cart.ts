import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addToCart = mutation({
  args: { productId: v.id("products"), quantity: v.optional(v.number()) },
  handler: async ({ db, auth }, { productId, quantity }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const qty = Math.max(1, quantity ?? 1);
    const existing = await db
      .query("cartItems")
      .withIndex("by_user_product", q => q.eq("userId", user._id).eq("productId", productId))
      .unique();
    const now = Date.now();
    if (existing) {
      await db.patch(existing._id, { quantity: existing.quantity + qty, updatedAt: now });
      return existing._id;
    }
    return await db.insert("cartItems", { userId: user._id, productId, quantity: qty, addedAt: now, updatedAt: now });
  },
});

export const updateCartItem = mutation({
  args: { cartItemId: v.id("cartItems"), quantity: v.number() },
  handler: async ({ db, auth }, { cartItemId, quantity }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    if (quantity <= 0) {
      await db.delete(cartItemId);
      return;
    }
    await db.patch(cartItemId, { quantity, updatedAt: Date.now() });
  },
});

export const removeFromCart = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async ({ db, auth }, { cartItemId }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await db.delete(cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");
    const items = await db.query("cartItems").withIndex("by_user", q => q.eq("userId", user._id)).collect();
    for (const item of items) await db.delete(item._id);
  },
});

export const getCart = query({
  args: {},
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) return [];
    const user = await db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    return await db.query("cartItems").withIndex("by_user", q => q.eq("userId", user._id)).collect();
  },
});


