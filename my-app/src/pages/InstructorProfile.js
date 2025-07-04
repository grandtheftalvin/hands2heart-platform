import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout, updateUser } from '../utils/auth';
import './InstructorProfile.css';

function InstructorProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ totalArtefacts: 0, approvedArtefacts: 0, totalBids: 0, totalEarnings: 0 });
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const userData = getUser();
      if (!userData) {
        navigate('/login');
        return;
      }

      // First try to get from localStorage
      if (userData.name && userData.email) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          specialization: userData.specialization || ''
        });
        setLoading(false);
        return;
      }

      // If not in localStorage, fetch from API
      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`);

      if (response.ok) {
        const userProfile = await response.json();
        setUser(userProfile);
        setFormData({
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          specialization: userProfile.specialization || ''
        });
      } else {
        console.error('Failed to fetch user profile');
        setMessage('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    async function fetchStats() {
      const userData = getUser();
      if (!userData) return;
      try {
        const res = await fetch(`http://localhost:5000/api/bids/instructor-stats/${userData.id}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {}
    }
    fetchStats();
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
      const userData = getUser();
      if (!userData) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
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
            onClick={() => navigate('/dashboard/instructor')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/instructor/artefacts')}
            className="btn btn-secondary"
          >
            My Artefacts
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') || message.includes('updated') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar" style={{ width: 100, height: 100 }}>
            {user?.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt="Profile"
                className="avatar-img"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div className="avatar-placeholder" style={{ width: 100, height: 100, borderRadius: '50%', background: '#f97316', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
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
                <label>Specialization:</label>
                <span>{user?.specialization || 'Not provided'}</span>
              </div>
              <div className="info-group">
                <label>Member Since:</label>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
              <div className="info-group">
                <label>User Type:</label>
                <span className="user-type instructor">Instructor</span>
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
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Specialization:</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} />
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
              <div className="stat-number">{stats.totalArtefacts}</div>
              <div className="stat-label">Total Artefacts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.approvedArtefacts}</div>
              <div className="stat-label">Approved Artefacts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalBids}</div>
              <div className="stat-label">Total Bids</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Kshs {stats.totalEarnings?.toLocaleString()}</div>
              <div className="stat-label">Total Earnings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfile; 