// File: client/src/pages/DashboardAdmin.js
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashboardAdmin.css';

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
    <div className="admin-dashboard">
      <ToastContainer />
      <h1>Admin Artefact Moderation</h1>

      {pendingArtefacts.length === 0 ? (
        <p className="no-artefacts">No pending artefacts at the moment.</p>
      ) : (
        <div className="artefact-grid">
          {pendingArtefacts.map((a) => (
            <div key={a.id} className="artefact-card">
              <img src={`http://localhost:5000/uploads/${a.image_url}`} alt={a.title} />
              <div className="card-content">
                <h2>{a.title}</h2>
                <p>{a.description}</p>
                <p className="price">Price: ${a.price}</p>
                <div className="button-group">
                  <button onClick={() => handleAction(a.id, 'approved')} className="approve-btn">Approve</button>
                  <button onClick={() => handleAction(a.id, 'rejected')} className="reject-btn">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
