// File: server/routes/artefactRoutes.js
const express = require('express');
const supabase = require('../utils/supabase');
const router = express.Router();

// Create Artefact
router.post('/', async (req, res) => {
  const { title, description, image_url, price, instructor_id, status } = req.body;

  const { error } = await supabase.from('artefacts').insert([
    {
      title,
      description,
      image_url,
      price,
      instructor_id,
      status: status || 'pending',
    },
  ]);

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json({ message: 'Artefact created' });
});

// Get all artefacts
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('artefacts').select('*');

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
});

module.exports = router;
