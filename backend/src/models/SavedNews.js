const mongoose = require('mongoose');

const savedNewsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  url: String,
  imageUrl: String,
  source: String,
  publishedAt: Date
}, { collection: 'savednews' });

module.exports = mongoose.model('SavedNews', savedNewsSchema);
