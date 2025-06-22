import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DashboardAdmin() {
  const [pendingArtefacts, setPendingArtefacts] = useState([]);

  useEffect(() => {
    fetchArtefacts();
  }, []);

  const fetchArtefacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/artefacts?status=pending');
      const data = await res.json();
      setPendingArtefacts(data);
    } catch (err) {
      console.error('Error fetching pending artefacts:', err);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/artefacts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Artefact ${status}`);
        fetchArtefacts();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Action error:', err);
      toast.error('Server error');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Admin Artefact Moderation</h1>
      {pendingArtefacts.length === 0 ? (
        <p className="text-gray-600">No pending artefacts at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {pendingArtefacts.map((a) => (
            <div key={a.id} className="border rounded shadow p-4">
              <img src={`http://localhost:5000/uploads/${a.image_url}`} alt={a.title} className="w-full h-48 object-cover mb-2 rounded" />
              <h2 className="text-lg font-bold">{a.title}</h2>
              <p className="text-sm text-gray-700">{a.description}</p>
              <p className="text-sm font-semibold">Price: ${a.price}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleAction(a.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>
                <button onClick={() => handleAction(a.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
