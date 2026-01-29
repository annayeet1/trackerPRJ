import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskItem from '../Tasks/TaskItem';
import TaskForm from '../Tasks/TaskForm';

const PlannerTab = () => {
  const { state, planner } = useApp();
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (text) => {
    planner.add(text);
    setShowForm(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Planner</h2>
        <p className="tab-description">Plan your day and set your priorities</p>
      </div>

      <div className="task-section">
        <h3>Default Tasks</h3>
        <div className="task-list">
          {state.planner.defaultTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => planner.toggle(task.id, false)}
              onDelete={() => planner.delete(task.id, false)}
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
          {state.planner.dailyTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => planner.toggle(task.id, true)}
              onDelete={() => planner.delete(task.id, true)}
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

export default PlannerTab;
