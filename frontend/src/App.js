import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import TodoList from './components/TodoList';
import Pagination from './components/Pagination';
import AddTodo from './components/AddTodo';
import ExportDropdown from './components/ExportDropdown';
import ImportCSV from './components/ImportCSV';
import DeletePopup from './components/DeletePopup';
import { fetchTodos, updateTodo } from './services/api';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const todosPerPage = 5;

  useEffect(() => {
    refreshTodos();
  }, []);

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
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Todo List</h1>

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
  );
}

export default App;
