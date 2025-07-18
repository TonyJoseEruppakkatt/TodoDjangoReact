import React, { useState } from 'react';
import { signupUser } from '../services/api';

function Signup({ onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await signupUser({ username, password });
      setSuccess('Signup successful! You can now log in.');
      setUsername('');
      setPassword('');
      setTimeout(onSwitchToLogin, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow" style={{ minWidth: 300 }}>
        <h2 className="mb-3 text-center">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
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
        <button type="submit" className="btn btn-success w-100">Sign Up</button>
        <div className="text-center mt-2">
          <button type="button" className="btn btn-link p-0" onClick={onSwitchToLogin}>
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
