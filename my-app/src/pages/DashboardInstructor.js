// File: client/src/pages/DashboardInstructor.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser, logout } from '../utils/auth';
import './DashboardInstructor.css'; // Import the vanilla CSS

function DashboardInstructor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    price: ''
  });
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [user, setUser] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    fetchBids();
    const userData = getUser();
    setUser(userData);
  }, []);

  const fetchBids = async () => {
    setLoadingBids(true);
    try {
      const user = getUser();
      if (!user) return;
      const res = await fetch(`http://localhost:5000/api/bids/instructor/${user.id}`);
      let data = await res.json();
      if (!Array.isArray(data)) {
        data = [];
      }
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setBids([]);
    } finally {
      setLoadingBids(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('image', formData.image);
    form.append('price', formData.price);
    const user = getUser();
    if (user) form.append('instructor_id', user.id);

    try {
      const response = await fetch('http://localhost:5000/api/artefacts', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Artefact uploaded successfully! Pending admin approval.');
        setFormData({ title: '', description: '', image: null, price: '' });
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while uploading.');
    }
  };

  const handleApprove = async (bidId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids/${bidId}/approve`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Bid approved!');
        setBids(bids.map(b => b.id === bidId ? { ...b, status: 'approved' } : b));
      } else {
        toast.error(data.message || 'Approval failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  return (
    <div className="instructor-dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="instructor-sidebar" style={{
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
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Instructor Panel</h2>
        </div>
        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '20px 0' }}>
          <div style={{ padding: '0 20px' }}>
            <button
              onClick={() => navigate('/instructor/artefacts')}
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
              View My Artefacts
            </button>
            <button
              onClick={() => document.getElementById('upload-artefact-section').scrollIntoView({ behavior: 'smooth' })}
              className="sidebar-nav-btn"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: hoveredBtn === 'upload' ? 'rgba(255,255,255,0.15)' : 'transparent',
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
              onMouseEnter={() => setHoveredBtn('upload')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{ fontSize: '1.2rem' }}>⬆️</span>
              Upload Artefact
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
            onClick={() => navigate('/instructor/profile')}
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
              {user?.name || 'Instructor'}
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
      <div className="instructor-main-content" style={{ flex: 1, padding: '20px', background: '#f8f9fa', color: '#222' }}>
        <ToastContainer />
        <div className="dashboard-content-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          <div className="dashboard-card" id="upload-artefact-section" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #ececec', padding: '2rem', minWidth: 320, maxWidth: 400, flex: '1 1 320px' }}>
            <h2 className="section-title text-xl font-semibold mb-2" style={{ color: '#f97316', fontWeight: 700 }}>Upload Artefact</h2>
            <form onSubmit={handleSubmit} className="upload-form space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full p-2 border rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="block w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Suggested Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="block w-full p-2 border rounded"
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                required
                className="block w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Upload
              </button>
            </form>
          </div>
          <div className="dashboard-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #ececec', padding: '2rem', minWidth: 320, maxWidth: 400, flex: '1 1 320px' }}>
            <h2 className="section-title text-xl font-semibold mb-2" style={{ color: '#f97316', fontWeight: 700 }}>Bids on Your Artefacts</h2>
            {loadingBids ? (
              <div className="loading">Loading bids...</div>
            ) : bids.length === 0 ? (
              <div className="no-bids">No bids yet.</div>
            ) : (
              <div className="bids-list">
                {bids.map((bid) => (
                  <div key={bid.id} className={`bid-card ${bid.status === 'approved' ? 'approved' : ''}`}>
                    <div className="bid-info">
                      <div><strong>Artefact:</strong> {bid.artefact_title}</div>
                      <div><strong>Donor:</strong> {bid.donor_name} ({bid.donor_email})</div>
                      <div><strong>Amount:</strong> Kshs {bid.amount}</div>
                      <div><strong>Status:</strong> <span className={bid.status === 'approved' ? 'approved-status' : 'pending-status'}>{bid.status}</span></div>
                    </div>
                    {bid.status !== 'approved' && (
                      <button className="btn btn-success" onClick={() => handleApprove(bid.id)}>
                        Approve
                      </button>
                    )}
                    {bid.status === 'approved' && (
                      <span className="approved-badge">Approved</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInstructor;