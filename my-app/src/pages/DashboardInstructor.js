// File: client/src/pages/DashboardInstructor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashboardInstructor.css'; // Import the vanilla CSS

function DashboardInstructor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    price: ''
  });

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('image', formData.image);
    form.append('price', formData.price);

    try {
      const response = await fetch('http://localhost:5000/api/artefacts', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Artefact uploaded successfully! Pending admin approval.');
        setFormData({ title: '', description: '', image: null, price: '' });
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while uploading.');
    }
  };

  return (
    <div className="instructor-dashboard p-6">
      <ToastContainer />
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/instructor/artefacts')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View My Artefacts
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="section-title text-xl font-semibold mb-2">Upload Artefact</h2>

      <form onSubmit={handleSubmit} className="upload-form space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Suggested Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default DashboardInstructor;