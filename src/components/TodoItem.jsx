import { useState } from 'react';

function TodoItem({ todo, onEdit, onDelete, onToggleComplete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
      <div className="todo-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="todo-main">
          <div className="todo-title-section">
            <input
              type="checkbox"
              checked={todo.completed || false}
              onChange={(e) => onToggleComplete(todo._id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="todo-checkbox"
            />
            <h3 className="todo-title">{todo.title}</h3>
            <span
              className="priority-badge"
              style={{ backgroundColor: priorityColors[todo.priority] || priorityColors.medium }}
            >
              {todo.priority === 'low' ? '낮음' : todo.priority === 'medium' ? '보통' : '높음'}
            </span>
          </div>
          <div className="todo-meta">
            {todo.category && <span className="category-badge">{todo.category}</span>}
            {todo.dueDate && (
              <span className={`due-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
                {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>
        <div className="todo-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            className="btn btn-sm btn-edit"
          >
            수정
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('정말 삭제하시겠습니까?')) {
                onDelete(todo._id);
              }
            }}
            className="btn btn-sm btn-delete"
          >
            삭제
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="todo-details">
          {todo.description && (
            <div className="todo-description">
              <strong>설명:</strong> {todo.description}
            </div>
          )}
          {todo.tags && todo.tags.length > 0 && (
            <div className="todo-tags">
              <strong>태그:</strong>
              {todo.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="todo-date-info">
            {todo.createdAt && (
              <span>생성일: {formatDate(todo.createdAt)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem;

