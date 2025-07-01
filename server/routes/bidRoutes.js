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

// GET /api/bids/approved/:donor_id
router.get('/approved/:donor_id', async (req, res) => {
  const { donor_id } = req.params;

  if (!donor_id) return res.status(400).json({ message: 'Missing donor_id' });

  const { data, error } = await supabase
    .from('bids')
    .select(`
      id,
      amount,
      status,
      paid,
      created_at,
      payment_date,
      payment_method,
      phone_number,
      artefact_id,
      artefacts(title, image_url)
    `)
    .eq('donor_id', donor_id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch approved bids' });
  }

  const formatted = data.map(b => ({
    ...b,
    artefact_title: b.artefacts?.title || 'Unknown',
    artefact_image: b.artefacts?.image_url || null
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

// PATCH /api/bids/:id/reject
router.patch('/:id/reject', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('bids')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (error) return res.status(500).json({ message: 'Rejection failed' });

  res.json({ message: 'Bid rejected' });
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

// GET /api/bids/instructor/:instructor_id
router.get('/instructor/:instructor_id', async (req, res) => {
  const { instructor_id } = req.params;

  // Get all artefacts for this instructor
  const { data: artefacts, error: artefactError } = await supabase
    .from('artefacts')
    .select('id, title')
    .eq('instructor_id', instructor_id);

  if (artefactError) {
    return res.status(500).json({ message: 'Failed to fetch artefacts' });
  }

  const artefactIds = artefacts.map(a => a.id);
  if (artefactIds.length === 0) {
    return res.json([]); // No artefacts, so no bids
  }

  // Get all bids for these artefacts
  const { data: bids, error: bidError } = await supabase
    .from('bids')
    .select(`
      id,
      artefact_id,
      donor_id,
      amount,
      status,
      paid,
      created_at,
      users(name, email),
      artefacts(title)
    `)
    .in('artefact_id', artefactIds);

  if (bidError) {
    return res.status(500).json({ message: 'Failed to fetch bids' });
  }

  // Attach artefact title and donor info
  const formatted = bids.map(bid => ({
    ...bid,
    artefact_title: bid.artefacts?.title || 'Unknown',
    donor_name: bid.users?.name || 'Unknown',
    donor_email: bid.users?.email || 'Unknown',
  }));

  res.json(formatted);
});

// GET /api/bids/donor-stats/:donor_id
router.get('/donor-stats/:donor_id', async (req, res) => {
  const { donor_id } = req.params;
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('id, amount, status, paid')
      .eq('donor_id', donor_id);
    if (error) throw error;
    const totalBids = data.length;
    const approvedBids = data.filter(b => b.status === 'approved').length;
    const completedPurchases = data.filter(b => b.paid === true).length;
    const totalSpent = data.filter(b => b.paid === true).reduce((sum, b) => sum + parseFloat(b.amount), 0);
    res.json({ totalBids, approvedBids, completedPurchases, totalSpent });
  } catch (err) {
    console.error('Donor stats error:', err);
    res.status(500).json({ message: 'Failed to fetch donor stats' });
  }
});

// GET /api/bids/instructor-stats/:instructor_id
router.get('/instructor-stats/:instructor_id', async (req, res) => {
  const { instructor_id } = req.params;
  try {
    // Get all artefacts for this instructor
    const { data: artefacts, error: artefactError } = await supabase
      .from('artefacts')
      .select('id, approved')
      .eq('instructor_id', instructor_id);
    if (artefactError) throw artefactError;
    const artefactIds = artefacts.map(a => a.id);
    const totalArtefacts = artefacts.length;
    const approvedArtefacts = artefacts.filter(a => a.approved === true).length;
    // Get all bids for these artefacts
    let totalBids = 0;
    let totalEarnings = 0;
    if (artefactIds.length > 0) {
      const { data: bids, error: bidError } = await supabase
        .from('bids')
        .select('amount, paid, artefact_id')
        .in('artefact_id', artefactIds);
      if (bidError) throw bidError;
      totalBids = bids.length;
      totalEarnings = bids.filter(b => b.paid === true).reduce((sum, b) => sum + parseFloat(b.amount), 0);
    }
    res.json({ totalArtefacts, approvedArtefacts, totalBids, totalEarnings });
  } catch (err) {
    console.error('Instructor stats error:', err);
    res.status(500).json({ message: 'Failed to fetch instructor stats' });
  }
});

module.exports = router;
