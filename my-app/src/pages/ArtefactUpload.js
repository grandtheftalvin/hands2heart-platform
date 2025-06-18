import { useState } from 'react';
import axios from 'axios';

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
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload Artefact</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" className="w-full p-2 border" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Description" className="w-full p-2 border" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        <input type="file" className="w-full" onChange={e => setImage(e.target.files[0])} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2">Upload</button>
      </form>
    </div>
  );
}

export default ArtefactUpload;