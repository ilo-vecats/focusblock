const mongoose = require('mongoose');

const BlockedSchema = new mongoose.Schema({
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  category: { type: String, default: 'General' }, // e.g., "Social Media", "Entertainment", "Shopping"
  schedule: {
    enabled: { type: Boolean, default: false },
    startTime: String, // e.g., "09:00"
    endTime: String,   // e.g., "17:00"
    days: [String],    // e.g., ["Monday", "Tuesday", "Wednesday"]
    preset: String     // e.g., "work-hours", "weekends", "custom"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blocked', BlockedSchema);