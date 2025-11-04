import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const res = await axios.post('/auth/register', {
        username,
        email,
        password
      });
      setMessage(res.data.msg);
      setUsername('');
      setEmail('');
      setPassword('');
      
      // Auto login after successful registration
      setTimeout(async () => {
        try {
          const loginRes = await axios.post('/auth/login', { email, password });
          const userData = { username, email };
          onRegister(loginRes.data.token, userData);
          navigate('/');
        } catch (loginErr) {
          console.error('Auto login failed:', loginErr);
          navigate('/login');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
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
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={e => setUsername(e.target.value)} 
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
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
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
              onChange={e => setPassword(e.target.value)} 
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
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
      </form>
        {message && (
          <p style={{
            color: '#059669',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '16px',
            margin: 0
          }}>
            {message}
          </p>
        )}
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
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            style={{
              color: '#2563eb',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logi
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
