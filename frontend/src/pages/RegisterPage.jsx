import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage({ setToken, setUser }){
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(''); 
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  
  const submit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErr('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setErr('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setErr('');
      await api.post('/auth/register', { username, email, password });
      alert('Registration successful! Please login with your credentials.');
      nav('/');
    } catch(err) { 
      setErr(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
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
        <h2 style={{ color: '#6a0dad', textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
        {err && <div style={{ color: 'red', backgroundColor: '#f8d7da', padding: '0.5rem', borderRadius: '5px', marginBottom: '1rem', border: '1px solid #f5c6cb' }}>{err}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>Username</label>
            <input 
              type="text"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>Email</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
              placeholder="Enter your password (min 6 characters)"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: loading ? '#ccc' : '#6a0dad', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6c757d' }}>
          Already have an account? <Link to="/" style={{ color: '#6a0dad', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
