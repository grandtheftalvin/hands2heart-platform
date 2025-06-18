// File: server/routes/artefactRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');
const db = require('../models/db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload artefact
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file?.filename;
  const uploaderId = req.user.id;
  if (!image) return res.status(400).json({ message: 'Image upload failed' });

  try {
    await db.promise().query(
      'INSERT INTO artefacts (title, description, image, uploader_id, is_approved) VALUES (?, ?, ?, ?, false)',
      [title, description, image, uploaderId]
    );
    res.status(201).json({ message: 'Artefact uploaded for approval' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get artefacts
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM artefacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch artefacts' });
  }
});

// Handle donation
router.post('/:id/donate', verifyToken, async (req, res) => {
  const artefactId = req.params.id;
  const donorId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    await db.promise().query(
      'INSERT INTO donations (artefact_id, donor_id, amount) VALUES (?, ?, ?)',
      [artefactId, donorId, amount]
    );
    res.status(200).json({ message: 'Donation recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record donation' });
  }
});

// Approve artefact
router.post('/:id/approve', verifyToken, async (req, res) => {
  const artefactId = req.params.id;
  try {
    await db.promise().query('UPDATE artefacts SET is_approved = true WHERE id = ?', [artefactId]);
    res.status(200).json({ message: 'Artefact approved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve artefact' });
  }
});

// Delete artefact
router.delete('/:id', verifyToken, async (req, res) => {
  const artefactId = req.params.id;
  try {
    await db.promise().query('DELETE FROM artefacts WHERE id = ?', [artefactId]);
    res.status(200).json({ message: 'Artefact deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete artefact' });
  }
});

module.exports = router;
// Update artefact
router.put('/:id', verifyToken, async (req, res) => {
  const artefactId = req.params.id;
  const { title, description } = req.body;
  try {
    await db.promise().query('UPDATE artefacts SET title = ?, description = ? WHERE id = ?', [title, description, artefactId]);
    res.status(200).json({ message: 'Artefact updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update artefact' });
  }
});