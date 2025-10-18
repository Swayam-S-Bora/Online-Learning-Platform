const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: { type: String, required: true },
  description: String,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);