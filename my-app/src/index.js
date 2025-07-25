import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App handles all routes
import './index.css';    // Optional: Tailwind or global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
