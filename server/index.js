// File: server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads .env file

const userRoutes = require('./routes/userRoutes');
const artefactRoutes = require('./routes/artefactRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//  Routes
app.use('/api/users', userRoutes);
app.use('/api/artefacts', artefactRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('Hands2Heart API is running.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
