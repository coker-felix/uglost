import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'ID/Documents', 'Bags', 'Keys', 'Other'];

export default function ReportItem({ mode }) {
  const isLost = mode === 'lost';
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('category', form.category);
      data.append('description', form.description);
      data.append('location', form.location);
      data.append('date', form.date);
      if (photo) data.append('photo', photo);
      await api.post(`/items/${isLost ? 'lost' : 'found'}`, data);
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Failed to submit report';
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <div className="card">
        <h1>{isLost ? 'Report a lost item' : 'Report a found item'}</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            Category
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea
              rows={4}
              maxLength={500}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the item so the owner / finder can recognise it."
              required
            />
          </label>
          <label>
            {isLost ? 'Last known location' : 'Location found'}
            <input
              type="text"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              required
            />
          </label>
          <label>
            {isLost ? 'Date lost' : 'Date found'}
            <input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              required
            />
          </label>
          <label>
            Photo (optional)
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setPhoto(e.target.files[0] || null)}
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : isLost ? 'Report lost item' : 'Report found item'}
          </button>
        </form>
      </div>
    </div>
  );
}
