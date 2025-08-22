import React from 'react';

// ✅ GOOD: This shows the corrected version that follows CodeKeeper rules

// ✅ Problem 1 FIXED: Proper TypeScript interfaces
interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

interface UserComponentProps {
  user: UserData;
  stats: UserStats;
  onUpdate?: (user: UserData) => void;
  theme?: 'light' | 'dark';
}

/**
 * User component that displays user information and stats
 * @param user - User data object with id, name, email, and optional avatar
 * @param stats - User statistics including posts, followers, and following counts
 * @param onUpdate - Optional callback function when user data is updated
 * @param theme - Optional theme setting, either 'light' or 'dark'
 */
const UserComponent = ({ 
  user, 
  stats, 
  onUpdate, 
  theme = 'light' 
}: UserComponentProps) => {
  // ✅ Problem 2 FIXED: Minimal, focused state management
  const [isUpdating, setIsUpdating] = React.useState(false);

  // ✅ Problem 3 FIXED: No unsafe type assertions needed
  const handleUpdate = async () => {
    if (!onUpdate) return;
    
    setIsUpdating(true);
    try {
      // Update with proper typing
      const updatedUser: UserData = {
        ...user,
        name: user.name.trim(),
      };
      
      onUpdate(updatedUser);
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Problem 4 FIXED: Simple, focused component logic
  const avatarSrc = user.avatar || '/default-avatar.png';
  const displayName = user.name || 'Unknown User';

  // ✅ Problem 5 FIXED: Simple JSX structure, not deeply nested
  return (
    <div className={`user-card user-card--${theme}`}>
      <div className="user-card__header">
        <img 
          src={avatarSrc} 
          alt={`${displayName} avatar`}
          className="user-card__avatar"
        />
        <div className="user-card__info">
          <h3 className="user-card__name">{displayName}</h3>
          <p className="user-card__email">{user.email}</p>
        </div>
      </div>
      
      <div className="user-card__stats">
        <StatItem label="Posts" value={stats.posts} />
        <StatItem label="Followers" value={stats.followers} />
        <StatItem label="Following" value={stats.following} />
      </div>
      
      {onUpdate && (
        <button 
          className="user-card__update-btn"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      )}
    </div>
  );
};

// ✅ Extracted sub-component for better organization
interface StatItemProps {
  label: string;
  value: number;
}

/**
 * Displays a single stat item with label and value
 * @param label - The stat label (e.g., "Posts", "Followers")
 * @param value - The numeric value to display
 */
const StatItem = ({ label, value }: StatItemProps) => (
  <div className="stat-item">
    <span className="stat-item__label">{label}</span>
    <span className="stat-item__value">{value.toLocaleString()}</span>
  </div>
);

export default UserComponent;

// ✅ Export types for reuse (no barrel files needed)
export type { UserData, UserStats, UserComponentProps };