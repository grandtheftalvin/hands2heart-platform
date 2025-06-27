import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout, updateUser } from '../utils/auth';
import './DonorProfile.css';

function DonorProfile() {
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
    const fetchUserProfile = async () => {
      try {
        const userData = getUser();
        if (!userData) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        });

        if (response.ok) {
          const userProfile = await response.json();
          setUser(userProfile);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

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
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
        
        // Update localStorage
        updateUser(updatedUser);
        
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
    logout();
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
        <h1>My Profile</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate('/dashboard/donor')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/donor/notifications')}
            className="btn btn-secondary"
          >
            Notifications
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
              {user?.name?.charAt(0).toUpperCase() || 'U'}
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
                <span className="user-type donor">Donor</span>
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
          <h3>Your Activity</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Bids</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Approved Bids</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Completed Purchases</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Kshs 0</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorProfile; 