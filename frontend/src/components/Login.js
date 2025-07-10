import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await loginUser({ username, password });
      onLogin(userData);
      navigate('/'); // Redirect to main app after login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow" style={{ minWidth: 300 }}>
        <h2 className="mb-3 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        <div className="text-center mt-2">
          <button type="button" className="btn btn-link p-0" onClick={onSwitchToSignup}>
            Don't have an account? Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
