import React from 'react';
import { formatDisplayName, getRoleStyling } from '@/lib/messageUtils';

interface ConversationHeaderProps {
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role?: string;
    imageUrl?: string;
  };
  showRole?: boolean;
  showDescription?: boolean;
  variant?: 'default' | 'compact';
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  user,
  showRole = true,
  showDescription = true,
  variant = 'default'
}) => {
  const roleStyling = getRoleStyling(user.role);
  const displayName = formatDisplayName(user);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {displayName}
            </h3>
            {showRole && user.role && (
              <span className={`text-sm font-medium ${roleStyling.color}`}>
                {roleStyling.icon}
              </span>
            )}
          </div>
          {showDescription && user.role && (
            <p className="text-sm text-gray-500 truncate">
              {roleStyling.icon} {roleStyling.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {displayName}
            </h3>
            {showRole && user.role && (
              <span className={`text-sm font-medium ${roleStyling.color}`}>
                {roleStyling.icon}
              </span>
            )}
          </div>
          {showDescription && user.role && (
            <p className="text-sm text-gray-500">
              {roleStyling.icon} {roleStyling.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
