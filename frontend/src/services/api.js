import axios from 'axios';

// --- Auth Helpers ---
const TOKEN_KEY = 'auth_token';

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginUser(credentials) {
  const response = await axios.post('http://localhost:8000/api/login/', credentials);
  setToken(response.data.token);
  return response.data;
}

export async function signupUser(credentials) {
  const response = await axios.post('http://localhost:8000/api/signup/', credentials);
  return response.data;
}

export async function logoutUser() {
  await axios.post('http://localhost:8000/api/logout/', {}, {
    headers: { Authorization: `Token ${getToken()}` }
  });
  removeToken();
}

// Axios request interceptor to add token
axios.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


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
const API_URL = 'http://localhost:8000/api/';

export const importCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return await axios.post(`${API_URL}import-csv/`, formData);
};

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
