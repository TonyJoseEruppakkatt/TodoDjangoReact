import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import TodoList from './components/TodoList';
import Pagination from './components/Pagination';
import AddTodo from './components/AddTodo';
import ExportDropdown from './components/ExportDropdown';
import ImportCSV from './components/ImportCSV';
import DeletePopup from './components/DeletePopup';
import { fetchTodos, updateTodo, getToken } from './services/api';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const todosPerPage = 5;

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    if (getToken()) {
      refreshTodos();
    }
  }, [location]);

  const refreshTodos = async () => {
    try {
      const data = await fetchTodos();
      if (Array.isArray(data)) {
        setTodos(data);
      } else if (Array.isArray(data.results)) {
        setTodos(data.results);
      } else {
        console.error('Unexpected todo data format:', data);
        setTodos([]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      await updateTodo(id, updatedTodo);
      refreshTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'not_completed' && !todo.completed))
  );

  const pageCount = Math.ceil(filteredTodos.length / todosPerPage);
  const paginatedTodos = filteredTodos.slice(
    currentPage * todosPerPage,
    (currentPage + 1) * todosPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setDeletePopupVisible(true);
  };

  const closeDeletePopup = () => {
    setDeletePopupVisible(false);
    setTodoToDelete(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onLogin={(userData) => {
              setIsAuthenticated(true);
              setUser(userData);
            }}
            onSwitchToSignup={() => setShowSignup(true)}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup
            onSignup={() => setShowSignup(false)}
            onSwitchToLogin={() => setShowSignup(false)}
          />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="container mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="mb-4 text-center">Todo List</h1>
                <Logout onLogout={() => {
                  setIsAuthenticated(false);
                  setUser(null);
                }} />
              </div>

              <AddTodo onAdd={refreshTodos} />

              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <FilterDropdown filterStatus={filterStatus} onFilterChange={setFilterStatus} />
                <ExportDropdown todos={filteredTodos} />
              </div>

              <ImportCSV onImport={refreshTodos} />

              <TodoList
                todos={paginatedTodos}
                onDelete={handleDeleteClick}
                onUpdate={handleUpdate}
              />

              <Pagination pageCount={pageCount} handlePageChange={handlePageChange} />

              {deletePopupVisible && (
                <DeletePopup
                  todo={todoToDelete}
                  onClose={closeDeletePopup}
                  onDeleteSuccess={refreshTodos}
                />
              )}

              <ToastContainer position="top-right" autoClose={2000} />
            </div>
          </ProtectedRoute>
        }
      />
      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
