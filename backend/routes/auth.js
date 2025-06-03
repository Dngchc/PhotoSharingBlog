const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Đăng ký user
router.post('/register', async (req, res) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
    if (!login_name || !password) return res.status(400).json({ message: 'login_name and password required' });

    // Kiểm tra trùng login_name
    const existingUser = await User.findOne({ login_name });
    if (existingUser) return res.status(409).json({ message: 'login_name already taken' });

    const newUser = new User({ login_name, password, first_name, last_name, location, description, occupation });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đăng nhập user
router.post('/login', async (req, res) => {
  try {
    const { login_name, password } = req.body;
    if (!login_name || !password) return res.status(400).json({ message: 'login_name and password required' });

    const user = await User.findOne({ login_name });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
        token,
        user: {
          
          first_name: user.first_name,
          last_name: user.last_name // nếu có
        }
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
