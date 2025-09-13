import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ token, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout?.();
    navigate('/');
  };

  return (
    <nav
      style={{
        padding: '1rem 2rem',
        backgroundColor: '#6a0dad',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '0 0 10px 10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>FocusBlock</Link>
        {token && <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>}
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {token ? (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'white',
              color: '#6a0dad',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}