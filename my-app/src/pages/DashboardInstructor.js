// File: client/src/pages/DashboardInstructor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DashboardInstructor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', image: null, price: '' });

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
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <button
          onClick={() => navigate('/instructor/artefacts')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View My Artefacts
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Upload Artefact</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="block w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="block w-full p-2 border rounded" required />
        <input type="number" name="price" placeholder="Suggested Price" value={formData.price} onChange={handleChange} className="block w-full p-2 border rounded" required />
        <input type="file" name="image" onChange={handleChange} className="block w-full p-2 border rounded" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Upload</button>
      </form>
    </div>
  );
}

export default DashboardInstructor;