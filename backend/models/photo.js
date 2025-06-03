const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: String,
  description: String,
  first_name: String,
  last_name: String,
  createdAt: { type: Date, default: Date.now },
  comments: {
    type: [commentSchema],
    default: []
  }
});

module.exports = mongoose.model('Photo', photoSchema);
