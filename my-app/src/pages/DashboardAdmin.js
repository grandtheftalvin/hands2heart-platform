// File: client/src/pages/DashboardAdmin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashboardAdmin.css';
import { getUser } from '../utils/auth';

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
    <div className="admin-dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <ToastContainer />
      
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ 
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
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Panel</h2>
        </div>
        
        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '20px 0' }}>
          <div style={{ padding: '0 20px' }}>
            <button
              onClick={() => setActiveTab('artefacts')}
              className={`sidebar-nav-btn ${activeTab === 'artefacts' ? 'active' : ''}`}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'artefacts' || activeTab === 'artefacts' ? 'rgba(255,255,255,0.15)' : 'transparent',
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
              <span style={{ fontSize: '1.2rem' }}>📦</span>
              Pending Artefacts ({pendingArtefacts.length})
            </button>
            
            <button
              onClick={() => setActiveTab('bids')}
              className={`sidebar-nav-btn ${activeTab === 'bids' ? 'active' : ''}`}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'bids' || activeTab === 'bids' ? 'rgba(255,255,255,0.15)' : 'transparent',
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
              <span style={{ fontSize: '1.2rem' }}>💰</span>
              Pending Bids ({pendingBids.length})
            </button>
            
            <button
              onClick={() => navigate('/admin/users')}
              className="sidebar-nav-btn"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'users' ? 'rgba(255,255,255,0.15)' : 'transparent',
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
              onMouseEnter={() => setHoveredBtn('users')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{ fontSize: '1.2rem' }}>👥</span>
              Manage Users
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
            onClick={() => navigate('/admin/profile')}
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
                onMouseEnter={(e) => e.target.style.border = '3px solid rgba(255,255,255,0.6)'}
                onMouseLeave={(e) => e.target.style.border = '3px solid rgba(255,255,255,0.3)'}
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
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {user?.name || 'Admin'}
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
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="admin-main-content" style={{ flex: 1, padding: '20px', background: '#f8f9fa', color: '#222' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Stats Section */}
          {stats ? (
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
          ) : (
            <p style={{ color: '#444', fontWeight: 500 }}>Loading stats...</p>
          )}

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #ececec', color: '#222' }}>
            {/* Pending Artefacts Section */}
            {activeTab === 'artefacts' && (
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ color: '#f97316', fontWeight: 700 }}>Pending Artefacts</h2>
                {pendingArtefacts.length === 0 ? (
                  <p className="no-artefacts" style={{ color: '#444', fontWeight: 500 }}>No pending artefacts at the moment.</p>
                ) : (
                  <div className="artefact-grid">
                    {pendingArtefacts.map((a) => (
                      <div key={a.id} className="artefact-card" style={{ background: '#fff', border: '1px solid #ececec', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', color: '#222' }}>
                        <img src={`http://localhost:5000/uploads/${a.image_url}`} alt={a.title} className="artefact-image universal-artefact-image" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', background: '#f3f3f3' }} onError={e => { e.target.onerror = null; e.target.src = '/default-artefact.png'; }} />
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
                  <p className="no-bids" style={{ color: '#444', fontWeight: 500 }}>No pending bids at the moment.</p>
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
  );
}

export default DashboardAdmin;
