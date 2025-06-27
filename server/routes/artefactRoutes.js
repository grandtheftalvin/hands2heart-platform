// File: server/routes/artefactRoutes.js
const express = require('express');
const supabase = require('../utils/supabase');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create artefact
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, instructor_id } = req.body;
    const image_url = req.file ? req.file.filename : null;

    const { error } = await supabase.from('artefacts').insert([
      {
        title,
        description,
        image_url,
        price,
        instructor_id,
        status: 'pending',
        stock_status: 'in_stock', // default
      },
    ]);

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({ message: 'Artefact created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during artefact upload' });
  }
});

// Get all artefacts (with optional filters)
router.get('/', async (req, res) => {
  const { status, stock } = req.query;

  let query = supabase.from('artefacts').select('*');

  if (status) query = query.eq('status', status);
  if (stock) query = query.eq('stock_status', stock);

  const { data, error } = await query;

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
});

// Get single artefact by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('artefacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Artefact not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark artefact as sold
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: 'Status is required' });

  const { error } = await supabase
    .from('artefacts')
    .update({ status })
    .eq('id', id);

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({ message: `Artefact ${status}` });
});

module.exports = router;
