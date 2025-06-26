// File: client/src/pages/DonorMyBids.js
import React, { useEffect, useState } from 'react';

function DonorMyBids() {
  const [bids, setBids] = useState([]);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [donorId, setDonorId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setDonorId(user.id);
  }, []);

  useEffect(() => {
    const fetchBids = async () => {
      if (!donorId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/bids/mine?donor_id=${donorId}`);
        const data = await res.json();
        setBids(data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };
    fetchBids();
  }, [donorId]);

  const handleConfirmPayment = async (bidId, amount) => {
    try {
      const res = await fetch('http://localhost:5000/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount, bid_id: bidId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('STK Push sent. Check your phone.');
        const updated = bids.map(b => b.id === bidId ? { ...b, paid: true } : b);
        setBids(updated);
      } else {
        setMessage(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Server error');
    }
  };

  return (
    <div className="my-bids-container">
      <h1>My Bids</h1>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {bids.map((bid) => (
        <div key={bid.id} className="bid-card">
          <p><strong>Artefact:</strong> {bid.artefact_title}</p>
          <p><strong>Bid Amount:</strong> Kshs {bid.amount}</p>
          <p><strong>Status:</strong> {bid.status}</p>
          {bid.status === 'approved' && !bid.paid && (
            <button onClick={() => handleConfirmPayment(bid.id, bid.amount)}>
              Confirm Payment
            </button>
          )}
          {bid.paid && <p className="paid-status">Payment Completed</p>}
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}

export default DonorMyBids;