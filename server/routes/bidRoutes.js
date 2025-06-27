// File: server/routes/bidRoutes.js
const express = require('express');
const supabase = require('../utils/supabase');
const router = express.Router();

// POST /api/bids
router.post('/', async (req, res) => {
  const { artefact_id, amount, donor_id } = req.body;

  if (!artefact_id || !amount || !donor_id) {
    return res.status(400).json({ message: 'Missing bid data' });
  }

  const { data, error } = await supabase
    .from('bids')
    .insert([{ artefact_id, amount, donor_id, status: 'pending' }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to place bid' });
  }

  res.status(201).json({ message: 'Bid placed', data });
});

// GET /api/bids/mine?donor_id=xxx
router.get('/mine', async (req, res) => {
  const { donor_id } = req.query;

  if (!donor_id) return res.status(400).json({ message: 'Missing donor_id' });

  const { data, error } = await supabase
    .from('bids')
    .select(`
      id,
      amount,
      status,
      paid,
      artefact_id,
      artefacts(title)
    `)
    .eq('donor_id', donor_id);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch bids' });
  }

  const formatted = data.map(b => ({
    ...b,
    artefact_title: b.artefacts?.title || 'Unknown'
  }));

  res.json(formatted);
});

// GET /api/bids/pending
router.get('/pending', async (req, res) => {
  const { data, error } = await supabase
    .from('bids')
    .select('id, amount, artefact_id, donor_id, artefacts(title), users(name)')
    .eq('status', 'pending');

  if (error) return res.status(500).json({ message: 'Error fetching bids' });

  const formatted = data.map((b) => ({
    id: b.id,
    amount: b.amount,
    artefact_title: b.artefacts?.title,
    donor_name: b.users?.name,
  }));

  res.json(formatted);
});

// PATCH /api/bids/:id/approve
router.patch('/:id/approve', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('bids')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) return res.status(500).json({ message: 'Approval failed' });

  res.json({ message: 'Bid approved' });
});

// GET /api/bids/stats
router.get('/stats', async (req, res) => {
  const { instructor_id, artefact_id } = req.query;
  let query = supabase.from('bids').select('*');

  if (instructor_id) {
    query = query.eq('instructor_id', instructor_id);
  }

  if (artefact_id) {
    query = query.eq('artefact_id', artefact_id);
  }

  try {
    const { data, error } = await query;
    if (error) throw error;

    const totalBids = data.length;
    const totalApproved = data.filter(b => b.status === 'approved').length;
    const totalPaid = data.filter(b => b.paid === true).length;
    const totalDonations = data
      .filter(b => b.paid === true)
      .reduce((sum, b) => sum + parseFloat(b.amount), 0);

    res.json({ totalBids, totalApproved, totalPaid, totalDonations });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch bid stats' });
  }
});

module.exports = router;
