const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// In the log-event endpoint, after updating session counters
router.post('/log-event', async (req, res) => {
  try {
    const { sessionId, eventType, duration, details } = req.body;
    
    const event = new Event({
      sessionId,
      eventType,
      duration,
      details
    });
    
    await event.save();
    
    // Update session counters
    const session = await Session.findById(sessionId);
    if (eventType === 'focus_lost' || eventType === 'looking_away') {
      session.focusLostCount++;
    } else {
      session.suspiciousEvents++;
    }
    session.events.push(event._id);
    
    // Calculate real-time integrity score
    const deductions = session.focusLostCount * 5 + session.suspiciousEvents * 10;
    session.integrityScore = Math.max(0, 100 - deductions);
    
    await session.save();
    
    res.json({ success: true, event, integrityScore: session.integrityScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const upload = multer({ storage });

// Start a new session
router.post('/start-session', async (req, res) => {
  try {
    const { candidateName } = req.body;
    const session = new Session({ candidateName });
    await session.save();
    res.json({ success: true, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End session
router.post('/end-session/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000);
    
    // Calculate integrity score
    const deductions = session.focusLostCount * 5 + session.suspiciousEvents * 10;
    session.integrityScore = Math.max(0, 100 - deductions);
    
    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log event
router.post('/log-event', async (req, res) => {
  try {
    const { sessionId, eventType, duration, details } = req.body;
    
    const event = new Event({
      sessionId,
      eventType,
      duration,
      details
    });
    
    await event.save();
    
    // Update session counters
    const session = await Session.findById(sessionId);
    if (eventType === 'focus_lost' || eventType === 'looking_away') {
      session.focusLostCount++;
    } else {
      session.suspiciousEvents++;
    }
    session.events.push(event._id);
    await session.save();
    
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload-video/:sessionId', upload.single('video'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    session.videoUrl = `/videos/${req.file.filename}`;
    await session.save();
    res.json({ success: true, videoUrl: session.videoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;