import React, { useState } from 'react';
import '../styles/Dashboard.css';

export default function CreateInternship({ onCreate, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    type: 'Full-Time',
    duration: '',
    interns: 5,
    skills: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newInternship = {
        id: Date.now(),
        ...formData,
        status: 'Active',
        avgProgress: 0,
        active: 0,
        pending: formData.interns,
      };
      onCreate && onCreate(newInternship);
      setFormData({
        title: '',
        description: '',
        company: '',
        type: 'Full-Time',
        duration: '',
        interns: 5,
        skills: '',
        deadline: '',
      });
      setLoading(false);
      alert('Internship created successfully! ✅');
      onCancel && onCancel();
    }, 800);
  };

  return (
    <section className="box" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>➕ Create New Internship Program</h2>
      <form onSubmit={handleSubmit} className="form-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Program Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Full Stack Web Development"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., TechCorp Inc."
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the internship program..."
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Program Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Duration (weeks)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 12"
              min="1"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Number of Interns</label>
            <input
              type="number"
              name="interns"
              value={formData.interns}
              onChange={handleChange}
              min="1"
              max="100"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Required Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB (comma separated)"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 24px',
              border: '1px solid #ddd',
              backgroundColor: '#f5f5f5',
              color: '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 24px',
              backgroundColor: '#1E3A8A',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'wait' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating...' : '✅ Create Internship'}
          </button>
        </div>
      </form>
    </section>
  );
}
