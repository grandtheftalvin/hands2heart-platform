// File: server/routes/paymentRoutes.js
const express = require('express');
const axios = require('axios');
const moment = require('moment');
const supabase = require('../utils/supabase');
require('dotenv').config();

const router = express.Router();

// POST /api/pay - Initiate STK Push and mark bid as paid
router.post('/', async (req, res) => {
  const { phone, amount, bid_id } = req.body;

  if (!phone || !amount || !bid_id) {
    return res.status(400).json({ message: 'Phone number, amount, and bid ID are required' });
  }

  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(
    `${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`
  ).toString('base64');

  try {
    // Step 1: Get Access Token
    const authBuffer = Buffer.from(
      `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
    ).toString('base64');

    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${authBuffer}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Make STK Push request
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.DARAJA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.DARAJA_CALLBACK_URL,
        AccountReference: 'Hands2Heart',
        TransactionDesc: 'Donation via STK Push',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Update bid as paid (optimistically — for now assume successful)
    const { error } = await supabase
      .from('bids')
      .update({ paid: true })
      .eq('id', bid_id);

    if (error) {
      console.error('Failed to update bid as paid:', error);
      return res.status(500).json({ message: 'STK sent, but failed to mark bid as paid' });
    }

    res.status(200).json({
      message: 'STK Push sent and payment recorded',
      response: stkResponse.data,
    });
  } catch (error) {
    console.error('Daraja Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to initiate STK Push',
      error: error.response?.data || error.message,
    });
  }
});

// POST /api/payments/initiate
router.post('/initiate', async (req, res) => {
  const { bid_id, phone_number, amount, artefact_title } = req.body;

  if (!bid_id || !phone_number || !amount) {
    return res.status(400).json({ message: 'Missing payment data' });
  }

  try {
    // In a real implementation, this would integrate with M-Pesa API
    // For now, we'll simulate the payment process
    
    // Update the bid to mark it as paid
    const { error } = await supabase
      .from('bids')
      .update({ 
        paid: true,
        payment_date: new Date().toISOString(),
        payment_method: 'mpesa',
        phone_number: phone_number
      })
      .eq('id', bid_id);

    if (error) {
      console.error('Payment update error:', error);
      return res.status(500).json({ message: 'Failed to process payment' });
    }

    // Create a payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        bid_id: bid_id,
        amount: amount,
        payment_method: 'mpesa',
        phone_number: phone_number,
        status: 'completed',
        transaction_id: `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }]);

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      // Payment was processed but record creation failed
      return res.status(200).json({ 
        message: 'Payment processed successfully',
        transaction_id: `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }

    res.status(200).json({ 
      message: 'Payment processed successfully',
      transaction_id: `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// GET /api/payments/history/:user_id
router.get('/history/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        payment_method,
        status,
        created_at,
        transaction_id,
        bids(
          artefacts(title)
        )
      `)
      .eq('bids.donor_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Payment history error:', error);
      return res.status(500).json({ message: 'Failed to fetch payment history' });
    }

    const formatted = data.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      payment_method: payment.payment_method,
      status: payment.status,
      created_at: payment.created_at,
      transaction_id: payment.transaction_id,
      artefact_title: payment.bids?.artefacts?.title || 'Unknown'
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

// GET /api/payments/stats
router.get('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, status');

    if (error) {
      console.error('Payment stats error:', error);
      return res.status(500).json({ message: 'Failed to fetch payment stats' });
    }

    const totalRevenue = data
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    const totalTransactions = data.length;
    const completedTransactions = data.filter(payment => payment.status === 'completed').length;

    res.json({
      totalRevenue,
      totalTransactions,
      completedTransactions,
      successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions * 100).toFixed(2) : 0
    });

  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({ message: 'Failed to fetch payment stats' });
  }
});

// POST /api/payments/donate - General donation (not tied to a bid)
router.post('/donate', async (req, res) => {
  const { phone, amount } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ message: 'Phone number and amount are required' });
  }
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(
    `${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`
  ).toString('base64');
  try {
    // Step 1: Get Access Token
    const authBuffer = Buffer.from(
      `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
    ).toString('base64');
    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${authBuffer}`,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    // Step 2: Make STK Push request
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.DARAJA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.DARAJA_CALLBACK_URL,
        AccountReference: 'Hands2Heart',
        TransactionDesc: 'General Donation',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Optionally, record the donation in a donations table
    // await supabase.from('donations').insert([{ phone, amount, created_at: new Date().toISOString() }]);i 
    res.status(200).json({
      message: 'STK Push sent for donation',
      response: stkResponse.data,
    });
  } catch (error) {
    console.error('Daraja Donation Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to initiate donation',
      error: error.response?.data || error.message,
    });
  }
});

// POST /api/payments/callback - Handle M-Pesa payment callbacks
router.post('/callback', (req, res) => {
  console.log('M-Pesa callback received:', req.body);
  // TODO: Add logic to update payment status in the database if needed
  res.status(200).send('Callback received');
});

module.exports = router;
