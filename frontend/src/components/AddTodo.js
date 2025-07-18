import React, { useState } from 'react';
import { createTodo } from '../services/api';
import { toast } from 'react-toastify';

const AddTodo = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTodo({
        title,
        due_date: dueDate,
        description: description || '',
        completed: false,
      });
      toast.success('Todo added successfully!');
      setTitle('');
      setDueDate('');
      setDescription('');
      onAdd(); // refresh the todo list
    } catch (error) {
      toast.error('Failed to save');
      console.error('AddTodo error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 d-flex align-items-end gap-3 flex-wrap">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description (optional)</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Task</button>
    </form>
  );
};

export default AddTodo;
