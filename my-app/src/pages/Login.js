// File: client/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Import your CSS
import Loginimage from '../pages/Login-image.jpeg';
import givingHand from '../pages/orange-hand.jpg'; 
import { login } from '../utils/auth';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the auth utility to store login data
        login(data.token, data.user);
        
        toast.success('Login successful!');
        const { role } = data.user;
        const dashboardPath = `/dashboard/${role}`;
        setTimeout(() => navigate(dashboardPath), 1000);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      

      <div className="login-form-container">
      <div className="logo-section">
        <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <a href= "/forgotpassword" className="forgotpassword">
        forgotpassword?
        </a>
      </form>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          style={{ background: 'white', color: '#f97316', border: '1px solid #f97316', borderRadius: '6px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={e => e.target.style.background='#f3f3f3'}
          onMouseOut={e => e.target.style.background='white'}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ background: 'white', color: '#f97316', border: '1px solid #f97316', borderRadius: '6px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={e => e.target.style.background='#f3f3f3'}
          onMouseOut={e => e.target.style.background='white'}
        >
          Home
        </button>
      </div>
    </div>
    </div>
  );
}

export default Login;
