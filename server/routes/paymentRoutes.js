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

module.exports = router;
