// File: client/src/pages/DonorCart.js
import React, { useEffect, useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import PaymentModal from '../components/PaymentModal';
import 'react-toastify/dist/ReactToastify.css';

function DonorCart() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const navigate = useNavigate();
  const userData = getUser();

  const fetchBids = useCallback(async () => {
    if (!userData || !userData.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/bids/mine?donor_id=${userData.id}`);
      if (res.ok) {
        const data = await res.json();
        setBids(data);
      } else {
        toast.error('Failed to fetch bids');
      }
    } catch (error) {
      console.error('Failed to fetch bids:', error);
      toast.error('Error loading bids');
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData || !userData.id) {
      navigate('/login');
      return;
    }
    fetchBids();
  }, [userData, navigate, fetchBids]);

  const handlePay = (bid) => {
    setSelectedBid(bid);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedBid(null);
    toast.success('Payment completed successfully!');
    // Refresh bids after payment
    setTimeout(fetchBids, 1000);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedBid(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Approval';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (!userData || !userData.id) {
    return (
      <div className="p-6 text-center">
        <p>Please log in to view your bids.</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard/donor')}
            className="btn btn-primary"
            style={{ marginBottom: '1rem' }}
          >
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">My Bids</h1>
          <button
            onClick={() => navigate('/donor/artefacts')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Artefacts
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading your bids...</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't placed any bids yet.</p>
            <button
              onClick={() => navigate('/donor/artefacts')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Browse Artefacts
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bids.map((bid) => (
              <div key={bid.id} className="bg-white border rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {bid.artefact_title || 'Unknown Artefact'}
                    </h2>
                    <p className="text-lg font-medium text-green-600">
                      Bid Amount: Kshs {bid.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getStatusColor(bid.status)}`}>
                      {getStatusText(bid.status)}
                    </p>
                    {bid.paid && (
                      <p className="text-green-700 text-sm mt-1">✅ Paid</p>
                    )}
                  </div>
                </div>
                
                {bid.status === 'approved' && !bid.paid && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      Your bid has been approved! Please complete the payment to secure your artefact.
                    </p>
                    <button
                      onClick={() => handlePay(bid)}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {showPaymentModal && selectedBid && (
        <PaymentModal
          bid={selectedBid}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default DonorCart;
