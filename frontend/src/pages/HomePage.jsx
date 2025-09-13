import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function HomePage({ token, setToken, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert('Enter email and password');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password) return alert('Enter all fields');
    try {
      await api.post('/auth/register', { username, email, password });
      alert('Registration successful! Please login.');
      setIsLogin(true);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ color: '#6a0dad', fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to FocusBlock</h1>
      
      <div style={{ marginBottom: '2rem', textAlign: 'left', backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
        <h2 style={{ color: '#6a0dad', marginBottom: '1rem' }}>About FocusBlock</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          FocusBlock is a powerful productivity tool designed to help you stay focused and eliminate digital distractions. 
          Whether you're studying, working, or trying to maintain better digital habits, FocusBlock allows you to:
        </p>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Block distracting websites and applications</li>
          <li>Create custom block lists for different activities</li>
          <li>Track your productivity and focus time</li>
          <li>Set up scheduled blocking sessions</li>
          <li>Get insights into your browsing habits</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginTop: '1rem', fontStyle: 'italic', color: '#6c757d' }}>
          Take control of your digital environment and boost your productivity today!
        </p>
      </div>

      {!token && (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isLogin ? '#6a0dad' : '#e9ecef',
                color: isLogin ? 'white' : '#6a0dad',
                border: 'none',
                borderRadius: '5px 0 0 5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: !isLogin ? '#6a0dad' : '#e9ecef',
                color: !isLogin ? 'white' : '#6a0dad',
                border: 'none',
                borderRadius: '0 5px 5px 0',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Register
            </button>
          </div>

          <h2 style={{ color: '#6a0dad', textAlign: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
          
          {!isLogin && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          )}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#6a0dad',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      )}
    </div>
  );
}