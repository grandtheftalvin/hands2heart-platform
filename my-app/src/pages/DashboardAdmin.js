// File: client/src/pages/DashboardAdmin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArtefactImage from '../components/ArtefactImage';
import './DashboardAdmin.css';
import { getUser } from '../utils/auth';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

function DashboardAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingArtefacts, setPendingArtefacts] = useState([]);
  const [pendingBids, setPendingBids] = useState([]);
  const [activeTab, setActiveTab] = useState('artefacts'); // 'artefacts' or 'bids'
  const [user, setUser] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchArtefacts();
    fetchPendingBids();
    const userData = getUser();
    setUser(userData);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch bid statistics
  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bids/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch pending artefacts
  const fetchArtefacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/artefacts?status=pending');
      const data = await res.json();
      setPendingArtefacts(data);
    } catch (err) {
      console.error('Error fetching pending artefacts:', err);
    }
  };

  // Fetch pending bids
  const fetchPendingBids = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bids/pending');
      const data = await res.json();
      setPendingBids(data);
    } catch (err) {
      console.error('Error fetching pending bids:', err);
    }
  };

  const handleArtefactAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/artefacts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`Artefact ${status}`);
        fetchArtefacts();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Action error:', err);
      toast.error('Server error');
    }
  };

  const handleBidAction = async (bidId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids/${bidId}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`Bid ${action}d successfully`);
        fetchPendingBids();
        fetchStats(); // Refresh stats
      } else {
        toast.error(result.message || 'Action failed');
      }
    } catch (err) {
      console.error('Bid action error:', err);
      toast.error('Server error');
    }
  };

  return (
    <div className="admin-dashboard-bg">
      <div className="admin-dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
        <ToastContainer />
        
        {/* Sidebar */}
        <div className="admin-sidebar">
          {/* Logo/Title */}
          <div className="sidebar-logo-title">
            <h2>Admin Panel</h2>
          </div>
          
          {/* Navigation Links */}
          <div className="sidebar-nav-links">
            <button
              onClick={() => setActiveTab('artefacts')}
              className={`sidebar-nav-btn ${activeTab === 'artefacts' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredBtn('artefacts')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span>📦</span>
              Pending Artefacts ({pendingArtefacts.length})
            </button>
            
            <button
              onClick={() => setActiveTab('bids')}
              className={`sidebar-nav-btn ${activeTab === 'bids' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredBtn('bids')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span>💰</span>
              Pending Bids ({pendingBids.length})
            </button>
            
            <button
              onClick={() => navigate('/admin/users')}
              className="sidebar-nav-btn"
              onMouseEnter={() => setHoveredBtn('users')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span>👥</span>
              Manage Users
            </button>
          </div>
          {/* Profile and Logout at Bottom */}
          <div className="sidebar-profile-section">
            <button
              onClick={() => navigate('/admin/profile')}
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
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <span className="sidebar-profile-name">{user?.name || 'Admin'}</span>
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
        <div className="admin-dashboard-main-content">
          <div className="admin-dashboard-paragraph-container">
            <p className="main-paragraph admin-dashboard-paragraph">
              Welcome to the admin dashboard. Here you can manage artefacts, bids, and users.
            </p>
          </div>
          <div className="admin-dashboard-content-section">
            {/* Stats Section */}
            {stats ? (
              <div className="admin-dashboard-black-container">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
                  <div className="bg-white p-4 shadow rounded" style={{ minWidth: 220, maxWidth: 260, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#f97316', fontWeight: 700, marginBottom: 8 }}>Total Bids</h2>
                    <p className="text-xl" style={{ fontWeight: 700, fontSize: '2rem', color: '#222' }}>{stats.totalBids}</p>
                  </div>
                  <div className="bg-white p-4 shadow rounded" style={{ minWidth: 220, maxWidth: 260, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#f97316', fontWeight: 700, marginBottom: 8 }}>Approved Bids</h2>
                    <p className="text-xl" style={{ fontWeight: 700, fontSize: '2rem', color: '#222' }}>{stats.totalApproved}</p>
                  </div>
                  <div className="bg-white p-4 shadow rounded" style={{ minWidth: 220, maxWidth: 260, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#f97316', fontWeight: 700, marginBottom: 8 }}>Paid Bids</h2>
                    <p className="text-xl" style={{ fontWeight: 700, fontSize: '2rem', color: '#222' }}>{stats.totalPaid}</p>
                  </div>
                  <div className="bg-white p-4 shadow rounded" style={{ minWidth: 220, maxWidth: 260, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #ececec', color: '#222', margin: '0 0.5rem', flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#f97316', fontWeight: 700, marginBottom: 8 }}>Total Donations</h2>
                    <p className="text-xl" style={{ fontWeight: 700, fontSize: '2rem', color: '#222' }}>Kshs {stats.totalDonations?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: '#fff', fontWeight: 500 }}>Loading stats...</p>
            )}
            {/* Content Section */}
            <div className="admin-dashboard-black-container">
              {/* Pending Artefacts Section */}
              {activeTab === 'artefacts' && (
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#f97316', fontWeight: 700 }}>Pending Artefacts</h2>
                  {pendingArtefacts.length === 0 ? (
                    <p className="no-artefacts" style={{ color: '#fff', fontWeight: 500 }}>No pending artefacts at the moment.</p>
                  ) : (
                    <div className="artefact-grid">
                      {pendingArtefacts.map((a) => (
                        <div key={a.id} className="artefact-card" style={{ background: '#fff', border: '1px solid #ececec', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', color: '#222' }}>
                          <ArtefactImage 
                            imageUrl={a.image_url}
                            title={a.title}
                            dimensions={{ width: '100%', height: '250px' }}
                          />
                          <div className="card-content">
                            <h2 style={{ color: '#f97316', fontWeight: 700 }}>{a.title}</h2>
                            <p style={{ color: '#333' }}>{a.description}</p>
                            <p className="price" style={{ color: '#ea580c', fontWeight: 600 }}>Price: Kshs {a.price}</p>
                            <div className="button-group">
                              <button onClick={() => handleArtefactAction(a.id, 'approved')} className="approve-btn">
                                Approve
                              </button>
                              <button onClick={() => handleArtefactAction(a.id, 'rejected')} className="reject-btn">
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Pending Bids Section */}
              {activeTab === 'bids' && (
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#f97316', fontWeight: 700 }}>Pending Bids</h2>
                  {pendingBids.length === 0 ? (
                    <p className="no-bids" style={{ color: '#fff', fontWeight: 500 }}>No pending bids at the moment.</p>
                  ) : (
                    <div className="bids-list">
                      {pendingBids.map((bid) => (
                        <div key={bid.id} className="bid-card" style={{ background: '#fff', border: '1px solid #ececec', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', color: '#222' }}>
                          <div className="bid-info">
                            <div><strong>Artefact:</strong> <span style={{ color: '#ea580c' }}>{bid.artefact_title}</span></div>
                            <div><strong>Donor:</strong> {bid.donor_name} ({bid.donor_email})</div>
                            <div><strong>Amount:</strong> <span style={{ color: '#ea580c' }}>Kshs {bid.amount}</span></div>
                            <div><strong>Status:</strong> <span className="pending-status" style={{ color: '#f97316', fontWeight: 600 }}>{bid.status}</span></div>
                          </div>
                          <div className="button-group">
                            <button className="approve-btn" onClick={() => handleBidAction(bid.id, 'approve')}>
                              Approve
                            </button>
                            <button className="reject-btn" onClick={() => handleBidAction(bid.id, 'reject')}>
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
