import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskItem from '../Tasks/TaskItem';
import TaskForm from '../Tasks/TaskForm';

const WorkTab = () => {
  const { state, work } = useApp();
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (text) => {
    work.add(text);
    setShowForm(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Work</h2>
        <p className="tab-description">Track your daily work tasks</p>
      </div>

      <div className="task-section">
        <h3>Default Tasks</h3>
        <div className="task-list">
          {state.work.defaultTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => work.toggle(task.id, false)}
              onDelete={() => work.delete(task.id, false)}
              showDelete={false}
            />
          ))}
        </div>
      </div>

      <div className="task-section">
        <div className="section-header">
          <h3>Today's Tasks</h3>
          <span className="reset-info">(Resets at midnight)</span>
        </div>
        <div className="task-list">
          {state.work.dailyTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => work.toggle(task.id, true)}
              onDelete={() => work.delete(task.id, true)}
              showDelete={true}
            />
          ))}
        </div>
        {showForm ? (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
            placeholder="Enter task..."
          />
        ) : (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkTab;
