import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getArchivedDates, formatDate } from '../../utils/dateUtils';

const ArchiveViewer = ({ onClose }) => {
  const { state } = useApp();
  const archivedDates = getArchivedDates(state.archive);
  const [selectedDate, setSelectedDate] = useState(archivedDates[0] || null);

  if (archivedDates.length === 0) {
    return (
      <div className="archive-viewer">
        <div className="archive-header">
          <h2>Archive</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="empty-state">
          <p>No archived data yet. Come back tomorrow!</p>
        </div>
      </div>
    );
  }

  const selectedData = selectedDate ? state.archive[selectedDate] : null;

  return (
    <div className="archive-viewer">
      <div className="archive-header">
        <h2>Archive</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="archive-dates">
        <h3>Select a date:</h3>
        <div className="date-list">
          {archivedDates.map(date => (
            <button
              key={date}
              className={`date-btn ${selectedDate === date ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {selectedData && (
        <div className="archive-content">
          <h3>Data from {formatDate(selectedDate)}</h3>

          <div className="archive-section">
            <h4>Work</h4>
            <div className="task-list">
              <p className="section-label">Default Tasks:</p>
              {selectedData.work.defaultTasks.map(task => (
                <div key={task.id} className={`task-item ${task.checked ? 'checked' : ''}`}>
                  <label className="task-label">
                    <input type="checkbox" checked={task.checked} disabled />
                    <span className="task-text">{task.text}</span>
                  </label>
                </div>
              ))}
              {selectedData.work.dailyTasks.length > 0 && (
                <>
                  <p className="section-label">Daily Tasks:</p>
                  {selectedData.work.dailyTasks.map(task => (
                    <div key={task.id} className={`task-item ${task.checked ? 'checked' : ''}`}>
                      <label className="task-label">
                        <input type="checkbox" checked={task.checked} disabled />
                        <span className="task-text">{task.text}</span>
                      </label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="archive-section">
            <h4>Personal Growth</h4>
            {Object.entries(selectedData.personal).map(([key, tasks]) => {
              const categoryNames = {
                mentalGrowth: '🧠 Mental Growth',
                physicalGrowth: '💪 Physical Growth',
                socialGrowth: '👥 Social Growth',
                personalGrowth: '🌱 Personal Growth',
                tryingNewThings: '✨ Trying New Things'
              };
              return (
                <div key={key} className="archive-category">
                  <p className="section-label">{categoryNames[key]}:</p>
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveViewer;
