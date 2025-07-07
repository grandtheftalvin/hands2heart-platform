// File: client/src/pages/DonorCart.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import './DonorArtefactList.css';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

function DonorCart() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/bids/mine?donor_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }
      const data = await response.json();
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = (bid) => {
    setSelectedBid(bid);
    setShowPaymentModal(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedBid(null);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedBid(null);
    fetchBids(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="donor-bid-list-bg">
        <nav className="donor-artefact-navbar-landing">
          <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
          <span className="donor-navbar-title">My Bids</span>
          <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Browse Artefacts</button>
        </nav>
        <div className="artefact-page donor-dashboard-black-container">
          <h2>Loading Your Bids...</h2>
          <p>Please wait while we fetch your bid information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-bid-list-bg">
      <nav className="donor-artefact-navbar-landing">
        <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
        <span className="donor-navbar-title">My Bids</span>
        <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Browse Artefacts</button>
      </nav>
      <div className="artefact-page">
        {bids.length === 0 ? (
          <div className="donor-dashboard-black-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>No Bids Found</h2>
            <p>You haven't placed any bids yet.</p>
            <button
              onClick={() => navigate('/donor/artefacts')}
              className="donor-navbar-btn"
              style={{ marginTop: '1rem' }}
            >
              Browse Artefacts
            </button>
          </div>
        ) : (
          <div className="artefact-grid">
            {bids.map((bid) => (
              <div key={bid.id} className="donor-dashboard-black-container">
                <div className="artefact-content">
                  <h2>{bid.artefact_title}</h2>
                  <p><strong>Your Bid Amount:</strong> Kshs {bid.amount}</p>
                  <p><strong>Status:</strong> 
                    <span style={{
                      color: bid.status === 'approved' ? '#28a745' : 
                             bid.status === 'pending' ? '#ffc107' : '#dc3545',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                  </p>
                  {bid.status === 'approved' && !bid.paid && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-3">
                        Your bid has been approved! Please complete the payment to secure your artefact.
                      </p>
                      <button
                        onClick={() => handlePay(bid)}
                        className="place-bid-btn"
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                  {bid.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Your bid is awaiting approval from the admin. You'll receive a notification once it's reviewed.
                      </p>
                    </div>
                  )}
                  {bid.status === 'rejected' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-red-600">
                        Your bid was not approved. You can try bidding on other artefacts.
                      </p>
                    </div>
                  )}
                  {bid.paid && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-green-600 font-bold">
                        ✅ Payment Completed - Artefact Secured!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {showPaymentModal && selectedBid && (
          <PaymentModal
            bid={selectedBid}
            onClose={handlePaymentClose}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default DonorCart; 