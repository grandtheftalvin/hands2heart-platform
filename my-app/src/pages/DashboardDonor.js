// File: client/src/pages/DashboardDonor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardDonor.css';

function DashboardDonor() {
  const [artefacts, setArtefacts] = useState([]);
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard p-6">
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donor Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/donor/artefacts')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Artefacts
          </button>
          <button
            onClick={() => navigate('/donor/my-bids')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            My Bids
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {artefacts.length === 0 ? (
        <p>No artefacts available at the moment.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {artefacts.map((artefact) => (
            <div key={artefact.id} className="artefact-card bg-white shadow rounded overflow-hidden">
              <img
                src={`http://localhost:5000/uploads/${artefact.image_url}`}
                alt={artefact.title}
                className="artefact-image w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="artefact-title text-lg font-semibold mb-2">{artefact.title}</h2>
                <p className="artefact-description mb-2">{artefact.description}</p>
                <p className="artefact-price font-semibold mb-4">Price: Kshs {artefact.price}</p>
                <button
                  onClick={() => navigate(`/donor/bid/${artefact.id}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardDonor;
