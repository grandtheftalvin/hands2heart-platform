// File: client/src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css'; // Import the CSS
import Loginimage from '../pages/Login-image.jpeg';
import givingHand from '../pages/orange-hand.jpg';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.verificationSent) {
        toast.success(data.message);
        setTimeout(() => navigate('/login'), 4000);
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
  <div className="signup-page">
      <ToastContainer />
    <div className="Signup-form-container">
       {/* <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
        </div>  */}
        <div className="signup">
          <h2>Create an account</h2>
          <p>Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#f97316', cursor: 'pointer' }}>Login</span></p>
        </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="donor">Donor</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit">Sign Up</button>
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

export default Signup;
