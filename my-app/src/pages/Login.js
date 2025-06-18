// File: client/src/pages/Login.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.role === 'admin') navigate('/dashboard/admin');
      else if (res.data.role === 'donor') navigate('/dashboard/donor');
      else if (res.data.role === 'instructor') navigate('/dashboard/instructor');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;