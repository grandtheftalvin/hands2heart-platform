// File: client/src/pages/InstructorBids.js
import React, { useEffect, useState } from 'react';

function InstructorBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bids/pending');
        const data = await res.json();
        setBids(data);
      } catch (error) {
        console.error('Error fetching pending bids:', error);
      }
    };
    fetchBids();
  }, []);

  const handleApprove = async (bidId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids/${bidId}/approve`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (res.ok) {
        setBids(bids.filter((b) => b.id !== bidId));
      } else {
        alert(data.message || 'Approval failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="instructor-bids">
      <h1>Pending Bids</h1>
      {bids.map((bid) => (
        <div key={bid.id} className="bid-card">
          <p><strong>Artefact:</strong> {bid.artefact_title}</p>
          <p><strong>Donor:</strong> {bid.donor_name}</p>
          <p><strong>Amount:</strong> Kshs {bid.amount}</p>
          <button onClick={() => handleApprove(bid.id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}

export default InstructorBids;