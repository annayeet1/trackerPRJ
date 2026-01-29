import React, { useState } from 'react';
import TaskItem from '../Tasks/TaskItem';
import TaskForm from '../Tasks/TaskForm';

const GrowthCard = ({ category, tasks, onToggle, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [isPermanent, setIsPermanent] = useState(true);

  const handleAddTask = (text) => {
    onAdd(text, isPermanent);
    setShowForm(false);
    setIsPermanent(true);
  };

  return (
    <div className={`growth-card ${category.color}`}>
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
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
              showDelete={true}
              showBadge={true}
            />
          ))}
        </div>

        {showForm ? (
          <div>
            <div className="task-type-selector">
              <label>
                <input
                  type="radio"
                  name={`type-${category.key}`}
                  checked={isPermanent}
                  onChange={() => setIsPermanent(true)}
                />
                Recurring (daily)
              </label>
              <label>
                <input
                  type="radio"
                  name={`type-${category.key}`}
                  checked={!isPermanent}
                  onChange={() => setIsPermanent(false)}
                />
                One-time
              </label>
            </div>
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
              placeholder="Enter task..."
            />
          </div>
        ) : (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default GrowthCard;
