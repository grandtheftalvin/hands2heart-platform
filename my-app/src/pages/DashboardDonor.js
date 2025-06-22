// File: client/src/pages/DashboardDonor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donor Dashboard</h1>
        <button
          onClick={() => navigate('/donor/artefacts')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Artefacts
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {artefacts.map((artefact) => (
          <div key={artefact.id} className="border p-4 rounded shadow">
            <img
              src={`http://localhost:5000/uploads/${artefact.image_url}`}
              alt={artefact.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-bold">{artefact.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{artefact.description}</p>
            <p className="text-sm text-gray-800 font-semibold mb-2">Price: ${artefact.price}</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={bid[artefact.id] || ''}
              onChange={(e) => handleBidChange(e, artefact.id)}
              className="w-full p-1 border rounded mb-2"
            />
            <button
              onClick={() => handleBidSubmit(artefact.id)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Donate / Bid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardDonor;