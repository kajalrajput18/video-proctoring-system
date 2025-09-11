import React, { useState, useEffect } from 'react';
import { getSessionReport, downloadPDFReport, downloadCSVReport } from '../services/api';

const Report = ({ sessionId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatedScore, setCalculatedScore] = useState(100);

  useEffect(() => {
    if (sessionId) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      const data = await getSessionReport(sessionId);
      setReport(data);
      
      const focusLostDeductions = (data.focusLostCount || 0) * 5;
      const suspiciousDeductions = (data.suspiciousEvents || 0) * 10;
      const totalDeductions = focusLostDeductions + suspiciousDeductions;
      const score = Math.max(0, 100 - totalDeductions);
      setCalculatedScore(score);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    await downloadPDFReport(sessionId);
  };

  const handleDownloadCSV = async () => {
    await downloadCSVReport(sessionId);
  };

  if (!sessionId) {
    return (
      <div className="report-container">
        <h2>Proctoring Report</h2>
        <p style={{ textAlign: 'center', padding: '40px' }}>
          Please start a session first to view the report.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading report...</div>;
  }

  if (!report) {
    return <div className="error">Failed to load report</div>;
  }

  const getScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  return (
    <div className="report-container">
      <h2>Proctoring Report</h2>
      
      <div className="report-header">
        <div className="candidate-info">
          <h3>Candidate Information</h3>
          <p><strong>Name:</strong> {report.candidateName}</p>
          <p><strong>Session Date:</strong> {new Date(report.startTime).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> {report.duration ? `${Math.floor(report.duration / 60)} minutes` : 'Ongoing'}</p>
        </div>
        
        <div className="integrity-score">
          <h3>Integrity Score</h3>
          <div className={`score ${getScoreClass(calculatedScore)}`}>
            {calculatedScore}/100
          </div>
          <div className="score-breakdown">
            <p>Focus Lost: -{(report.focusLostCount || 0) * 5} points</p>
            <p>Suspicious Events: -{(report.suspiciousEvents || 0) * 10} points</p>
          </div>
        </div>
      </div>

      <div className="report-summary">
        <h3>Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Focus Lost Count:</span>
            <span className="value">{report.focusLostCount || 0}</span>
          </div>
          <div className="summary-item">
            <span className="label">Suspicious Events:</span>
            <span className="value">{report.suspiciousEvents || 0}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Events:</span>
            <span className="value">{report.events?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="event-details">
        <h3>Event Timeline</h3>
        <div className="events-timeline">
          {!report.events || report.events.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No events recorded</p>
          ) : (
            report.events.map((event, index) => (
              <div key={index} className="timeline-event">
                <div className="event-time">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
                <div className={`event-content severity-${event.severity || 'medium'}`}>
                  <h4>{event.eventType.replace(/_/g, ' ')}</h4>
                  {event.details && <p>{event.details}</p>}
                  {event.duration && <p>Duration: {event.duration}s</p>}
                  <p className="event-impact">
                    Impact: -{event.eventType.includes('focus') || event.eventType.includes('looking') ? 5 : 10} points
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="report-actions">
        <button onClick={handleDownloadPDF} className="download-btn">
          Download PDF Report
        </button>
        <button onClick={handleDownloadCSV} className="download-btn">
          Download CSV Report
        </button>
      </div>
    </div>
  );
};

export default Report;