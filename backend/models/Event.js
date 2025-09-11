const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  eventType: {
    type: String,
    enum: ['focus_lost', 'no_face', 'multiple_faces', 'phone_detected', 
           'book_detected', 'device_detected', 'looking_away'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: Number, // in seconds
  details: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);