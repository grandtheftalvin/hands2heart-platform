// File: client/src/pages/DashboardDonor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import './DashboardDonor.css';
import DonationModal from '../components/DonationModal';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

function DashboardDonor() {
  const [artefacts, setArtefacts] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    fetchArtefacts();
    fetchNotificationCount();
    const userData = getUser();
    setUser(userData);
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
    <div className="donor-dashboard-bg">
      <div className="donor-dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className="donor-sidebar">
          {/* Logo/Title */}
          <div className="sidebar-logo-title">
            <h2>Donor Panel</h2>
          </div>
          {/* Navigation Links */}
          <div className="sidebar-nav-links">
            <button
              onClick={() => navigate('/donor/artefacts')}
              className="sidebar-nav-btn"
              onMouseEnter={() => setHoveredBtn('artefacts')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span>🖼️</span>
              View Artefacts
            </button>
            <button
              onClick={() => navigate('/donor/my-bids')}
              className="sidebar-nav-btn"
              onMouseEnter={() => setHoveredBtn('bids')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span>💸</span>
              My Bids
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => navigate('/donor/notifications')}
                className="sidebar-nav-btn"
                onMouseEnter={() => setHoveredBtn('notifications')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{ position: 'relative' }}
              >
                <span>🔔</span>
                Notifications
                {notificationCount > 0 && (
                  <span className="notification-badge" style={{ position: 'absolute', top: 8, right: 16 }}>{notificationCount}</span>
                )}
              </button>
            </div>
          </div>
          {/* Profile and Logout at Bottom */}
          <div className="sidebar-profile-section">
            <button
              onClick={() => navigate('/donor/profile')}
              className="sidebar-profile-avatar"
              title="Profile"
            >
              {user?.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt="Profile"
                  className="sidebar-avatar-img"
                />
              ) : (
                <div className="sidebar-avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span className="sidebar-profile-name">{user?.name || 'Donor'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="sidebar-logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Main Content */}
        <div className="donor-dashboard-main-content">
          <div className="donor-dashboard-paragraph-container">
            <p className="main-paragraph donor-dashboard-paragraph">
              Connecting special needs schools with donors, partners, and supporters, our platform provides 
              a space to showcase and support the creativity of learners with special needs. 
              By bridging this gap, we foster inclusion, awareness, and meaningful opportunities for collaboration and impact.<br/><br/>
              Join us in making a difference in the lives of learners with special needs.
            </p>
          </div>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <button
              className="dashboard-btn white-btn"
              style={{ fontWeight: 700, fontSize: '1.1rem', border: '2px solid #f97316', color: '#f97316', borderRadius: '8px', padding: '12px 32px', margin: '0 auto', display: 'inline-block', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
              onClick={() => setShowDonationModal(true)}
            >
              Donate
            </button>
          </div>
          {showDonationModal && (
            <DonationModal onClose={() => setShowDonationModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardDonor;
