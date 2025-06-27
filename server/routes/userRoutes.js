// File: server/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const supabase = require('../utils/supabase');
const router = express.Router();

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User Signup
router.post('/signup', async (req, res) => {
  console.log('Signup request:', req.body);

  try {
    const { name, email, password, confirmPassword, role } = req.body;
    console.log('🛠 Starting signup logic');

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    console.log('✅ Checked for existing user');

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

  const result = await supabase.from('users').insert([
  {
    name,
    email,
    password: hashedPassword,
    role,
    verification_token: verificationToken,
    is_verified: false,
  },
]);

console.log('✅ Insert result:', JSON.stringify(result, null, 2));

if (result.error) {
  console.log('❌ Supabase insert error:', JSON.stringify(result.error, null, 2));
  return res.status(500).json({
    message: result.error.message || 'Insert failed',
    full: result.error,
  });
}
    console.log('✅ User inserted successfully');
    console.log('📧 Preparing to send verification email');


    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your Hands2Heart account',
      text: `Hi ${name},\n\nThank you for signing up to Hands2Heart.\nPlease verify your account by clicking the link below:\n${verificationUrl}\n\nBest regards,\nHands2Heart Team`,
    };

    console.log('📧 Sending verification email to:', email);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Email error:', err);
      } else {
        console.log('📤 Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'User created. A verification link has been sent to your email. Please check your inbox.',
      verificationSent: true,
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Email Verification Route
router.get('/verify-email', async (req, res) => {
  const { token, email } = req.query;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('verification_token', token)
    .single();

  if (error || !user) {
    return res.status(400).json({ message: 'Invalid or expired verification link.' });
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ is_verified: true, verification_token: null })
    .eq('id', user.id);

  if (updateError) {
    return res.status(500).json({ message: 'Error verifying account.' });
  }

  const tokenJwt = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  let redirectUrl = `${process.env.CLIENT_URL}/login`;
  if (user.role === 'admin') {
    redirectUrl = `${process.env.CLIENT_URL}/dashboard/admin?token=${tokenJwt}`;
  } else if (user.role === 'instructor') {
    redirectUrl = `${process.env.CLIENT_URL}/dashboard/instructor?token=${tokenJwt}`;
  } else if (user.role === 'donor') {
    redirectUrl = `${process.env.CLIENT_URL}/dashboard/donor?token=${tokenJwt}`;
  }

  res.redirect(302, redirectUrl);
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.is_verified) {
    return res.status(403).json({ message: 'Please verify your email before logging in.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ token, user });
});

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, address, specialization, role, created_at, is_verified')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, specialization } = req.body;

  try {
    // Check if email is already taken by another user
    if (email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .single();

      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updateData = {
      name: name || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      specialization: specialization || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, phone, address, specialization, role, created_at, is_verified')
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Failed to update profile' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET /api/users - Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at, is_verified')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
