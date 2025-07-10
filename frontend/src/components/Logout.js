import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert('You have been logged out successfully.');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('You were already logged out.');
      } else if (error.response && error.response.data && error.response.data.error) {
        alert('Logout failed: ' + error.response.data.error);
      } else {
        alert('Network error during logout.');
      }
    }
    navigate('/login', { replace: true }); // Replace history so back button cannot return to protected page
  };

  return (
    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
