// File: client/src/pages/DonorBidForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import ArtefactImage from '../components/ArtefactImage';
import './DonorBidForm.css';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

function DonorBidForm() {
  const { id } = useParams();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [artefactLoading, setArtefactLoading] = useState(true);
  const navigate = useNavigate();
  const [donorId, setDonorId] = useState(null);
  const [artefact, setArtefact] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData && userData.id) {
      setDonorId(userData.id);
    } else {
      setMessage('Please log in to place a bid');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Fetch artefact details
    const fetchArtefact = async () => {
      setArtefactLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/artefacts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArtefact(data);
        } else {
          setMessage('Artefact not found. It may have been removed or is no longer available.');
        }
      } catch (error) {
        console.error('Error fetching artefact:', error);
        setMessage('Error loading artefact details. Please try again.');
      } finally {
        setArtefactLoading(false);
      }
    };

    fetchArtefact();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!donorId) {
      setMessage('Please log in to place a bid');
      return;
    }

    if (!artefact) {
      setMessage('Artefact not available for bidding');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid bid amount');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          artefact_id: id, 
          amount: parseFloat(amount), 
          donor_id: donorId 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Bid submitted successfully! Awaiting approval.');
        setTimeout(() => navigate('/donor/my-bids'), 2000);
      } else {
        setMessage(data.message || 'Failed to submit bid');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!donorId) {
    return (
      <div className="donor-bid-list-bg">
        <nav className="donor-artefact-navbar-landing">
          <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
          <span className="donor-navbar-title">My Bids</span>
          <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Back to Artefacts</button>
        </nav>
        <div className="bid-form-container donor-dashboard-black-container">
          <h1>Please Log In</h1>
          <p>You need to be logged in to place a bid.</p>
        </div>
      </div>
    );
  }

  if (artefactLoading) {
    return (
      <div className="donor-bid-list-bg">
        <nav className="donor-artefact-navbar-landing">
          <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
          <span className="donor-navbar-title">My Bids</span>
          <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Back to Artefacts</button>
        </nav>
        <div className="bid-form-container donor-dashboard-black-container">
          <h1>Loading Artefact...</h1>
          <p>Please wait while we fetch the artefact details.</p>
        </div>
      </div>
    );
  }

  if (!artefact) {
    return (
      <div className="donor-bid-list-bg">
        <nav className="donor-artefact-navbar-landing">
          <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
          <span className="donor-navbar-title">My Bids</span>
          <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Back to Artefacts</button>
        </nav>
        <div className="bid-form-container donor-dashboard-black-container">
          <h1>Artefact Not Found</h1>
          <p>{message}</p>
          <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">
            Back to Artefacts
          </button>
        </div>
      </div>
    );
  }

  // Debug: log artefact object
  console.log('Artefact details:', artefact);

  return (
    <div className="donor-bid-list-bg">
      <nav className="donor-artefact-navbar-landing">
        <button onClick={() => navigate('/dashboard/donor')} className="donor-navbar-btn">Back to Dashboard</button>
        <span className="donor-navbar-title">My Bids</span>
        <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">Back to Artefacts</button>
      </nav>
      <div className="bid-form-container donor-dashboard-black-container">
        <h1>Place Your Bid</h1>
        <div className="artefact-details">
          <h2>{artefact.title ? artefact.title : 'No title available'}</h2>
          <p>{artefact.description ? artefact.description : 'No description available.'}</p>
          <p className="price">Suggested Price: Kshs {artefact.price ? artefact.price : 'N/A'}</p>
          {artefact.image_url && (
            <ArtefactImage 
              imageUrl={artefact.image_url}
              title={artefact.title}
              dimensions={{ width: '100%', maxWidth: '400px', height: '250px' }}
              showContainer={false}
            />
          )}
        </div>
        <form onSubmit={handleSubmit} className="bid-form">
          <div className="form-group">
            <label htmlFor="amount">Your Bid Amount (Kshs)</label>
            <input
              id="amount"
              type="number"
              placeholder="Enter your bid amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="place-bid-btn">
            {loading ? 'Submitting...' : 'Submit Bid'}
          </button>
        </form>
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <button onClick={() => navigate('/donor/artefacts')} className="donor-navbar-btn">
          Back to Artefacts
        </button>
      </div>
    </div>
  );
}

export default DonorBidForm;
