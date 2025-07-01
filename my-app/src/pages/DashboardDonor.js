// File: client/src/pages/DashboardDonor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import './DashboardDonor.css';
import DonationModal from '../components/DonationModal';

function DashboardDonor() {
  const [artefacts, setArtefacts] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDonationModal, setShowDonationModal] = useState(false);
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
            className="dashboard-btn white-btn"
          >
            View Artefacts
          </button>
          <button
            onClick={() => navigate('/donor/my-bids')}
            className="dashboard-btn white-btn"
          >
            My Bids
          </button>
          <div className="notification-container">
            <button
              onClick={() => navigate('/donor/notifications')}
              className="dashboard-btn white-btn"
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
            className="dashboard-btn white-btn"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="dashboard-btn white-btn"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-landing-content">
        <p className="main-paragraph">
          Connecting special needs schools with donors, partners, and supporters, our platform provides 
          a space to showcase and support the creativity of learners with special needs. 
          By bridging this gap, we foster inclusion, awareness, and meaningful opportunities for collaboration and impact.
        </p>
        <p className="main-paragraph">
          Join us in making a difference in the lives of learners with special needs.
        </p>
      </div>

      <div style={{ margin: '2rem 0', textAlign: 'center' }}>
        <button
          className="dashboard-btn white-btn"
          style={{ fontWeight: 700, fontSize: '1.1rem', border: '2px solid #f97316', color: '#f97316', borderRadius: '8px', padding: '12px 32px', margin: '0 auto', display: 'inline-block' }}
          onClick={() => setShowDonationModal(true)}
        >
          Donate
        </button>
      </div>

      {showDonationModal && (
        <DonationModal onClose={() => setShowDonationModal(false)} />
      )}
    </div>
  );
}

export default DashboardDonor;
