// File: client/src/pages/DonorCart.js
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function DonorCart() {
  const [bids, setBids] = useState([]);
  const navigate = useNavigate();
  const donorId = localStorage.getItem('userId'); // or get from auth context

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids/mine?donor_id=${donorId}`);
      const data = await res.json();
      setBids(data);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    }
  };

  const handlePay = async (bidId) => {
    const phone = prompt('Enter your phone number (e.g., 254712345678)');
    const bid = bids.find(b => b.id === bidId);
    if (!phone || !bid?.amount) return;

    try {
      const res = await fetch('http://localhost:5000/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: bid.amount })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('STK Push sent. Check your phone.');
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (err) {
      console.error('STK error:', err);
      toast.error('Error sending STK push');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">My Bids</h1>

      {bids.length === 0 ? (
        <p>You haven’t placed any bids yet.</p>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <div key={bid.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{bid.artefact_title}</h2>
              <p className="text-gray-700">Bid Amount: Kshs {bid.amount}</p>
              <p className={`font-semibold ${bid.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                Status: {bid.status}
              </p>
              {bid.status === 'approved' && !bid.paid && (
                <button
                  onClick={() => handlePay(bid.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                >
                  Pay Now
                </button>
              )}
              {bid.paid && (
                <p className="text-green-700 mt-2 font-medium">✅ Paid</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonorCart;
