'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import MessageBubble from '@/components/MessageBubble';
import ConversationHeader from '@/components/ConversationHeader';
import ConversationListItem from '@/components/ConversationListItem';

const AdminMessagesPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Fetch all messages with user details for admin view
  const messagesWithDetails = useQuery(api.messages.listMessagesWithUserDetails);
  
  // Fetch all users for admin to send messages to
  const allUsers = useQuery(api.users.listUsers);
  
  // Fetch conversation with selected user
  const conversation = useQuery(
    api.messages.getEnhancedConversationBetweenUsers,
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

  const handleMarkAsRead = async (messageId: Id<"messages">) => {
    try {
      await markAsRead({ messageId });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  // Filter users based on search term
  const filteredUsers = allUsers?.filter(u => 
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Group messages by conversation for overview
  const conversationMap = new Map();
  messagesWithDetails?.forEach(msg => {
    const otherUserId = msg.senderId === user._id ? msg.recipientId : msg.senderId;
    const otherUser = msg.senderId === user._id ? msg.recipient : msg.sender;
    const key = otherUserId.toString();
    
    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        otherUser,
        otherUserId,
        lastMessage: msg,
        unreadCount: 0,
        messages: [],
        lastMessageFromCurrentUser: msg.senderId === user._id
      });
    }
    
    const conv = conversationMap.get(key);
    conv.messages.push(msg);
    if (msg.sentAt > conv.lastMessage.sentAt) {
      conv.lastMessage = msg;
      conv.lastMessageFromCurrentUser = msg.senderId === user._id;
    }
    if (msg.recipientId === user._id && !msg.readAt) {
      conv.unreadCount++;
    }
  });

  const conversations = Array.from(conversationMap.values())
    .sort((a, b) => b.lastMessage.sentAt - a.lastMessage.sentAt);

  return (
    <div className="space-y-6">
      <h1 style={{ color: 'var(--primary)' }}>Admin Messages</h1>
      <p className="lead">Manage all user messages and communications.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-8">
        {/* Conversations List */}
        <div className="card">
          <h3 className="mb-4">Conversations</h3>
          
          {/* Search Users */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            
            {searchTerm && (
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
                {filteredUsers.map(u => (
                  <div
                    key={u._id}
                    onClick={() => {
                      setSelectedUserId(u._id);
                      setSearchTerm('');
                    }}
                    className="p-2 hover:bg-gray-50 cursor-pointer border-b"
                  >
                    <div className="font-medium">
                      {u.firstName ? `${u.firstName} ${u.lastName || ''}` : u.email}
                    </div>
                    <div className="text-sm text-gray-600">{u.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Conversations */}
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No conversations yet
              </div>
            ) : (
              conversations.map(conv => (
                <ConversationListItem
                  key={conv.otherUserId}
                  conversation={conv}
                  currentUserId={user._id}
                  isSelected={selectedUserId === conv.otherUserId}
                  onClick={() => setSelectedUserId(conv.otherUserId)}
                  variant="compact"
                />
              ))
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2">
          {selectedUserId && conversation ? (
            <div className="card h-full flex flex-col">
              <ConversationHeader user={conversation.otherUser} variant="compact" />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto max-h-96 space-y-4 mb-4 p-6">
                {conversation.messages.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No messages in this conversation yet
                  </div>
                ) : (
                  conversation.messages.map(msg => (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      currentUserId={user._id}
                      onMarkAsRead={handleMarkAsRead}
                      showSenderInfo={true}
                    />
                  ))
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="border-t pt-4 p-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-96">
              <div className="text-center text-gray-500">
                <div className="text-lg mb-2">💬</div>
                <div>Select a conversation or search for a user to start messaging</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Messages Table */}
      <div className="card mt-8">
        <h3 className="mb-4">Recent Messages</h3>
        {messagesWithDetails === undefined ? (
          <div>Loading messages...</div>
        ) : messagesWithDetails.length === 0 ? (
           <div>No messages found.</div>
         ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Sent</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {messagesWithDetails.slice(0, 20).map(m => (
                  <tr key={m._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {m.sender?.firstName ? `${m.sender.firstName} ${m.sender.lastName || ''}` : m.sender?.email || 'Unknown'}
                        </span>
                        {m.sender?.role && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {m.sender.role}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {m.recipient?.firstName ? `${m.recipient.firstName} ${m.recipient.lastName || ''}` : m.recipient?.email || 'Unknown'}
                        </span>
                        {m.recipient?.role && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {m.recipient.role}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm leading-5 text-gray-900">
                      <div className="max-w-xs truncate">{m.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                      {new Date(m.sentAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        m.readAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {m.readAt ? 'Read' : 'Unread'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage; 