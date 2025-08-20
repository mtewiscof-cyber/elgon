import React from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { formatDisplayName, getRoleStyling, formatTimestamp, truncateText } from '@/lib/messageUtils';

interface ConversationListItemProps {
  conversation: {
    otherUserId: Id<"users">;
    otherUser?: {
      _id: string;
      firstName?: string;
      lastName?: string;
      email: string;
      role?: string;
      imageUrl?: string;
    };
    lastMessage: {
      _id: Id<"messages">;
      content: string;
      sentAt: number;
      senderId: Id<"users">;
    };
    unreadCount: number;
    lastMessageFromCurrentUser: boolean;
  };
  currentUserId: Id<"users">;
  isSelected: boolean;
  onClick: () => void;
  variant?: 'default' | 'compact';
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  currentUserId,
  isSelected,
  onClick,
  variant = 'default'
}) => {
  const roleStyling = getRoleStyling(conversation.otherUser?.role);
  
  const getSelectionStyles = () => {
    if (isSelected) {
      return 'bg-blue-50 border-blue-200 shadow-sm';
    }
    return 'hover:bg-gray-50 border-gray-200 hover:border-gray-300';
  };

  const displayName = formatDisplayName(conversation.otherUser);
  const messagePreview = truncateText(conversation.lastMessage.content, 50);
  const messageSender = conversation.lastMessageFromCurrentUser ? 'You' : displayName;

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${getSelectionStyles()}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-medium text-gray-900 truncate">
                {displayName}
              </div>
              {conversation.otherUser?.role && (
                <span className="text-xs">
                  {roleStyling.icon}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              {conversation.otherUser?.role && roleStyling.label}
            </div>
            <div className="text-sm text-gray-600 truncate mb-1">
              <span className="font-medium">{messageSender}:</span> {messagePreview}
            </div>
            <div className="text-xs text-gray-400">
              {formatTimestamp(conversation.lastMessage.sentAt, 'short')}
            </div>
          </div>
          {conversation.unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-3 min-w-[1.5rem] text-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${getSelectionStyles()}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-medium text-gray-900 truncate">
              {displayName}
            </div>
            {conversation.otherUser?.role && (
              <span className="text-xs">
                {roleStyling.icon}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {conversation.otherUser?.role && roleStyling.label}
          </div>
          <div className="text-sm text-gray-600 truncate mb-1">
            <span className="font-medium">{messageSender}:</span> {messagePreview}
          </div>
          <div className="text-xs text-gray-400">
            {formatTimestamp(conversation.lastMessage.sentAt, 'short')}
          </div>
        </div>
        {conversation.unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-3 min-w-[1.5rem] text-center">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConversationListItem;
