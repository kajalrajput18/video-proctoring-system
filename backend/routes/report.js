const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Event = require('../models/Event');
const { generatePDFReport, generateCSVReport } = require('../utils/reportGenerator');

// Get session report
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('events');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF report
router.get('/pdf/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('events');
    
    const pdfBuffer = await generatePDFReport(session);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="proctor-report-${session.candidateName}.pdf"`
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate CSV report
router.get('/csv/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('events');
    
    const csv = await generateCSVReport(session);
    
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="proctor-report-${session.candidateName}.csv"`
    });
    
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;