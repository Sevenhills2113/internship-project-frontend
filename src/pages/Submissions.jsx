import React, { useEffect, useState } from 'react';
import { internService, mentorService } from '../services/api.service.js';
import { formatErrorMessage } from '../utils/errorHandler.js';
import '../styles/Dashboard.css';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [reviewingId, setReviewingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole') || 'Intern';

  useEffect(() => {
    if (!userId) {
      window.location.href = '/';
      return;
    }
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubmissions = async () => {
    try {
      let data = [];
      if (userRole.toLowerCase() === 'mentor') {
        data = await mentorService.getPendingSubmissions().catch(() => null);
      } else {
        data = await internService.getSubmissions().catch(() => null);
      }

      if (Array.isArray(data)) {
        const normalized = data.map(s => ({
          id: s.id || `sub-${Date.now()}-${Math.random()}`,
          taskName: s.task || s.taskName || 'Unknown Task',
          student: s.student || s.internName || s.name || 'Anonymous',
          submittedDate: s.submittedDate || s.submittedAt || new Date().toISOString(),
          status: s.status || 'Pending',
          url: s.url || s.submissionUrl || '#',
          feedback: s.feedback || '',
        }));
        setSubmissions(normalized.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)));
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.warn('Failed to fetch submissions:', formatErrorMessage(err));
      // Fallback demo data
      setSubmissions([
        { id: 1, taskName: 'React Component', student: 'Alex Johnson', submittedDate: '2026-02-18', status: 'Pending', url: 'https://github.com/alex/project', feedback: '' },
        { id: 2, taskName: 'API Integration', student: 'Sam Patel', submittedDate: '2026-02-17', status: 'Pending', url: 'https://github.com/sam/api', feedback: '' },
        { id: 3, taskName: 'UI Design', student: 'Jordan Lee', submittedDate: '2026-02-16', status: 'Approved', url: 'https://github.com/jordan/ui', feedback: 'Great work!' },
        { id: 4, taskName: 'Database Schema', student: 'Casey Brown', submittedDate: '2026-02-15', status: 'Rejected', url: 'https://github.com/casey/db', feedback: 'Need optimization' },
      ]);
    }
    setLoading(false);
  };

  const handleApprove = async (submissionId) => {
    setReviewingId(submissionId);
    setError(null);
    try {
      const feedbackText = feedback[submissionId] || '';
      if (userRole.toLowerCase() === 'mentor') {
        await mentorService.approveSubmission(submissionId, feedbackText).catch(() => null);
      }
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'Approved', feedback: feedbackText } : s));
      setFeedback(prev => ({ ...prev, [submissionId]: '' }));
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (submissionId) => {
    setReviewingId(submissionId);
    setError(null);
    try {
      const feedbackText = feedback[submissionId] || 'Please resubmit';
      if (userRole.toLowerCase() === 'mentor') {
        await mentorService.rejectSubmission(submissionId, feedbackText).catch(() => null);
      }
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'Rejected', feedback: feedbackText } : s));
      setFeedback(prev => ({ ...prev, [submissionId]: '' }));
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setReviewingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#2E7D32';
      case 'Rejected': return '#D32F2F';
      default: return '#F57F17';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Approved': return '#E8F5E9';
      case 'Rejected': return '#FFE0E0';
      default: return '#FFF9E6';
    }
  };

  const filteredSubmissions = filter === 'All' ? submissions : submissions.filter(s => s.status === filter);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
        <span style={{ fontSize: '18px' }}>⏳ Loading submissions...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
          📥 Submissions
        </h1>
        <div style={{
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
          padding: '10px 16px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {filteredSubmissions.length} {filter === 'All' ? 'Total' : filter}
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          backgroundColor: '#FFE0E0',
          border: '1px solid #F8BBD0',
          borderRadius: '6px',
          color: '#D32F2F',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              backgroundColor: filter === status ? '#1E40AF' : '#f5f5f5',
              color: filter === status ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#999',
          fontSize: '16px'
        }}>
          No submissions found in {filter} status
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              style={{
                border: '1px solid #E8E8E8',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#FAFAFA',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              {/* Header: Task & Student Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    {submission.taskName}
                  </h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#666' }}>
                    👤 <strong>{submission.student}</strong>
                  </p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#888' }}>
                    📅 Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                  </p>
                  {submission.url && submission.url !== '#' && (
                    <a href={submission.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '12px',
                      color: '#1E40AF',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}>
                      🔗 View Submission
                    </a>
                  )}
                </div>

                {/* Status Badge */}
                <span style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: getStatusBg(submission.status),
                  color: getStatusColor(submission.status),
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {submission.status}
                </span>
              </div>

              {/* Feedback Display */}
              {submission.feedback && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  borderLeft: `3px solid ${getStatusColor(submission.status)}`,
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px'
                }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                    💬 Feedback:
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>
                    {submission.feedback}
                  </p>
                </div>
              )}

              {/* Action Buttons - Only for Pending and Mentor Role */}
              {submission.status === 'Pending' && userRole.toLowerCase() === 'mentor' && (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid #E8E8E8',
                  paddingTop: '16px',
                  flexWrap: 'wrap'
                }}>
                  {/* Feedback Input */}
                  <div style={{ width: '100%', marginBottom: '12px' }}>
                    <textarea
                      value={feedback[submission.id] || ''}
                      onChange={(e) => setFeedback(prev => ({ ...prev, [submission.id]: e.target.value }))}
                      placeholder="Add feedback (optional)..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleApprove(submission.id)}
                    disabled={reviewingId === submission.id}
                    style={{
                      backgroundColor: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: reviewingId === submission.id ? 'wait' : 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      opacity: reviewingId === submission.id ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {reviewingId === submission.id ? '⏳ Processing...' : '✅ Approve'}
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(submission.id)}
                    disabled={reviewingId === submission.id}
                    style={{
                      backgroundColor: '#D32F2F',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: reviewingId === submission.id ? 'wait' : 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      opacity: reviewingId === submission.id ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {reviewingId === submission.id ? '⏳ Processing...' : '❌ Reject'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
