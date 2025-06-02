import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    recipientId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
    readAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", args);
    return messageId;
  },
});

export const markMessageAsRead = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Only the recipient can mark a message as read
    if (message.recipientId !== user._id) {
      throw new Error("Not authorized to mark this message as read");
    }

    await ctx.db.patch(args.messageId, {
      readAt: Date.now(),
    });
  },
});

export const listMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const listMessagesWithUserDetails = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    // Only admins can view all messages
    if (user.role !== 'admin') {
      throw new Error("Not authorized");
    }

    const messages = await ctx.db.query("messages").collect();
    
    // Sort messages by sentAt in descending order (newest first)
    messages.sort((a, b) => b.sentAt - a.sentAt);
    
    // Fetch sender and recipient user documents for each message
    const messagesWithDetails = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        const recipient = await ctx.db.get(msg.recipientId);
        return { ...msg, sender, recipient };
      })
    );
    return messagesWithDetails;
  },
});

export const listMessagesForUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Find the user in the 'users' table to get their Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    // List messages where the user is either the sender or the recipient
    return await ctx.db.query("messages")
      .filter((q) =>
        q.or(
          q.eq(q.field("senderId"), user._id),
          q.eq(q.field("recipientId"), user._id)
        )
      )
      .collect();
  },
});

export const getConversationBetweenUsers = query({
  args: {
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    // Get messages between the current user and the other user
    const messages = await ctx.db.query("messages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("senderId"), user._id),
            q.eq(q.field("recipientId"), args.otherUserId)
          ),
          q.and(
            q.eq(q.field("senderId"), args.otherUserId),
            q.eq(q.field("recipientId"), user._id)
          )
        )
      )
      .collect();

    // Sort messages by sentAt in ascending order (oldest first for conversation view)
    messages.sort((a, b) => a.sentAt - b.sentAt);

    // Get the other user's details
    const otherUser = await ctx.db.get(args.otherUserId);
    
    return {
      messages,
      otherUser,
      currentUser: user,
    };
  },
});

export const getUserConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    // Get all messages for the user
    const messages = await ctx.db.query("messages")
      .filter((q) =>
        q.or(
          q.eq(q.field("senderId"), user._id),
          q.eq(q.field("recipientId"), user._id)
        )
      )
      .collect();

    // Group messages by conversation (other user)
    const conversationMap = new Map();
    
    for (const message of messages) {
      const otherUserId = message.senderId === user._id ? message.recipientId : message.senderId;
      const otherUserIdStr = otherUserId.toString();
      
      if (!conversationMap.has(otherUserIdStr)) {
        conversationMap.set(otherUserIdStr, {
          otherUserId,
          messages: [],
          lastMessage: message,
          unreadCount: 0,
        });
      }
      
      const conversation = conversationMap.get(otherUserIdStr);
      conversation.messages.push(message);
      
      // Update last message if this message is newer
      if (message.sentAt > conversation.lastMessage.sentAt) {
        conversation.lastMessage = message;
      }
      
      // Count unread messages (messages sent to the current user that haven't been read)
      if (message.recipientId === user._id && !message.readAt) {
        conversation.unreadCount++;
      }
    }

    // Convert to array and fetch other user details
    const conversations = await Promise.all(
      Array.from(conversationMap.values()).map(async (conv) => {
        const otherUser = await ctx.db.get(conv.otherUserId);
        return {
          ...conv,
          otherUser,
        };
      })
    );

    // Sort conversations by last message time (newest first)
    conversations.sort((a, b) => b.lastMessage.sentAt - a.lastMessage.sentAt);

    return conversations;
  },
});

export const listMessagesWithUserDetailsForUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Find the user in the 'users' table to get their Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    // List messages where the user is either the sender or the recipient
    // And join with user table to get sender and recipient details
    const messages = await ctx.db.query("messages")
      .filter((q) =>
        q.or(
          q.eq(q.field("senderId"), user._id),
          q.eq(q.field("recipientId"), user._id)
        )
      )
      .collect(); // Remove the order() call altogether since it's causing errors
    
    // Sort messages by sentAt in JavaScript instead
    messages.sort((a, b) => a.sentAt - b.sentAt);
    
    // Fetch sender and recipient user documents for each message
    const messagesWithDetails = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        const recipient = await ctx.db.get(msg.recipientId);
        // Return message with sender and recipient objects included
        return { ...msg, sender, recipient };
      })
    );
    return messagesWithDetails;
  }
});

// Potentially add queries to list messages by sender, recipient, or conversation later 