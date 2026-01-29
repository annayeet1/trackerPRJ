import React from 'react';

const TaskItem = ({ task, onToggle, onDelete, showDelete, showBadge }) => {
  return (
    <div className={`task-item ${task.checked ? 'checked' : ''}`}>
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.checked}
          onChange={onToggle}
        />
        <span className="task-text">{task.text}</span>
      </label>

      <div className="task-actions">
        {showBadge && task.isPermanent !== undefined && (
          <span className={`task-badge ${task.isPermanent ? 'permanent' : 'daily'}`}>
            {task.isPermanent ? 'Recurring' : 'One-time'}
          </span>
        )}
        {showDelete && (
          <button className="delete-btn" onClick={onDelete} title="Delete task">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
