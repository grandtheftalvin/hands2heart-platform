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

  useEffect(() => {
    fetchBids();
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
    <div className="instructor-dashboard-gradient">
      <ToastContainer />
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/instructor/artefacts')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View My Artefacts
          </button>
          <button
            onClick={() => navigate('/instructor/profile')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <h2 className="section-title text-xl font-semibold mb-2">Upload Artefact</h2>
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
        <div className="dashboard-card">
          <h2 className="section-title text-xl font-semibold mb-2">Bids on Your Artefacts</h2>
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
  );
}

export default DashboardInstructor;