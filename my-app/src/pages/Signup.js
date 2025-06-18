// File: client/src/pages/Signup.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="w-full p-2 border rounded" type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
          <select className="w-full p-2 border rounded" onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="donor">Donor</option>\n            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
