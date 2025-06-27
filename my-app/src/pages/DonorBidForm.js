// File: client/src/pages/DonorBidForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DonorBidForm() {
  const { id } = useParams();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [donorId, setDonorId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setDonorId(user.id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artefact_id: id, amount, donor_id: donorId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Bid submitted successfully. Await approval.');
        setTimeout(() => navigate('/donor/my-bids'), 2000);
      } else {
        setMessage(data.message || 'Failed to submit bid');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      setMessage('Server error');
    }
  };

  return (
    <div className="bid-form-container">
      <h1>Place Your Bid</h1>
      <form onSubmit={handleSubmit} className="bid-form">
        <input
          type="number"
          placeholder="Enter your bid amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Submit Bid</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DonorBidForm;
