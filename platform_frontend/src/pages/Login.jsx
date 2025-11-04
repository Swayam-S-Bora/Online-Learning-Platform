import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      console.log('Login token:', res.data.token);

      const userData = { 
        username: email.split('@')[0], 
        email: email 
      };
      
      onLogin(res.data.token, userData);
      navigate('/'); // redirect after successful login
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        margin: '80px auto',
        padding: '40px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '32px',
          color: '#1e293b',
          fontSize: '24px',
          margin: 0
        }}>
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <button type="submit" style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.background = '#2563eb'}
          onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
          >
            Login
          </button>
        </form>
        {error && (
          <p style={{
            color: '#dc2626',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '16px',
            margin: 0
          }}>
            {error}
          </p>
        )}
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          marginTop: '24px',
          margin: '24px 0 0 0'
        }}>
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')}
            style={{
              color: '#2563eb',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;