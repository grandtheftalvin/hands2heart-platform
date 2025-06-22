// File: client/src/pages/DonorArtefactList.js
import React, { useEffect, useState } from 'react';
import './DonorArtefactList.css';

function DonorArtefactList() {
  const [artefacts, setArtefacts] = useState([]);

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorArtefactList;
