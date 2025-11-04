const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: Number },
  description: { type: String },
  price: { type: Number }
}, { timestamps: true });
  
module.exports = mongoose.model('Course', courseSchema);