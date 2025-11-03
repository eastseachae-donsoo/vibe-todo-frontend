import { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // 할 일 목록 불러오기
  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || '할 일을 불러오는 중 오류가 발생했습니다.');
      console.error('할 일 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // 할 일 추가
  const handleCreateTodo = async (todoData) => {
    try {
      const newTodo = await createTodo(todoData);
      setTodos([newTodo, ...todos]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || '할 일을 추가하는 중 오류가 발생했습니다.');
    }
  };

  // 할 일 수정
  const handleUpdateTodo = async (todoData) => {
    try {
      const updatedTodo = await updateTodo(editingTodo._id, todoData);
      setTodos(todos.map((todo) => (todo._id === editingTodo._id ? updatedTodo : todo)));
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      setError(err.message || '할 일을 수정하는 중 오류가 발생했습니다.');
    }
  };

  // 할 일 삭제
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || '할 일을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  // 할 일 완료 토글
  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTodo = await updateTodo(id, { completed });
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      setError(null);
    } catch (err) {
      setError(err.message || '할 일 상태를 변경하는 중 오류가 발생했습니다.');
    }
  };

  // 수정 시작
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  // 폼 제출
  const handleSubmit = (todoData) => {
    if (editingTodo) {
      handleUpdateTodo(todoData);
    } else {
      handleCreateTodo(todoData);
    }
  };

  const stats = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>할 일 관리</h1>
          <p className="subtitle">일정을 효율적으로 관리하세요</p>
        </header>

        {error && (
          <div className="error-message">
            <div className="error-content">
              <span>⚠️</span> 
              <div className="error-text">
                <strong>{error}</strong>
                {(error.includes('백엔드 서버') || error.includes('서버 오류') || error.includes('내부 오류')) && (
                  <div className="error-help">
                    <p>해결 방법:</p>
                    <ul>
                      {error.includes('내부 오류') && (
                        <>
                          <li>백엔드 서버의 콘솔 로그를 확인하여 오류 원인을 파악하세요</li>
                          <li>데이터베이스 연결이 정상적인지 확인하세요</li>
                          <li>서버 코드에서 오류가 발생하지 않았는지 확인하세요</li>
                        </>
                      )}
                      {error.includes('백엔드 서버') && !error.includes('내부 오류') && (
                        <>
                          <li>백엔드 서버가 localhost:5000에서 실행 중인지 확인하세요</li>
                          <li>서버가 CORS를 허용하도록 설정되어 있는지 확인하세요</li>
                        </>
                      )}
                      <li>브라우저 개발자 도구의 Network 탭에서 요청/응답 상세 정보를 확인하세요</li>
                      <li>브라우저 콘솔(F12)에서 더 자세한 오류 메시지를 확인하세요</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="error-actions">
              <button onClick={loadTodos} className="btn btn-secondary btn-retry">
                재시도
              </button>
              <button onClick={() => setError(null)} className="close-btn">×</button>
            </div>
          </div>
        )}

        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">전체</span>
            <span className="stat-value">{stats.all}</span>
          </div>
          <div className="stat">
            <span className="stat-label">진행 중</span>
            <span className="stat-value">{stats.active}</span>
          </div>
          <div className="stat">
            <span className="stat-label">완료</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            진행 중
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            완료
          </button>
        </div>

        <div className="main-content">
          <div className="form-section">
            {showForm ? (
              <div className="form-container">
                <h2>{editingTodo ? '할 일 수정' : '새 할 일 추가'}</h2>
                <TodoForm
                  todo={editingTodo}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              <button
                className="btn btn-primary btn-add"
                onClick={() => {
                  setEditingTodo(null);
                  setShowForm(true);
                }}
              >
                + 새 할 일 추가
              </button>
            )}
          </div>

          <div className="todos-section">
            {loading ? (
              <div className="loading">로딩 중...</div>
            ) : (
              <TodoList
                todos={todos}
                onEdit={handleEdit}
                onDelete={handleDeleteTodo}
                onToggleComplete={handleToggleComplete}
                filter={filter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
