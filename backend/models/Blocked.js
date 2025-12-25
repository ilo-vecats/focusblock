const mongoose = require('mongoose');

const BlockedSchema = new mongoose.Schema({
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  category: { type: String, default: 'General' }, 
  schedule: {
    enabled: { type: Boolean, default: false },
    startTime: String, 
    endTime: String,  
    days: [String],   
    preset: String     
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blocked', BlockedSchema);
