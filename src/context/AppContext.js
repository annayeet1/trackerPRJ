import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTodayDate, archiveData } from '../utils/dateUtils';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const DEFAULT_WORK_TASKS = [
  { id: 'w1', text: 'Check emails', checked: false },
  { id: 'w2', text: 'Team standup', checked: false }
];

const DEFAULT_PERSONAL_TASKS = {
  mentalGrowth: [
    { id: 'm1', text: 'Read for 20 minutes', checked: false, isPermanent: true },
    { id: 'm2', text: 'Meditation/mindfulness', checked: false, isPermanent: true }
  ],
  physicalGrowth: [
    { id: 'ph1', text: 'Exercise for 30 minutes', checked: false, isPermanent: true },
    { id: 'ph2', text: 'Drink 8 glasses of water', checked: false, isPermanent: true }
  ],
  socialGrowth: [
    { id: 's1', text: 'Connect with a friend', checked: false, isPermanent: true },
    { id: 's2', text: 'Practice active listening', checked: false, isPermanent: true }
  ],
  personalGrowth: [
    { id: 'pe1', text: 'Journal for 10 minutes', checked: false, isPermanent: true },
    { id: 'pe2', text: 'Work on personal project', checked: false, isPermanent: true }
  ],
  tryingNewThings: [
    { id: 't1', text: 'Try a new recipe', checked: false, isPermanent: false },
    { id: 't2', text: 'Learn something new', checked: false, isPermanent: true }
  ]
};

const INITIAL_STATE = {
  user: {
    id: 'user1',
    name: 'You',
    friends: []
  },
  work: {
    defaultTasks: DEFAULT_WORK_TASKS,
    dailyTasks: []
  },
  personal: DEFAULT_PERSONAL_TASKS,
  archive: {},
  lastResetDate: getTodayDate(),
  friends: {} // Store friend data here
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('growthTrackerData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if we need to reset for new day
      if (parsed.lastResetDate !== getTodayDate()) {
        return resetForNewDay(parsed);
      }
      return parsed;
    }
    return INITIAL_STATE;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('growthTrackerData', JSON.stringify(state));
  }, [state]);

  // Check for midnight reset every minute
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const currentDate = getTodayDate();
      if (state.lastResetDate !== currentDate) {
        setState(prevState => resetForNewDay(prevState));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkMidnight);
  }, [state.lastResetDate]);

  const resetForNewDay = (prevState) => {
    // Archive yesterday's data
    const archived = archiveData(prevState);

    // Reset checkboxes and remove daily tasks
    return {
      ...prevState,
      work: {
        defaultTasks: prevState.work.defaultTasks.map(t => ({ ...t, checked: false })),
        dailyTasks: [] // Clear daily tasks
      },
      personal: {
        mentalGrowth: resetPersonalCategory(prevState.personal.mentalGrowth),
        physicalGrowth: resetPersonalCategory(prevState.personal.physicalGrowth),
        socialGrowth: resetPersonalCategory(prevState.personal.socialGrowth),
        personalGrowth: resetPersonalCategory(prevState.personal.personalGrowth),
        tryingNewThings: resetPersonalCategory(prevState.personal.tryingNewThings)
      },
      archive: {
        ...prevState.archive,
        [prevState.lastResetDate]: archived
      },
      lastResetDate: getTodayDate()
    };
  };

  const resetPersonalCategory = (tasks) => {
    return tasks
      .filter(task => task.isPermanent) // Keep only permanent tasks
      .map(task => ({ ...task, checked: false })); // Uncheck all
  };

  // Work functions
  const toggleWorkTask = (taskId, isDaily) => {
    setState(prev => ({
      ...prev,
      work: {
        ...prev.work,
        [isDaily ? 'dailyTasks' : 'defaultTasks']: prev.work[isDaily ? 'dailyTasks' : 'defaultTasks'].map(
          task => task.id === taskId ? { ...task, checked: !task.checked } : task
        )
      }
    }));
  };

  const addWorkTask = (text) => {
    const newTask = {
      id: `wd${Date.now()}`,
      text,
      checked: false,
      date: getTodayDate()
    };
    setState(prev => ({
      ...prev,
      work: {
        ...prev.work,
        dailyTasks: [...prev.work.dailyTasks, newTask]
      }
    }));
  };

  const deleteWorkTask = (taskId, isDaily) => {
    setState(prev => ({
      ...prev,
      work: {
        ...prev.work,
        [isDaily ? 'dailyTasks' : 'defaultTasks']: prev.work[isDaily ? 'dailyTasks' : 'defaultTasks'].filter(
          task => task.id !== taskId
        )
      }
    }));
  };

  // Personal functions
  const togglePersonalTask = (category, taskId) => {
    setState(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [category]: prev.personal[category].map(
          task => task.id === taskId ? { ...task, checked: !task.checked } : task
        )
      }
    }));
  };

  const addPersonalTask = (category, text, isPermanent) => {
    const newTask = {
      id: `${category}${Date.now()}`,
      text,
      checked: false,
      isPermanent,
      date: getTodayDate()
    };
    setState(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [category]: [...prev.personal[category], newTask]
      }
    }));
  };

  const deletePersonalTask = (category, taskId) => {
    setState(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [category]: prev.personal[category].filter(task => task.id !== taskId)
      }
    }));
  };

  // Friend functions
  const addFriend = (friendId, friendName) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        friends: [...prev.user.friends, friendId]
      },
      friends: {
        ...prev.friends,
        [friendId]: {
          id: friendId,
          name: friendName,
          personal: DEFAULT_PERSONAL_TASKS // Initialize with default tasks
        }
      }
    }));
  };

  const removeFriend = (friendId) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        friends: prev.user.friends.filter(id => id !== friendId)
      }
    }));
  };

  const value = {
    state,
    work: {
      toggle: toggleWorkTask,
      add: addWorkTask,
      delete: deleteWorkTask
    },
    personal: {
      toggle: togglePersonalTask,
      add: addPersonalTask,
      delete: deletePersonalTask
    },
    friends: {
      add: addFriend,
      remove: removeFriend
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
