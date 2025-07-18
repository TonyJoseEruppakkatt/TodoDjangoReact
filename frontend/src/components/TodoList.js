import React from 'react';

const TodoList = ({ todos, onDelete, onUpdate }) => {
  const handleToggleComplete = (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    onUpdate(todo.id, updatedTodo);
  };

  return (
    <ul className="list-group mb-3">
      {todos.length === 0 ? (
        <li className="list-group-item text-center">No tasks found.</li>
      ) : (
        todos.map(todo => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{todo.title}</strong><br />
              <small>Due: {todo.due_date}</small>
            </div>
            <div>
              <span className={`badge ${todo.completed ? 'bg-success' : 'bg-warning'} me-2`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
              <button
                className="btn btn-sm btn-outline-success me-2"
                onClick={() => handleToggleComplete(todo)}
              >
                {todo.completed ? 'Undo' : 'Mark as Done'}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(todo)}
              >
                Delete
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default TodoList;
