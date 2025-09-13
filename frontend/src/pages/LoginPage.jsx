import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function LoginPage({ setToken, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);

      // Send JWT to Chrome extension
      if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(
          'YOUR_EXTENSION_ID',
          { type: 'SET_TOKEN', token },
          (response) => console.log('Extension response:', response)
        );
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err.response?.data || err);
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '10px', 
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#6a0dad', marginBottom: '1.5rem' }}>Login</h2>
        
        {error && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#f8d7da', 
            padding: '0.5rem', 
            borderRadius: '5px', 
            marginBottom: '1rem', 
            border: '1px solid #f5c6cb' 
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Enter your email" 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '5px', 
              border: '1px solid #ccc', 
              fontSize: '1rem' 
            }}
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Enter your password" 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '5px', 
              border: '1px solid #ccc', 
              fontSize: '1rem' 
            }}
            disabled={loading}
          />
        </div>
        
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: loading ? '#ccc' : '#6a0dad', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6c757d' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6a0dad', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}