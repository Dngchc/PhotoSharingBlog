const express = require('express');
const User = require('../models/user');
const router = express.Router();


// lấy danh sách user
router.get('/userlist', async (req, res) => {
    try {
      const users = await User.find().select('-password -login_name'); // hoặc '-password -login_name'
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Lấy thông tin user theo ID
router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password -login_name'); // Ẩn cả password và login_name
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// Cập nhật thông tin user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
