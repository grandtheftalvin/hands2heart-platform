import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import './DonorNotifications.css';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

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
      <div className="donor-bid-list-bg">
        <nav className="donor-artefact-navbar-landing">
          <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
          <span className="donor-navbar-title">Notifications</span>
          <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Browse Artefacts</button>
        </nav>
        <div className="notifications-container donor-dashboard-black-container">
          <div className="loading">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-bid-list-bg">
      <nav className="donor-artefact-navbar-landing">
        <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
        <span className="donor-navbar-title">Notifications</span>
        <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Browse Artefacts</button>
      </nav>
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="no-notifications" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>No notifications yet</h2>
            <p>You'll see notifications here when your bids are approved.</p>
            <button
              onClick={() => navigate('/donor/artefacts')}
              className="donor-navbar-btn"
            >
              Browse Artefacts
            </button>
          </div>
        ) : (
          <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[...notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((notification) => (
              <div key={notification.id} className="notification-card donor-dashboard-black-container">
                <div className="notification-header">
                  <h3 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700 }}>Bid Approved! 🎉</h3>
                  <span className="notification-date" style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '6px', marginLeft: '1rem' }}>
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="notification-body" style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                  <p style={{ fontWeight: 600 }}>
                    Your bid of <strong>Kshs {notification.amount}</strong> for{' '}
                    <strong>{notification.artefact_title}</strong> has been approved!
                  </p>
                  <div className="notification-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    {notification.paid ? (
                      <span className="paid-badge" style={{ background: '#22c55e', color: '#fff', borderRadius: '20px', padding: '8px 24px', fontWeight: 700, fontSize: '1rem', display: 'inline-block' }}>Payment Completed</span>
                    ) : (
                      <button
                        onClick={() => handlePayment(notification)}
                        className="place-bid-btn"
                        style={{ width: '60%', fontSize: '1.2rem' }}
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
        {showPaymentModal && (
          <PaymentModal
            bid={selectedBid}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default DonorNotifications; 