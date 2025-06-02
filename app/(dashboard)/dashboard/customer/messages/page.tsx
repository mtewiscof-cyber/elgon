'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';

const CustomerMessagesPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [newAdminMessage, setNewAdminMessage] = useState('');

  // Fetch the user document from Convex to get the role and user ID
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Fetch all users to find admins
  const allUsers = useQuery(api.users.listUsers);

  // Redirect if user data is loaded and user is not authenticated or not a customer
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'customer') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Fetch user conversations
  const conversations = useQuery(api.messages.getUserConversations);
  
  // Fetch specific conversation when user is selected
  const conversation = useQuery(
    api.messages.getConversationBetweenUsers,
    selectedUserId ? { otherUserId: selectedUserId } : 'skip'
  );

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessageAsRead);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUserId || !newMessage.trim()) return;

    try {
      await sendMessage({
        senderId: user._id,
        recipientId: selectedUserId,
        content: newMessage,
        sentAt: Date.now()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleContactAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAdminMessage.trim() || !allUsers) return;

    const admin = allUsers.find(u => u.role === 'admin');
    if (!admin) {
      alert('No administrator found. Please try again later.');
      return;
    }

    try {
      await sendMessage({
        senderId: user._id,
        recipientId: admin._id,
        content: newAdminMessage,
        sentAt: Date.now()
      });
      setNewAdminMessage('');
      setShowContactAdmin(false);
      setSelectedUserId(admin._id);
      alert('Message sent to administrator successfully!');
    } catch (error) {
      console.error('Failed to send message to admin:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleMarkAsRead = async (messageId: Id<"messages">) => {
    try {
      await markAsRead({ messageId });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  // Show a loading state while data is loading or if not authenticated/authorized
  if (!clerkLoaded || !isUserLoaded || !clerkUser || user?.role !== 'customer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Messages...</h2>
          <p className="text-gray-500">Accessing your messaging dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Messages</h1>
          <p className="text-gray-600">Connect with coffee growers and administrators</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowContactAdmin(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Contact Administrator
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              💡 Tip: Message growers about their coffee products or contact admins for platform support
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
              <p className="text-sm text-gray-500 mt-1">
                {conversations?.length || 0} active conversation{(conversations?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="p-6">
              {conversations === undefined ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-gray-500 text-center py-12">
                  <div className="text-4xl mb-4">💬</div>
                  <div className="text-lg font-medium mb-2">No conversations yet</div>
                  <div className="text-sm">
                    Start a conversation by messaging a grower from a product page<br />
                    or contact an administrator for support
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.map(conv => (
                    <div
                      key={conv.otherUserId}
                      onClick={() => setSelectedUserId(conv.otherUserId)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedUserId === conv.otherUserId 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium text-gray-900 truncate">
                              {conv.otherUser?.firstName ? 
                                `${conv.otherUser.firstName} ${conv.otherUser.lastName || ''}` : 
                                conv.otherUser?.email || 'Unknown User'
                              }
                            </div>
                            <span className="text-xs">
                              {conv.otherUser?.role === 'admin' && '👑'}
                              {conv.otherUser?.role === 'grower' && '🌱'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {conv.otherUser?.role === 'admin' && 'Administrator'}
                            {conv.otherUser?.role === 'grower' && 'Coffee Grower'}
                            {conv.otherUser?.role === 'customer' && 'Customer'}
                            {!conv.otherUser?.role && 'User'}
                          </div>
                          <div className="text-sm text-gray-600 truncate mb-1">
                            {conv.lastMessage.content}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(conv.lastMessage.sentAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-3 min-w-[1.5rem] text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div className="lg:col-span-2">
            {selectedUserId && conversation ? (
              <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {conversation.otherUser?.firstName ? 
                          `${conversation.otherUser.firstName} ${conversation.otherUser.lastName || ''}` : 
                          conversation.otherUser?.email || 'Unknown User'
                        }
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversation.otherUser?.role === 'admin' && '👑 Administrator - Platform support and assistance'}
                        {conversation.otherUser?.role === 'grower' && '🌱 Coffee Grower - Ask about their coffee and farm'}
                        {conversation.otherUser?.role === 'customer' && '☕ Fellow Coffee Enthusiast'}
                        {!conversation.otherUser?.role && 'User'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '60vh' }}>
                  {conversation.messages.length === 0 ? (
                    <div className="text-gray-500 text-center py-12">
                      <div className="text-4xl mb-4">💬</div>
                      <div className="text-lg font-medium mb-2">Start the conversation</div>
                      <p className="text-sm">Send your first message below</p>
                    </div>
                  ) : (
                    conversation.messages.map(msg => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            msg.senderId === user._id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <div className="break-words">{msg.content}</div>
                          <div className={`text-xs mt-2 flex items-center justify-between ${
                            msg.senderId === user._id ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <span>
                              {new Date(msg.sentAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                            {msg.senderId !== user._id && !msg.readAt && (
                              <button
                                onClick={() => handleMarkAsRead(msg._id)}
                                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Mark read
                              </button>
                            )}
                            {msg.senderId === user._id && msg.readAt && (
                              <span className="ml-2 text-blue-300">✓ Read</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Send Message Form */}
                <div className="p-6 border-t border-gray-200">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newMessage.trim()}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-12">
                  <div className="text-6xl mb-4">💬</div>
                  <div className="text-xl font-medium mb-2">Select a conversation</div>
                  <p className="text-gray-400 max-w-md">
                    Choose a conversation from the left to start messaging with growers or administrators
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-8 mt-8 border border-blue-100">
          <h3 className="text-blue-800 text-xl font-semibold mb-6 flex items-center gap-2">
            ☕ How to Get the Most from Your Coffee Conversations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🌱</span> Connecting with Growers
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Ask about their farming practices</li>
                <li>• Learn about coffee processing methods</li>
                <li>• Request brewing recommendations</li>
                <li>• Inquire about seasonal availability</li>
              </ul>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">📦</span> Product Questions
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Ask about tasting notes and flavors</li>
                <li>• Inquire about roast levels available</li>
                <li>• Check shipping and delivery options</li>
                <li>• Learn about bulk order discounts</li>
              </ul>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">👑</span> Administrator Support
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Get help with account issues</li>
                <li>• Report technical problems</li>
                <li>• Ask about platform features</li>
                <li>• Request assistance with orders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Admin Modal */}
      {showContactAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contact Administrator</h3>
                <button
                  onClick={() => setShowContactAdmin(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleContactAdmin} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your message to the administrator:
                </label>
                <textarea
                  value={newAdminMessage}
                  onChange={(e) => setNewAdminMessage(e.target.value)}
                  placeholder="Hello! I need help with..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactAdmin(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newAdminMessage.trim()}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMessagesPage; 