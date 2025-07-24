import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    role: v.optional(v.string()), // e.g., "customer", "grower", "admin"
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    })),
    phoneNumber: v.optional(v.string()),
  })
  .index("by_clerkId", ["clerkId"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    origin: v.string(),
    tastingNotes: v.array(v.string()),
    certifications: v.array(v.string()),
    price: v.number(), // Price in base units (e.g., cents)
    weight: v.string(), // e.g., "12 oz", "250g"
    imageUrl: v.string(),
    stock: v.number(), // Add stock field
    growerId: v.optional(v.id("growers")), // Add optional link to grower
    featured: v.optional(v.boolean()), // Indicates if the product is featured
    // Link to growers/lots? Could be added later if we track specific lots
  }),

  orders: defineTable({
    userId: v.id("users"), // Link to the user who placed the order
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      priceAtPurchase: v.number(), // Price to lock in the price at the time of order
    })),
    totalAmount: v.number(), // Total amount in base units
    shippingAddress: v.optional(v.object({
      // New format fields
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      zipCode: v.optional(v.string()),
      // Common fields (both formats)
      city: v.string(),
      state: v.string(),
      country: v.string(),
      // Old format fields (for backward compatibility)
      street: v.optional(v.string()),
      zip: v.optional(v.string()),
    })), // Made optional for local orders
    status: v.string(), // e.g., "pending", "processing", "shipped", "delivered", "cancelled"
    paymentStatus: v.string(), // e.g., "paid", "pending", "failed"
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(), // Timestamp
    // Potentially add payment_intent_id or similar for payment gateway integration
  })
  .index("by_user", ["userId"]),

  customers: defineTable({
    userId: v.id("users"), // Link to the user account
    coffeePreferences: v.optional(v.object({
      roastLevel: v.optional(v.string()), // e.g., "light", "medium", "dark"
      origin: v.optional(v.array(v.string())),
      flavorProfiles: v.optional(v.array(v.string())),
    })),
    isWholesale: v.optional(v.boolean()),
    // New fields for company affiliation
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
    // Removed subscriptionStatus here as it will be in the subscriptions table
    // Potentially add customer-specific profile information here later
  })
  .index("by_user", ["userId"]),

  growers: defineTable({
    userId: v.optional(v.id("users")), // Link to the user account if they have one on the platform
    name: v.string(),
    location: v.string(),
    story: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    farmName: v.optional(v.string()),
    farmLocationDetails: v.optional(v.string()),
    coffeeVarieties: v.optional(v.array(v.string())),
    processingMethods: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    elevation: v.optional(v.number()), // Elevation in meters
    // Potentially add details about farming practices, certifications related to the grower, etc.
  })
  .index("by_user", ["userId"]),

  inventory: defineTable({
    productId: v.id("products"), // Link to the product this inventory is for
    growerId: v.optional(v.id("growers")), // Link to the grower who has this inventory
    quantityAvailable: v.number(),
    // Could add details about specific lots here if needed, linking to growers
  })
  .index("by_product", ["productId"])
  .index("by_grower", ["growerId"]),

  blogPosts: defineTable({
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    author: v.string(), // Could link to a users or growers table if authors are users/growers
    date: v.number(), // Timestamp
    category: v.string(),
    imageUrl: v.string(),
    // Potentially add tags or other metadataet
  }),

  subscriptions: defineTable({
    customerId: v.id("customers"), // Link to the customer with the subscription
    productId: v.id("products"), // Link to the subscribed product
    frequency: v.string(), // e.g., "weekly", "bi-weekly", "monthly"
    startDate: v.number(), // Timestamp
    endDate: v.optional(v.number()), // Timestamp for end date if applicable
    status: v.string(), // e.g., "active", "paused", "cancelled"
    shippingAddress: v.object({
      // New format fields
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      zipCode: v.optional(v.string()),
      // Common fields
      city: v.string(),
      state: v.string(),
      country: v.string(),
      // Old format fields for backward compatibility
      street: v.optional(v.string()),
      zip: v.optional(v.string()),
    }),
    // Potentially add next billing date, payment method details reference, etc.
  })
  .index("by_customer", ["customerId"])
  .index("by_product", ["productId"]), // Index to find subscriptions for a specific product

  news: defineTable({
    title: v.string(),
    content: v.string(),
    publishedAt: v.number(), // Timestamp
    author: v.optional(v.string()), // Could link to a users/admin table
    imageUrl: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    // Potentially add tags or categories for news
  }),

  messages: defineTable({
    senderId: v.id("users"), // Link to the user sending the message
    recipientId: v.id("users"), // Link to the user receiving the message (can be admin, grower, or customer)
    content: v.string(),
    sentAt: v.number(), // Timestamp
    readAt: v.optional(v.number()), // Timestamp when the message was read
    // Potentially add a conversationId or subject to group messages
  })
  .index("by_sender", ["senderId"])
  .index("by_recipient", ["recipientId"]),

  // Potentially add a table for shipments later if more detailed tracking is needed
  // shipments: defineTable({
  //   orderId: v.id("orders"),
  //   trackingNumber: v.string(),
  //   carrier: v.string(),
  //   status: v.string(), // e.g., "in_transit", "delivered"
  //   shippedAt: v.number(), // Timestamp
  // })
  // .index("by_order", ["orderId"]),
}); 