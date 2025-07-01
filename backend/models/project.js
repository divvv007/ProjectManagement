const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
