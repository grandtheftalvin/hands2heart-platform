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
    <div className="donor-dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="donor-sidebar" style={{
        width: '250px',
        background: 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)',
        color: 'white',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Logo/Title */}
        <div style={{ padding: '0 20px 30px 20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Donor Panel</h2>
        </div>
        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '20px 0' }}>
          <div style={{ padding: '0 20px' }}>
            <button
              onClick={() => navigate('/donor/artefacts')}
              className="sidebar-nav-btn"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'artefacts' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={() => setHoveredBtn('artefacts')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{ fontSize: '1.2rem' }}>🖼️</span>
              View Artefacts
            </button>
            <button
              onClick={() => navigate('/donor/my-bids')}
              className="sidebar-nav-btn"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'bids' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={() => setHoveredBtn('bids')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{ fontSize: '1.2rem' }}>💸</span>
              My Bids
            </button>
            <button
              onClick={() => navigate('/donor/notifications')}
              className="sidebar-nav-btn"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'notifications' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredBtn('notifications')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              Notifications
              {notificationCount > 0 && (
                <span style={{
                  background: '#fff',
                  color: '#f97316',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: 12,
                  marginLeft: 8
                }}>{notificationCount}</span>
              )}
            </button>
          </div>
        </div>
        {/* Profile Section at Bottom */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <button
            onClick={() => navigate('/donor/profile')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            title="Profile"
          >
            {user?.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt="Profile"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.target.style.border = '3px solid rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.border = '3px solid rgba(255,255,255,0.3)'}
              />
            ) : (
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                border: '3px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {user?.name || 'Donor'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="donor-main-content" style={{ flex: 1, padding: '20px', background: '#f8f9fa', color: '#222' }}>
        {/* Stats Section (example, you can add real stats if available) */}
        {/*
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ minWidth: 220, maxWidth: 260, width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, borderRadius: 12 }}>
            <h2 style={{ color: '#f97316', fontWeight: 700, marginBottom: 8 }}>My Bids</h2>
            <p style={{ fontWeight: 700, fontSize: '2rem', color: '#222' }}>0</p>
          </div>
          <div style={{ minWidth: 220, maxWidth: 260, width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, borderRadius: 12 }}>
            <h2 style={{ color: '#f97316', fontWeight: 700, marginBottom: 8 }}>Total Donated</h2>
            <p style={{ fontWeight: 700, fontSize: '2rem', color: '#222' }}>Kshs 0</p>
          </div>
        </div>
        */}

        <div className="dashboard-landing-content" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #ececec', padding: '2rem', marginBottom: '2rem' }}>
          <p className="main-paragraph" style={{ color: '#333', fontSize: '1.1rem', marginBottom: 12 }}>
            Connecting special needs schools with donors, partners, and supporters, our platform provides 
            a space to showcase and support the creativity of learners with special needs. 
            By bridging this gap, we foster inclusion, awareness, and meaningful opportunities for collaboration and impact.
          </p>
          <p className="main-paragraph" style={{ color: '#333', fontSize: '1.1rem' }}>
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

        {/* Example: Artefact cards grid (if you want to show artefacts here) */}
        {/*
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {artefacts.map((a) => (
            <div key={a.id} style={{ minWidth: 220, maxWidth: 300, width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, borderRadius: 12 }}>
              <img src={`http://localhost:5000/uploads/${a.image_url}`} alt={a.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, background: '#f3f3f3', marginBottom: 12 }} onError={e => { e.target.onerror = null; e.target.src = '/default-artefact.png'; }} />
              <h3 style={{ color: '#f97316', fontWeight: 700 }}>{a.title}</h3>
              <p style={{ color: '#333', fontSize: '1rem' }}>{a.description}</p>
              <p style={{ color: '#ea580c', fontWeight: 600 }}>Price: Kshs {a.price}</p>
            </div>
          ))}
        </div>
        */}

        {showDonationModal && (
          <DonationModal onClose={() => setShowDonationModal(false)} />
        )}
      </div>
    </div>
  );
}

export default DashboardDonor;
