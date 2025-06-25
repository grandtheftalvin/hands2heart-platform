// File: client/src/pages/DashboardDonor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardDonor.css';

function DashboardDonor() {
  const [artefacts, setArtefacts] = useState([]);
  const [bid, setBid] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artefacts?status=approved&stock=in_stock');
        const data = await response.json();
        setArtefacts(data);
      } catch (error) {
        console.error('Error fetching artefacts:', error);
      }
    };

    fetchArtefacts();
  }, []);

  const handleBidChange = (e, id) => {
    setBid({ ...bid, [id]: e.target.value });
  };

  const handleBidSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artefact_id: id, amount: bid[id] }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Bid of $${bid[id]} submitted successfully.`);
      } else {
        alert(data.message || 'Bid failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting the bid.');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
        <button onClick={() => navigate('/donor/artefacts')}>View Artefacts</button>
      </div>

      {artefacts.length === 0 ? (
        <p>No artefacts available at the moment.</p>
      ) : (
        artefacts.map((artefact) => (
          <div key={artefact._id} className="artefact-card">
            <img src={`http://localhost:5000/uploads/${artefact.image_url}`} alt={artefact.title} className="artefact-image" />
            <div className="artefact-price">Price: Kshs{artefact.price}</div>
            <div className="artefact-title">{artefact.title}</div>
            <p>{artefact.description}</p>
            <div className="bid-section">
              <input
                type="number"
                placeholder="Enter your bid"
                value={bid[artefact._id] || ''}
                onChange={(e) => handleBidChange(e, artefact._id)}
              />
              <button onClick={() => handleBidSubmit(artefact._id)}>Submit Bid</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardDonor;
