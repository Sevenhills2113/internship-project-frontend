import React, { useState } from 'react';
import { mentorService } from '../services/api.service.js';
import { validateTaskForm } from '../utils/validation.js';
import { formatErrorMessage } from '../utils/errorHandler.js';
import '../styles/Dashboard.css';

/**
 * CreateTask Component
 * Allows mentors to create tasks for internship programs
 * Integrates with POST /api/tasks endpoint
 */
export default function CreateTask({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [program, setProgram] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(false);

  const validation = validateTaskForm({ title, program, deadline });
  if (!validation.isValid) {
    setError(Object.values(validation.errors).join(', '));
    return;
  }

  setLoading(true);

  try {
    const mentorId = localStorage.getItem("userId");

    // ⚠️ IMPORTANT: you must select internId
    // For now let's assume you pass it as prop or hardcode temporarily
    const internId = program; // ⚠️ Replace with actual internId selector

    const taskData = {
      title,
      deadline,
      internId: Number(internId),
      mentorId: Number(mentorId)
    };

    const response = await mentorService.createTask(taskData);

    setSuccess(true);
    setTitle('');
    setDescription('');
    setProgram('');
    setDeadline('');

    onCreate && onCreate(response);

  } catch (err) {
    setError(formatErrorMessage(err));
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="box">
      <h2>➕ Create Task</h2>
      
      {error && (
        <div style={{
          padding: '10px 15px',
          marginBottom: '15px',
          backgroundColor: '#fee',
          border: '1px solid #f99',
          borderRadius: '4px',
          color: '#c00',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '10px 15px',
          marginBottom: '15px',
          backgroundColor: '#efe',
          border: '1px solid #9f9',
          borderRadius: '4px',
          color: '#0a0',
          fontSize: '14px'
        }}>
          ✅ Task created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-stack">
        <label>Title *</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter task title"
          required 
        />

        <label>Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows="4"
        />

        <label>Program/Internship *</label>
        <input 
          value={program} 
          onChange={(e) => setProgram(e.target.value)}
          placeholder="Select or enter program name"
          required 
        />

        <label>Deadline *</label>
        <input 
          type="date" 
          value={deadline} 
          onChange={(e) => setDeadline(e.target.value)} 
          required 
        />

        <label>Initial Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </section>
  );
}
