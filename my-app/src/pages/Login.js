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
      <div className="login">
          <h1 className="fline">Welcome back to</h1>
          <h1 className="sline">Hands2Heart</h1>
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
        
        <div className="no-acc">
            <p>Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#f97316', cursor: 'pointer' }}>Sign Up</span></p>
        </div>
      </form>
      <button
        type="button"
        className="home-btn"
        onClick={() => navigate('/')}
        style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 28px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.08)', transition: 'all 0.2s' }}
      >
        Home
      </button>
      
    </div>
    </div>
  );
}

export default Login;
