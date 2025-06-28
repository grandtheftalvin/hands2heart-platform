// File: client/src/pages/DashboardDonor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import './DashboardDonor.css';

function DashboardDonor() {
  const [artefacts, setArtefacts] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtefacts();
    fetchNotificationCount();
  }, []);

  const fetchArtefacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/artefacts?status=approved&stock=in_stock');
      const data = await response.json();
      setArtefacts(data);
    } catch (error) {
      console.error('Error fetching artefacts:', error);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const userData = getUser();
      if (!userData) return;

      const response = await fetch(`http://localhost:5000/api/bids/approved/${userData.id}`);
      const approvedBids = await response.json();
      const unpaidBids = approvedBids.filter(bid => !bid.paid);
      setNotificationCount(unpaidBids.length);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard p-6">
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donor Dashboard</h1>
        <div className="dashboard-buttons">
          <button
            onClick={() => navigate('/donor/artefacts')}
            className="dashboard-btn primary-btn"
          >
            View Artefacts
          </button>
          <button
            onClick={() => navigate('/donor/my-bids')}
            className="dashboard-btn secondary-btn"
          >
            My Bids
          </button>
          <div className="notification-container">
            <button
              onClick={() => navigate('/donor/notifications')}
              className="dashboard-btn notification-btn"
            >
              Notifications
              {notificationCount > 0 && (
                <span className="notification-badge">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => navigate('/donor/profile')}
            className="dashboard-btn profile-btn"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="dashboard-btn logout-btn"
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
