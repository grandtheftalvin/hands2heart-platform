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
    <div className="instructor-dashboard">
      <ToastContainer />
      
      <div className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <button onClick={() => navigate('/instructor/artefacts')}>
          View My Artefacts
        </button>
      </div>

      <h2 className="section-title">Upload Artefact</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Suggested Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default DashboardInstructor;
