import TodoItem from './TodoItem';

function TodoList({ todos, onEdit, onDelete, onToggleComplete, filter }) {
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        {filter === 'active' && <p>진행 중인 할 일이 없습니다.</p>}
        {filter === 'completed' && <p>완료된 할 일이 없습니다.</p>}
        {filter === 'all' && <p>할 일을 추가해주세요.</p>}
      </div>
    );
  }

  return (
    <div className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TodoList;

