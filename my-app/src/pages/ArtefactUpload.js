// File: client/src/pages/ArtefactUpload.js
import { useState } from 'react';
import axios from 'axios';
import './ArtefactUpload.css';

function ArtefactUpload() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/artefacts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });
      alert('Artefact uploaded successfully');
      setForm({ title: '', description: '' });
      setImage(null);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="artefact-upload">
      <h2>Upload Artefact</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default ArtefactUpload;
