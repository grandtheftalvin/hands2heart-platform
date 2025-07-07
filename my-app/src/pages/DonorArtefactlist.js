// File: client/src/pages/DonorArtefactList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtefactImage from '../components/ArtefactImage';
import './DonorArtefactList.css';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';
import Navbar from '../components/Navbar';

function DonorArtefactList() {
  const [artefacts, setArtefacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/artefacts?status=approved&stock=in_stock');
        if (!res.ok) {
          throw new Error('Failed to fetch artefacts');
        }
        const data = await res.json();
        setArtefacts(data);
      } catch (error) {
        console.error('Failed to fetch artefacts:', error);
        setError('Failed to load artefacts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtefacts();
  }, []);

  if (loading) {
    return (
      <div className="artefact-page">
        <button
          onClick={() => navigate('/dashboard/donor')}
          className="btn btn-primary"
          style={{ margin: '1rem 0' }}
        >
          Back to Dashboard
        </button>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading Artefacts...</h2>
          <p>Please wait while we fetch the available artefacts.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artefact-page">
        <button
          onClick={() => navigate('/dashboard/donor')}
          className="btn btn-primary"
          style={{ margin: '1rem 0' }}
        >
          Back to Dashboard
        </button>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Error Loading Artefacts</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-artefact-list-bg">
      <nav className="donor-artefact-navbar-landing">
        <button
          onClick={() => navigate('/dashboard/donor')}
          className="donor-navbar-btn"
        >
          Back to Dashboard
        </button>
        <span className="donor-navbar-title">All Available Artefacts</span>
        <button
          onClick={() => navigate('/donor/my-bids')}
          className="donor-navbar-btn"
        >
          View My Bids
        </button>
      </nav>
      <div className="artefact-page">
        {artefacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>No Artefacts Available</h2>
            <p>There are currently no approved artefacts available for bidding.</p>
            <p>Please check back later!</p>
          </div>
        ) : (
          <div className="artefact-grid">
            {artefacts.map((a) => (
              <div key={a.id} className="donor-dashboard-black-container">
                <ArtefactImage 
                  imageUrl={a.image_url}
                  title={a.title}
                  dimensions={{ width: '100%', height: '250px' }}
                />
                <div className="artefact-content">
                  <h2>{a.title}</h2>
                  <p>{a.description}</p>
                  <p className="price">Price: Kshs {a.price}</p>
                  <button
                    onClick={() => navigate(`/donor/bid/${a.id}`)}
                    className="place-bid-btn"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorArtefactList;