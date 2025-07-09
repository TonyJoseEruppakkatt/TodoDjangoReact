import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/todos/';
const API_BASE = 'http://localhost:8000/api';

// ✅ Get all todos (supports paginated or plain list)
export const fetchTodos = async () => {
  const response = await axios.get(API_BASE_URL);
  const data = response.data;

  if (Array.isArray(data)) {
    return data; // plain array response
  } else if (Array.isArray(data.results)) {
    return data.results; // paginated response
  } else {
    console.warn('Unexpected response structure:', data);
    return [];
  }
};

// ✅ Add a new todo
export const addTodo = (todo) => axios.post(API_BASE_URL, todo);

// ✅ Delete a todo
export const deleteTodo = async (id) => {
  await axios.delete(`http://localhost:8000/api/todos/${id}/`);
};

// ✅ Update a todo
export const updateTodo = (id, updatedData) =>
  axios.put(`${API_BASE_URL}${id}/`, updatedData);

// ✅ Import CSV
export const importCSV = (formData) =>
  axios.post(`${API_BASE_URL}import/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ✅ Export Todos
export const exportTodos = (format) =>
  axios.get(`${API_BASE_URL}export/?format=${format}`, {
    responseType: 'blob', // important for file download
  });

// ✅ Create Todo (alternative)
export const createTodo = async (data) => {
  const response = await axios.post(`${API_BASE}/todos/`, data);
  return response.data;
};
