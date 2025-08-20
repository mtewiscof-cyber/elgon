import React from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { getRoleStyling, formatTimestamp, getMessageStatus } from '@/lib/messageUtils';

interface MessageBubbleProps {
  message: {
    _id: Id<"messages">;
    content: string;
    sentAt: number;
    readAt?: number;
    senderId: Id<"users">;
    recipientId: Id<"users">;
    isFromCurrentUser?: boolean;
    senderName?: string;
    senderRole?: string;
    recipientName?: string;
    recipientRole?: string;
  };
  currentUserId: Id<"users">;
  onMarkAsRead?: (messageId: Id<"messages">) => void;
  showSenderInfo?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  onMarkAsRead,
  showSenderInfo = false
}) => {
  const isFromCurrentUser = message.isFromCurrentUser ?? message.senderId === currentUserId;
  const isRead = !!message.readAt;
  
  // Get role-based styling
  const senderRoleStyling = getRoleStyling(message.senderRole);
  
  const getBubbleColor = () => {
    if (isFromCurrentUser) {
      return senderRoleStyling.bgColor;
    }
    return 'bg-gray-100 text-gray-900 border border-gray-200';
  };

  const getMetaTextColor = () => {
    if (isFromCurrentUser) {
      return 'text-blue-200';
    }
    return 'text-gray-500';
  };

  // Get message status
  const messageStatus = getMessageStatus(isRead, isFromCurrentUser);

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${getBubbleColor()}`}>
        {/* Sender info for non-current user messages */}
        {!isFromCurrentUser && showSenderInfo && message.senderName && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium opacity-80">
              {message.senderName}
            </span>
            {message.senderRole && (
              <span className="text-xs opacity-70">
                {senderRoleStyling.icon} {senderRoleStyling.label}
              </span>
            )}
          </div>
        )}
        
        {/* Message content */}
        <div className="break-words">{message.content}</div>
        
        {/* Message metadata */}
        <div className={`text-xs mt-2 flex items-center justify-between ${getMetaTextColor()}`}>
          <span>
            {formatTimestamp(message.sentAt, 'short')}
          </span>
          
          <div className="flex items-center gap-2">
            {/* Mark as read button for received messages */}
            {!isFromCurrentUser && !isRead && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(message._id)}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Mark read
              </button>
            )}
            
            {/* Read status indicator */}
            {messageStatus && (
              <span className={`ml-2 ${messageStatus.className}`}>
                {messageStatus.text}
              </span>
            )}
            
            {/* Role indicator for current user */}
            {isFromCurrentUser && message.senderRole && (
              <span className="text-xs opacity-70">
                {senderRoleStyling.icon}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
