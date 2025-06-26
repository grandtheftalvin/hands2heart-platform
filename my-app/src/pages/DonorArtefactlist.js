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
              className="artefact-image"
            />
            <div className="artefact-content">
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <p className="price">Price: ${a.price}</p>
              <button onClick={() => navigate(`/donor/bid/${a.id}`)}>Place Bid</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorArtefactList;