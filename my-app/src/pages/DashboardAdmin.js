// File: client/src/pages/DashboardAdmin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashboardAdmin.css';

function DashboardAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingArtefacts, setPendingArtefacts] = useState([]);
  const [pendingBids, setPendingBids] = useState([]);
  const [activeTab, setActiveTab] = useState('artefacts'); // 'artefacts' or 'bids'

  useEffect(() => {
    fetchStats();
    fetchArtefacts();
    fetchPendingBids();
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
    <div className="admin-dashboard p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/admin/profile')}
            className="tab-btn"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="tab-btn"
          >
            Manage Users
          </button>
          <button
            onClick={handleLogout}
            className="tab-btn"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {stats ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Total Bids</h2>
            <p className="text-xl">{stats.totalBids}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Approved Bids</h2>
            <p className="text-xl">{stats.totalApproved}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Paid Bids</h2>
            <p className="text-xl">{stats.totalPaid}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Total Donations</h2>
            <p className="text-xl">Kshs {stats.totalDonations?.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('artefacts')}
          className={`tab-btn ${activeTab === 'artefacts' ? 'active' : ''}`}
        >
          Pending Artefacts ({pendingArtefacts.length})
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`tab-btn ${activeTab === 'bids' ? 'active' : ''}`}
        >
          Pending Bids ({pendingBids.length})
        </button>
      </div>

      {/* Pending Artefacts Section */}
      {activeTab === 'artefacts' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pending Artefacts</h2>
          {pendingArtefacts.length === 0 ? (
            <p className="no-artefacts">No pending artefacts at the moment.</p>
          ) : (
            <div className="artefact-grid">
              {pendingArtefacts.map((a) => (
                <div key={a.id} className="artefact-card">
                  <img src={`http://localhost:5000/uploads/${a.image_url}`} alt={a.title} />
                  <div className="card-content">
                    <h2>{a.title}</h2>
                    <p>{a.description}</p>
                    <p className="price">Price: Kshs {a.price}</p>
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
          <h2 className="text-xl font-bold mb-4">Pending Bids</h2>
          {pendingBids.length === 0 ? (
            <p className="no-bids">No pending bids at the moment.</p>
          ) : (
            <div className="bids-grid">
              {pendingBids.map((bid) => (
                <div key={bid.id} className="bid-card">
                  <div className="bid-header">
                    <h3 className="text-lg font-semibold">{bid.artefact_title}</h3>
                    <span className="bid-amount">Kshs {bid.amount?.toLocaleString()}</span>
                  </div>
                  <div className="bid-details">
                    <p><strong>Donor:</strong> {bid.donor_name}</p>
                    <p><strong>Bid ID:</strong> {bid.id}</p>
                  </div>
                  <div className="bid-actions">
                    <button
                      onClick={() => handleBidAction(bid.id, 'approve')}
                      className="approve-btn"
                    >
                      Approve Bid
                    </button>
                    <button
                      onClick={() => handleBidAction(bid.id, 'reject')}
                      className="reject-btn"
                    >
                      Reject Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
