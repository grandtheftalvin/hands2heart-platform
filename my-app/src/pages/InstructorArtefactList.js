// File: client/src/pages/InstructorArtefactList.js
import React, { useEffect, useState } from 'react';
import './InstructorArtefactList.css';

function InstructorArtefactList() {
  const [artefacts, setArtefacts] = useState([]);

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/artefacts?role=instructor');
        const data = await res.json();
        setArtefacts(data);
      } catch (error) {
        console.error('Failed to fetch artefacts:', error);
      }
    };
    fetchArtefacts();
  }, []);

  return (
    <div className="artefact-list-container">
      <h1 className="artefact-list-title">My Uploaded Artefacts</h1>
      <div className="artefact-grid">
        {artefacts.map((a) => (
          <div key={a.id} className="artefact-card">
            <img
              src={`http://localhost:5000/uploads/${a.image_url}`}
              alt={a.title}
              className="artefact-image"
            />
            <h2>{a.title}</h2>
            <p>{a.description}</p>
            <p className="price">Price: ${a.price}</p>
            <p>Status: {a.status}</p>
            <p>Stock: {a.stock_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorArtefactList;
