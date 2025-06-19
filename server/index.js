require('dotenv').config(); // MUST be at the very top
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

