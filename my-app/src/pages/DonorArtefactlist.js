// File: client/src/pages/DonorArtefactlist.js
import React, { useEffect, useState } from 'react';

function DonorArtefactlist() {
  const [artefacts, setArtefacts] = useState([]);

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/artefacts/?status=approved&stock=in_stock');
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
      <h1 className="text-2xl font-bold mb-6">All Available Artefacts</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {artefacts.map((a) => (
          <div key={a.id} className="border rounded shadow p-4">
             <img src={`http://localhost:5000/uploads/${a.image}`} alt={a.title} className="w-full h-40 object-cover mb-2 rounded" />
            <h3 className="text-lg font-bold">{a.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{a.description}</p>
            <p className="text-sm text-gray-800 font-semibold mb-1">Price: ${a.price}</p>
             <p className={`text-sm font-medium ${a.stock_status === 'sold' ? 'text-red-600' : 'text-green-700'}`}>
              Stock Status: {a.stock_status === 'sold' ? 'Sold' : 'In Stock'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorArtefactlist;
