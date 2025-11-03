import { useState, useEffect } from 'react';

function TodoForm({ todo, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
    tags: '',
    completed: false,
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        category: todo.category || '',
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
        tags: Array.isArray(todo.tags) ? todo.tags.join(', ') : '',
        completed: todo.completed || false,
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const submitData = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag)
        : [],
      dueDate: formData.dueDate || undefined,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label htmlFor="title">제목 *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="할 일 제목을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="할 일에 대한 설명을 입력하세요"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">우선순위</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="카테고리를 입력하세요"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">마감일</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">태그 (쉼표로 구분)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="예: 작업, 긴급, 개인"
        />
      </div>

      {todo && (
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
            />
            완료됨
          </label>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {todo ? '수정' : '추가'}
        </button>
        {todo && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            취소
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;

