// File: client/src/pages/InstructorArtefactList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtefactImage from '../components/ArtefactImage';
import './InstructorArtefactList.css';
import dashboardBg from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

function InstructorArtefactList() {
  const [artefacts, setArtefacts] = useState([]);
  const navigate = useNavigate();

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
    <div className="instructor-artefact-list-bg">
      <div className="artefact-list-container">
        <button
          onClick={() => navigate('/dashboard/instructor')}
          className="back-dashboard-btn"
          style={{ margin: '1rem 0' }}
        >
          Back to Dashboard
        </button>
        <h1 className="artefact-list-title">My Uploaded Artefacts</h1>
        <div className="artefact-grid">
          {artefacts.map((a) => (
            <div key={a.id} className="instructor-dashboard-black-container">
              <ArtefactImage 
                imageUrl={a.image_url}
                title={a.title}
                dimensions={{ width: '100%', height: '250px' }}
              />
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h2>{a.title}</h2>
                <p>{a.description}</p>
                <p className="price">Price: Kshs{a.price}</p>
                <p>Status: {a.status}</p>
                <p>Stock: {a.stock_status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorArtefactList;
