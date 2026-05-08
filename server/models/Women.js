const mongoose = require('mongoose');

const womenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  occupation: String,
  // Add more fields as needed
}, { collection: 'women_collection' });

module.exports = mongoose.model('Women', womenSchema);