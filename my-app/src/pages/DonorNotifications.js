import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import './DonorNotifications.css';

function DonorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/bids/approved/${user.id}`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (bid) => {
    setSelectedBid(bid);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    fetchNotifications(); // Refresh the list
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate('/dashboard/donor')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/donor/profile')}
            className="btn btn-secondary"
          >
            Profile
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="notifications-content">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <h2>No notifications yet</h2>
            <p>You'll see notifications here when your bids are approved.</p>
            <button
              onClick={() => navigate('/donor/artefacts')}
              className="btn btn-primary"
            >
              Browse Artefacts
            </button>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-card">
                <div className="notification-header">
                  <h3>Bid Approved! 🎉</h3>
                  <span className="notification-date">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="notification-body">
                  <p>
                    Your bid of <strong>Kshs {notification.amount}</strong> for{' '}
                    <strong>{notification.artefact_title}</strong> has been approved!
                  </p>
                  <div className="notification-actions">
                    {notification.paid ? (
                      <span className="paid-badge">Payment Completed</span>
                    ) : (
                      <button
                        onClick={() => handlePayment(notification)}
                        className="btn btn-success"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          bid={selectedBid}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default DonorNotifications; 