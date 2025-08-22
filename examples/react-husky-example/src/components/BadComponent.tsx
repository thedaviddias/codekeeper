import React, { useState, useEffect } from 'react';

// ❌ BAD: This component demonstrates common AI-generated problems
// that CodeKeeper will catch and prevent

// Problem 1: No TypeScript interface, using 'any'
const BadComponent = ({ data, onUpdate, isLoading, theme, config }: any) => {
  // Problem 2: Too many useState hooks (AI loves creating tons of state)
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [likes, setLikes] = useState();
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [notifications, setNotifications] = useState();
  const [settings, setSettings] = useState();
  const [preferences, setPreferences] = useState();
  const [cache, setCache] = useState();
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState();

  // Problem 3: Unsafe type assertions everywhere
  const userData = data as any;
  const userSettings = userData.settings as any;
  const userProfile = userData.profile as any;

  // Problem 4: Too many useEffect hooks with complex logic
  useEffect(() => {
    // AI often creates complex useEffect chains
    if (userData) {
      setUser(userData as any);
      setSettings(userSettings as any);
      if (userProfile.posts) {
        setPosts(userProfile.posts as any);
        userProfile.posts.forEach((post: any) => {
          if (post.comments) {
            setComments((prev: any) => [...(prev || []), ...post.comments]);
          }
        });
      }
    }
  }, [userData, userSettings, userProfile]);

  useEffect(() => {
    // Another complex effect
    const fetchAdditionalData = async () => {
      try {
        const response = await fetch('/api/user/additional');
        const additionalData = await response.json();
        setFollowers(additionalData.followers as any);
        setFollowing(additionalData.following as any);
        setNotifications(additionalData.notifications as any);
      } catch (error) {
        setErrors(error as any);
      }
    };
    
    if (user) {
      fetchAdditionalData();
    }
  }, [user]);

  useEffect(() => {
    // Yet another effect
    if (theme && user) {
      setPreferences((prev: any) => ({
        ...prev,
        theme: theme as any,
        userId: user.id as any
      }));
    }
  }, [theme, user]);

  // Problem 5: Complex helper functions inside component
  const processUserData = (rawData: any) => {
    const processed = rawData as any;
    return {
      id: processed.id as string,
      name: processed.naem as string, // ❌ Typo! Will crash at runtime
      email: processed.email as string,
      avatar: processed.avatar as string,
      stats: {
        posts: processed.posts?.length || 0,
        followers: processed.followers?.length || 0,
        following: processed.following?.length || 0
      }
    };
  };

  const handleUserUpdate = (newData: any) => {
    const updated = newData as any;
    setUser(updated);
    if (onUpdate) {
      onUpdate(updated as any);
    }
  };

  const calculateUserScore = (userData: any) => {
    // Overly complex calculation AI might generate
    const posts = userData.posts as any[];
    const engagement = posts.reduce((total: any, post: any) => {
      return total + (post.likes as number) + (post.comments as any[]).length;
    }, 0);
    
    const followerRatio = (userData.followers as any[]).length / 
                         ((userData.following as any[]).length || 1);
    
    return (engagement * 0.7) + (followerRatio * 0.3);
  };

  // Problem 6: Massive JSX return with deep nesting
  return (
    <div className={`user-dashboard ${theme as string}`}>
      <div className="header">
        <div className="user-info">
          <div className="avatar-section">
            <img 
              src={(user as any)?.avatar || '/default-avatar.png'} 
              alt={`${(user as any)?.naem || 'User'} avatar`}  // ❌ Typo again
            />
            <div className="user-details">
              <h2>{(user as any)?.name}</h2>
              <p>{(user as any)?.email}</p>
              <div className="stats">
                <span>Posts: {(posts as any[])?.length || 0}</span>
                <span>Followers: {(followers as any[])?.length || 0}</span>
                <span>Following: {(following as any[])?.length || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button onClick={() => handleUserUpdate({...user, lastActive: Date.now()})}>
              Update Activity
            </button>
            <button onClick={() => setSettings({...(settings as any), theme: theme})}>
              Apply Theme
            </button>
          </div>
        </div>
        
        <div className="notifications">
          {(notifications as any[])?.map((notification: any, index: number) => (
            <div key={index} className="notification-item">
              <div className="notification-content">
                <h4>{notification.title as string}</h4>
                <p>{notification.message as string}</p>
                <span className="timestamp">
                  {new Date(notification.timestamp as string).toLocaleString()}
                </span>
              </div>
              <button onClick={() => {
                const updated = (notifications as any[]).filter((_: any, i: number) => i !== index);
                setNotifications(updated);
              }}>
                Dismiss
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="content">
        <div className="posts-section">
          <h3>Recent Posts</h3>
          <div className="posts-grid">
            {(posts as any[])?.slice(0, 10).map((post: any, index: number) => (
              <div key={index} className="post-card">
                <div className="post-header">
                  <h4>{post.title as string}</h4>
                  <span className="post-date">
                    {new Date(post.createdAt as string).toLocaleDateString()}
                  </span>
                </div>
                <div className="post-content">
                  <p>{(post.content as string)?.substring(0, 150)}...</p>
                  <div className="post-stats">
                    <span>👍 {(post.likes as number) || 0}</span>
                    <span>💬 {(post.comments as any[])?.length || 0}</span>
                    <span>Score: {calculateUserScore(user as any).toFixed(1)}</span>
                  </div>
                </div>
                <div className="post-actions">
                  <button onClick={() => setLikes((prev: any) => ({
                    ...prev,
                    [post.id]: ((prev as any)?.[post.id] || 0) + 1
                  }))}>
                    Like
                  </button>
                  <button onClick={() => {
                    const newComment = prompt('Add comment:');
                    if (newComment) {
                      const updatedPosts = (posts as any[]).map((p: any) => 
                        p.id === post.id 
                          ? {...p, comments: [...(p.comments || []), {
                              text: newComment,
                              author: (user as any)?.name,
                              timestamp: Date.now()
                            }]}
                          : p
                      );
                      setPosts(updatedPosts);
                    }
                  }}>
                    Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sidebar">
          <div className="user-preferences">
            <h4>Preferences</h4>
            <div className="preference-items">
              {Object.entries((preferences as any) || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="preference-item">
                  <label>{key}:</label>
                  <input 
                    type="text" 
                    value={value as string} 
                    onChange={(e) => setPreferences((prev: any) => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="cache-info">
            <h4>Cache Status</h4>
            <pre>{JSON.stringify(cache, null, 2)}</pre>
            <button onClick={() => setCache({})}>Clear Cache</button>
          </div>
          
          {(errors as any) && (
            <div className="errors-section">
              <h4>Errors</h4>
              <div className="error-messages">
                {Object.entries(errors as any).map(([key, error]: [string, any]) => (
                  <div key={key} className="error-item">
                    <strong>{key}:</strong> {(error as any).message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="footer">
        <div className="loading-states">
          {isLoading && <div className="spinner">Loading...</div>}
          {loading && <div className="spinner">Processing...</div>}
        </div>
        
        <div className="debug-info" style={{display: 'none'}}>
          <pre>{JSON.stringify({user, posts, comments, likes}, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default BadComponent;