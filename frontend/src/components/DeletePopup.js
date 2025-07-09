import React from 'react';
import { deleteTodo } from '../services/api';
import { toast } from 'react-toastify';

const DeletePopup = ({ todo, onClose, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      toast.success('Task deleted!');
      onDeleteSuccess();
      onClose();
    } catch (error) {
      toast.error('Error deleting task.');
      console.error('Delete error:', error);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050,
      }}
    >
      <div
        className="modal-dialog"
        style={{
          margin: '2rem auto 0', // pushes popup to top
          maxWidth: '500px',
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete "{todo.title}"?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
