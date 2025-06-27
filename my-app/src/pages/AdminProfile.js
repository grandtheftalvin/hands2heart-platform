import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css';

function AdminProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`);
      const userProfile = await response.json();
      
      setUser(userProfile);
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, ...formData });
        setIsEditing(false);
        setMessage('Profile updated successfully!');
        
        // Update localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading && !user) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Admin Profile</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate('/dashboard/admin')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="btn btn-secondary"
          >
            Manage Users
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-group">
                <label>Name:</label>
                <span>{user?.name || 'Not provided'}</span>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <span>{user?.email || 'Not provided'}</span>
              </div>
              <div className="info-group">
                <label>Phone:</label>
                <span>{user?.phone || 'Not provided'}</span>
              </div>
              <div className="info-group">
                <label>Address:</label>
                <span>{user?.address || 'Not provided'}</span>
              </div>
              <div className="info-group">
                <label>Member Since:</label>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
              <div className="info-group">
                <label>User Type:</label>
                <span className="user-type admin">Administrator</span>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary edit-btn"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="254 700 000 000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-stats">
          <h3>System Overview</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Artefacts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Pending Approvals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Kshs 0</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          
          <div className="admin-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button
                onClick={() => navigate('/admin/artefacts/pending')}
                className="btn btn-warning"
              >
                Review Artefacts
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="btn btn-info"
              >
                Manage Users
              </button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="btn btn-secondary"
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile; 