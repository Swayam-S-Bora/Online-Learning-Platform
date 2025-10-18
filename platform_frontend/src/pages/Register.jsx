import React, { useState } from 'react';
import axios from '../api/axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
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
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {message && <p style={{color:'green'}}>{message}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
};

export default Register;
