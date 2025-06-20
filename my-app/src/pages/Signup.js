// File: client/src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mb-4 w-full p-2 border rounded"
        >
          <option value="donor">Donor</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
