// File: client/src/pages/DonorArtefactList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonorArtefactList.css';

function DonorArtefactList() {
  const [artefacts, setArtefacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/artefacts?status=approved&stock=in_stock');
        const data = await res.json();
        setArtefacts(data);
      } catch (error) {
        console.error('Failed to fetch artefacts:', error);
      }
    };
    fetchArtefacts();
  }, []);

  return (
    <div className="artefact-page">
      <button
        onClick={() => navigate('/dashboard/donor')}
        className="btn btn-primary"
        style={{ margin: '1rem 0' }}
      >
        Back to Dashboard
      </button>
      <h1 className="artefact-title">All Available Artefacts</h1>
      <div className="view-bids-button">
        <button onClick={() => navigate('/donor/my-bids')}>View My Bids</button>
      </div>
      <div className="artefact-grid">
        {artefacts.map((a) => (
          <div key={a.id} className="artefact-card">
            <img
              src={`http://localhost:5000/uploads/${a.image_url}`}
              alt={a.title}
              className="artefact-image universal-artefact-image"
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', background: '#f3f3f3' }}
              onError={e => { e.target.onerror = null; e.target.src = '/default-artefact.png'; }}
            />
            <div className="artefact-content">
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <p className="price">Price: Kshs {a.price}</p>
              <button
                onClick={() => navigate(`/donor/bid/${a.id}`)}
                style={{ background: 'white', color: '#f97316', border: '2px solid #f97316', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginTop: '10px', transition: 'all 0.2s' }}
                onMouseOver={e => e.target.style.background='#f3f3f3'}
                onMouseOut={e => e.target.style.background='white'}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorArtefactList;