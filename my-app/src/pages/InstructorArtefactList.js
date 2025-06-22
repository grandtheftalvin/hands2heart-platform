import React, { useEffect, useState } from 'react';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Uploaded Artefacts</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {artefacts.map((a) => (
          <div key={a.id} className="border rounded shadow p-4">
            <img src={`http://localhost:5000/uploads/${a.image_url}`} alt={a.title} className="w-full h-48 object-cover mb-2 rounded" />
            <h2 className="text-lg font-bold">{a.title}</h2>
            <p className="text-sm text-gray-700">{a.description}</p>
            <p className="text-sm font-semibold mt-2">Price: ${a.price}</p>
            <p className="text-sm">Status: {a.status}</p>
            <p className="text-sm">Stock: {a.stock_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorArtefactList;