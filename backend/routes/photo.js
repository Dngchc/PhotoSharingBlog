const express = require('express');
const Photo = require('../models/photo');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Middleware xác thực token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header provided' });
  
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') 
      return res.status(401).json({ message: 'Authorization header format must be Bearer <token>' });
  
    const token = parts[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
  
      req.userId = user.id;
      next();
    });
  }
  

// Cấu hình multer lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// -------------------- ROUTES --------------------

// Upload ảnh mới
router.post('/newphoto', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const description = req.body.description || '';
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPhoto = new Photo({
      userId: req.userId,
      url: imageUrl,
      description,
      first_name: user.first_name,
      last_name: user.last_name
    });

    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Danh sách tất cả ảnh (mới nhất trước)
router.get('/photolist', async (req, res) => {
  try {
    const photos = await Photo.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'first_name last_name');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Danh sách ảnh của 1 user
router.get('/user/:id', async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Lấy chi tiết ảnh (bao gồm bình luận và thông tin người dùng)

router.get('/detail/:photoId', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId)
      .populate('userId', 'first_name last_name')
      .lean(); // chuyển về plain JS object để dễ chỉnh sửa

    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    if (photo.comments && photo.comments.length > 0) {
      // Lấy danh sách userId từ comments
      const userIds = photo.comments.map(c => c.userId);
      // Lấy thông tin user tương ứng
      const users = await User.find({ _id: { $in: userIds } }, 'first_name last_name').lean();

      // Tạo map userId -> user info
      const userMap = {};
      users.forEach(u => {
        userMap[u._id.toString()] = u;
      });

      // Gán user info vào từng comment
      photo.comments = photo.comments.map(c => ({
        ...c,
        userId: userMap[c.userId.toString()] || null,
      }));
    }

    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Cập nhật ảnh
router.put('/user/photo/:id', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (photo.userId.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    const { url, description } = req.body;
    if (url !== undefined) photo.url = url;
    if (description !== undefined) photo.description = description;

    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa ảnh
router.delete('/user/photo/:id', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (photo.userId.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    await photo.deleteOne();
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm bình luận mới
router.post('/:photoId/comments', verifyToken, async (req, res) => {
    try {
      const { comment } = req.body;
      if (!comment) return res.status(400).json({ message: 'Comment is required' });
  
      const photo = await Photo.findById(req.params.photoId);
      if (!photo) return res.status(404).json({ message: 'Photo not found' });
  
      // Đảm bảo mảng comments tồn tại
      if (!Array.isArray(photo.comments)) {
        photo.comments = [];
      }
  
      // Thêm bình luận mới
      photo.comments.push({
        userId: req.userId,
        comment,
        createdAt: new Date()
      });
  
      await photo.save();
  
      // Lấy lại ảnh và populate toàn bộ comments.userId
      const updatedPhoto = await Photo.findById(photo._id)
        .populate('comments.userId', 'first_name last_name');
  
      // Trả về bình luận vừa thêm (cuối mảng)
      const lastComment = updatedPhoto.comments[updatedPhoto.comments.length - 1];
  
      res.status(201).json(lastComment);
    } catch (err) {
      console.error('Error in POST /:photoId/comments:', err);
      res.status(500).json({ error: err.message });
    }
  });
  

// Sửa bình luận (chỉ người viết mới được sửa)
router.put('/:photoId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { comment } = req.body;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    const cmt = photo.comments.id(req.params.commentId);
    if (!cmt) return res.status(404).json({ message: 'Comment not found' });

    if (cmt.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own comment' });
    }

    cmt.comment = comment;
    await photo.save();
    res.json(cmt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa bình luận (người viết hoặc chủ ảnh mới được xóa)
router.delete('/:photoId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    const cmt = photo.comments.id(req.params.commentId);
    if (!cmt) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = photo.userId.toString() === req.userId;
    const isAuthor = cmt.userId.toString() === req.userId;
    if (!isOwner && !isAuthor) {
      return res.status(403).json({ message: 'Not allowed to delete this comment' });
    }

    cmt.remove();
    await photo.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
