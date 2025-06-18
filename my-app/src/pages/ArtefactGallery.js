// File: client/src/pages/ArtefactGallery.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function ArtefactGallery() {
  const [artefacts, setArtefacts] = useState([]);
  const [donation, setDonation] = useState({});
  const [edit, setEdit] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchArtefacts = async () => {
      const res = await axios.get('http://localhost:5000/api/artefacts', {
        headers: { Authorization: token }
      });
      setArtefacts(res.data);
    };
    fetchArtefacts();
  }, [token]);

  const handleDonate = async (id) => {
    const amount = donation[id];
    if (!amount || amount <= 0) return alert('Enter a valid amount');
    try {
      await axios.post(`http://localhost:5000/api/artefacts/${id}/donate`, { amount }, {
        headers: { Authorization: token }
      });
      alert('Donation successful!');
      setDonation({ ...donation, [id]: '' });
    } catch (err) {
      alert('Donation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artefact?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/artefacts/${id}`, {
        headers: { Authorization: token }
      });
      setArtefacts(artefacts.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete artefact.');
    }
  };

  const handleEdit = (art) => {
    setEdit(art.id);
    setEditForm({ title: art.title, description: art.description });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/artefacts/${id}`, editForm, {
        headers: { Authorization: token }
      });
      const updated = artefacts.map(a => a.id === id ? { ...a, ...editForm } : a);
      setArtefacts(updated);
      setEdit(null);
    } catch (err) {
      alert('Failed to update artefact.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Available Artefacts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artefacts.filter(art => art.is_approved).map(art => (
          <div key={art.id} className="border border-gray-300 bg-white p-4 rounded shadow-md">
            <img src={`http://localhost:5000/uploads/${art.image}`} alt={art.title} className="w-full h-48 object-cover rounded mb-3" />
            {edit === art.id ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 border mb-2"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                />
                <textarea
                  className="w-full p-2 border mb-2"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
                <button onClick={() => handleUpdate(art.id)} className="w-full bg-blue-600 text-white py-2 mb-2">Save</button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800">{art.title}</h3>
                <p className="text-gray-600 mb-2">{art.description}</p>
              </>
            )}
            <input
              type="number"
              placeholder="Enter donation amount"
              className="w-full p-2 border mb-2"
              value={donation[art.id] || ''}
              onChange={e => setDonation({ ...donation, [art.id]: e.target.value })}
            />
            <button onClick={() => handleDonate(art.id)} className="w-full bg-green-600 text-white py-2 mb-2">Donate</button>
            <button onClick={() => handleDelete(art.id)} className="w-full bg-red-500 text-white py-2 mb-2">Delete</button>
            {edit !== art.id && (
              <button onClick={() => handleEdit(art)} className="w-full bg-yellow-500 text-white py-2">Edit</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtefactGallery;
