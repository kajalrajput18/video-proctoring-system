const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in seconds
  },
  focusLostCount: {
    type: Number,
    default: 0
  },
  suspiciousEvents: {
    type: Number,
    default: 0
  },
  integrityScore: {
    type: Number,
    default: 100
  },
  videoUrl: String,
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);