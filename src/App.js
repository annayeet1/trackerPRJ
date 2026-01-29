import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import WorkTab from './components/Tabs/WorkTab';
import PersonalTab from './components/Tabs/PersonalTab';
import FriendTab from './components/Tabs/FriendTab';
import ArchiveViewer from './components/Archive/ArchiveViewer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showArchive, setShowArchive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());  // Show Time
   
  useEffect(() => {
       const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);  // Cleanup on unmount
  }, []);

  
  // Format the time nicely
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderActiveTab = () => {
    if (showArchive) {
      return <ArchiveViewer onClose={() => setShowArchive(false)} />;
    }
      //how you select each tab
    switch (activeTab) {
      case 'work':
        return <WorkTab />;
      case 'personal':
        return <PersonalTab />;
      case 'friends':
        return <FriendTab />;
      default:
        return <PersonalTab />;
    }
  };

  //What you see in the header and tabs
  return (
    <AppProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <h1>Task Tracker</h1>
            <span className="current-time">{formatTime(currentTime)}</span>
          </div>
          <button className="archive-btn" onClick={() => setShowArchive(!showArchive)}>
            {showArchive ? 'Close Archive' : 'View Archive'}
          </button>
        </header>

        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            Work
          </button>
          <button
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </button>
          <button
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
        </nav>

        <main className="app-content">
          {renderActiveTab()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
