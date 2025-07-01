const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Client', clientSchema);
