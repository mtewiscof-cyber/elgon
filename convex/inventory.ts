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

// Enhanced inventory query with product and grower details
export const getInventoryWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const inventory = await ctx.db.query("inventory").collect();
    
    // Fetch related products and growers
    const inventoryWithDetails = await Promise.all(
      inventory.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        const grower = item.growerId ? await ctx.db.get(item.growerId) : null;
        
        return {
          ...item,
          product,
          grower,
          lowStock: item.quantityAvailable <= 10, // Flag for low stock
          outOfStock: item.quantityAvailable === 0,
        };
      })
    );
    
    return inventoryWithDetails;
  },
});

// Reduce inventory when order is approved
export const reduceInventoryForOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // Get the order
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Process each item in the order
    for (const item of order.items) {
      // First try to reduce from inventory table
      const inventoryItems = await ctx.db.query("inventory")
        .withIndex("by_product", (q) => q.eq("productId", item.productId))
        .collect();
      
      let remainingQuantity = item.quantity;
      
      // Reduce from inventory items first
      for (const invItem of inventoryItems) {
        if (remainingQuantity <= 0) break;
        
        const reductionAmount = Math.min(remainingQuantity, invItem.quantityAvailable);
        
        if (reductionAmount > 0) {
          await ctx.db.patch(invItem._id, {
            quantityAvailable: invItem.quantityAvailable - reductionAmount
          });
          remainingQuantity -= reductionAmount;
        }
      }
      
      // Also reduce from product stock
      const product = await ctx.db.get(item.productId);
      if (product && product.stock >= item.quantity) {
        await ctx.db.patch(item.productId, {
          stock: product.stock - item.quantity
        });
      }
    }
  },
});

// Check if sufficient inventory exists for an order
export const checkInventoryAvailability = query({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const availability = await Promise.all(
      args.items.map(async (item) => {
        // Check inventory table
        const inventoryItems = await ctx.db.query("inventory")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .collect();
        
        const totalInventory = inventoryItems.reduce((sum, inv) => sum + inv.quantityAvailable, 0);
        
        // Also check product stock
        const product = await ctx.db.get(item.productId);
        const productStock = product?.stock || 0;
        
        // Use the higher of the two values
        const availableStock = Math.max(totalInventory, productStock);
        
        return {
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableStock,
          sufficient: availableStock >= item.quantity,
          product,
        };
      })
    );
    
    return {
      items: availability,
      allSufficient: availability.every(item => item.sufficient),
    };
  },
});

// Sync inventory with product stock
export const syncInventoryWithProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    
    for (const product of products) {
      // Check if inventory exists for this product
      const existingInventory = await ctx.db.query("inventory")
        .withIndex("by_product", (q) => q.eq("productId", product._id))
        .first();
      
      if (!existingInventory && product.stock > 0) {
        // Create inventory entry if it doesn't exist
        await ctx.db.insert("inventory", {
          productId: product._id,
          quantityAvailable: product.stock,
        });
      } else if (existingInventory) {
        // Update inventory to match product stock if higher
        const newQuantity = Math.max(existingInventory.quantityAvailable, product.stock);
        await ctx.db.patch(existingInventory._id, {
          quantityAvailable: newQuantity,
        });
      }
    }
  },
}); 