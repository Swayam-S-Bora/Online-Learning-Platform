const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redis = require('../redisClient');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const TOKEN_EXPIRE = 60 * 60 * 24; // 24 hours

// Register
router.post('/register',
  body('email').isEmail(),
  body('username').notEmpty(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { username, email, password } = req.body;
      let userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ msg: 'User already exists' });

      const user = new User({ username, email, password });
      await user.save();

      res.json({ msg: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      // Generate JWT token
      const payload = { userId: user._id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRE });

      // Store token in Redis with TTL
      await redis.set(`sess:${user._id}`, token, 'EX', TOKEN_EXPIRE);

      res.json({ token });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

// Logout (delete session from Redis)
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ msg: 'No token provided' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    await redis.del(`sess:${payload.userId}`);
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
});

module.exports = router;
