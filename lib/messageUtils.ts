/**
 * Utility functions for message handling and user display
 */

export interface UserInfo {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  imageUrl?: string;
}

/**
 * Formats a user's display name
 * @param user - User object with name information
 * @param fallback - Fallback text if no name is available
 * @returns Formatted display name
 */
export const formatDisplayName = (user: UserInfo, fallback: string = 'Unknown User'): string => {
  if (user.firstName) {
    const fullName = `${user.firstName} ${user.lastName || ''}`.trim();
    return fullName || user.email;
  }
  return user.email || fallback;
};

/**
 * Gets role-based styling for different user types
 * @param role - User role
 * @returns Object with color and icon information
 */
export const getRoleStyling = (role?: string) => {
  switch (role) {
    case 'admin':
      return {
        color: 'text-purple-600',
        bgColor: 'bg-purple-600',
        icon: '👑',
        label: 'Administrator',
        description: 'Platform support and assistance'
      };
    case 'grower':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-600',
        icon: '🌱',
        label: 'Coffee Grower',
        description: 'Ask about their coffee and farm'
      };
    case 'customer':
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-600',
        icon: '☕',
        label: 'Customer',
        description: 'Fellow Coffee Enthusiast'
      };
    default:
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-600',
        icon: '👤',
        label: 'User',
        description: 'User'
      };
  }
};

/**
 * Formats timestamp for display
 * @param timestamp - Unix timestamp
 * @param format - Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export const formatTimestamp = (
  timestamp: number, 
  format: 'short' | 'long' | 'relative' = 'short'
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (format === 'relative') {
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  }

  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

/**
 * Truncates text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated
 * @returns Truncated text
 */
export const truncateText = (
  text: string, 
  maxLength: number = 50, 
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

/**
 * Determines if a message is from the current user
 * @param messageSenderId - ID of the message sender
 * @param currentUserId - ID of the current user
 * @returns Boolean indicating if message is from current user
 */
export const isMessageFromCurrentUser = (
  messageSenderId: string, 
  currentUserId: string
): boolean => {
  return messageSenderId === currentUserId;
};

/**
 * Gets message status text and styling
 * @param isRead - Whether the message has been read
 * @param isFromCurrentUser - Whether the message is from the current user
 * @returns Object with status text and styling
 */
export const getMessageStatus = (isRead: boolean, isFromCurrentUser: boolean) => {
  if (!isFromCurrentUser) return null;
  
  return {
    text: isRead ? '✓ Read' : '✓ Sent',
    className: isRead ? 'opacity-80' : 'opacity-50'
  };
};
