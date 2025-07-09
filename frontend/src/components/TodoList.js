import React, { useEffect, useState } from 'react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch('/api/todos/')
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.error('Error fetching todos:', error));
    }, []);

    const handleDelete = (id) => {
        fetch(`/api/todos/${id}/`, {
            method: 'DELETE',
        })
        .then(() => {
            setTodos(todos.filter(todo => todo.id !== id));
        })
        .catch(error => console.error('Error deleting todo:', error));
    };

    return (
        <div>
            <h1>Todo List</h1>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;