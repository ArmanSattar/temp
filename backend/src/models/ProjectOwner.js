const mongoose = require('mongoose');

const projectOwnerSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProjectOwner', projectOwnerSchema); 