import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import GrowthCard from '../Cards/GrowthCard';

const FriendTab = () => {
  const { state, friends } = useApp();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [friendName, setFriendName] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (friendName.trim()) {
      const friendId = `friend${Date.now()}`;
      friends.add(friendId, friendName.trim());
      setFriendName('');
      setShowAddForm(false);
    }
  };

  const categories = [
    {
      key: 'mentalGrowth',
      title: 'Mental Growth',
      description: 'Learning, reading, meditation',
      color: 'mental',
      icon: '🧠'
    },
    {
      key: 'physicalGrowth',
      title: 'Physical Growth',
      description: 'Exercise, nutrition, health',
      color: 'physical',
      icon: '💪'
    },
    {
      key: 'socialGrowth',
      title: 'Social Growth',
      description: 'Connections, networking, community',
      color: 'social',
      icon: '👥'
    },
    {
      key: 'personalGrowth',
      title: 'Personal Growth',
      description: 'Self-improvement, hobbies, projects',
      color: 'personal',
      icon: '🌱'
    },
    {
      key: 'tryingNewThings',
      title: 'Trying New Things',
      description: 'Challenges, new experiences',
      color: 'new',
      icon: '✨'
    }
  ];

  if (state.user.friends.length === 0 && !showAddForm) {
    return (
      <div className="tab-content">
        <div className="tab-header">
          <h2>Friends</h2>
          <p className="tab-description">Add friends to see their personal growth journey</p>
        </div>
        <div className="empty-state">
          <p>You haven't added any friends yet.</p>
          <button className="add-friend-btn" onClick={() => setShowAddForm(true)}>
            Add Friend
          </button>
        </div>
        {showAddForm && (
          <form className="friend-form" onSubmit={handleAddFriend}>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Enter friend's name"
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="submit-btn">Add</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Friends</h2>
        <p className="tab-description">View your friends' personal growth</p>
        <button className="add-friend-btn" onClick={() => setShowAddForm(true)}>
          + Add Friend
        </button>
      </div>

      {showAddForm && (
        <form className="friend-form" onSubmit={handleAddFriend}>
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder="Enter friend's name"
            autoFocus
          />
          <div className="form-actions">
            <button type="submit" className="submit-btn">Add</button>
            <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="friends-list">
        {state.user.friends.map(friendId => {
          const friend = state.friends[friendId];
          return (
            <div key={friendId} className="friend-item">
              <button
                className={`friend-btn ${selectedFriend === friendId ? 'active' : ''}`}
                onClick={() => setSelectedFriend(selectedFriend === friendId ? null : friendId)}
              >
                {friend.name}
              </button>
              <button
                className="remove-friend-btn"
                onClick={() => {
                  friends.remove(friendId);
                  if (selectedFriend === friendId) setSelectedFriend(null);
                }}
                title="Remove friend"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {selectedFriend && state.friends[selectedFriend] && (
        <div className="friend-details">
          <h3>{state.friends[selectedFriend].name}'s Personal Growth</h3>
          <div className="growth-cards-container">
            {categories.map(category => {
              const tasks = state.friends[selectedFriend].personal[category.key] || [];
              return (
                <div key={category.key} className={`growth-card ${category.color} read-only`}>
                  <div className="card-header">
                    <span className="card-icon">{category.icon}</span>
                    <div>
                      <h3>{category.title}</h3>
                      <p className="card-description">{category.description}</p>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="task-list">
                      {tasks.map(task => (
                        <div key={task.id} className={`task-item ${task.checked ? 'checked' : ''}`}>
                          <label className="task-label">
                            <input type="checkbox" checked={task.checked} disabled />
                            <span className="task-text">{task.text}</span>
                          </label>
                          {task.isPermanent !== undefined && (
                            <span className={`task-badge ${task.isPermanent ? 'permanent' : 'daily'}`}>
                              {task.isPermanent ? 'Recurring' : 'One-time'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendTab;
