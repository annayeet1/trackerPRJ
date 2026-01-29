import React from 'react';
import { useApp } from '../../context/AppContext';
import GrowthCard from '../Cards/GrowthCard';

const PersonalTab = () => {
  const { state, personal } = useApp();

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

  return (
    <div className="tab-content personal-tab">
      <div className="tab-header">
        <h2>Personal Growth</h2>
        <p className="tab-description">Track your growth across all dimensions</p>
      </div>

      <div className="growth-cards-container">
        {categories.map(category => (
          <GrowthCard
            key={category.key}
            category={category}
            tasks={state.personal[category.key]}
            onToggle={(taskId) => personal.toggle(category.key, taskId)}
            onAdd={(text, isPermanent) => personal.add(category.key, text, isPermanent)}
            onDelete={(taskId) => personal.delete(category.key, taskId)}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonalTab;
