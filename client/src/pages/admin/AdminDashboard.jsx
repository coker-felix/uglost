import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/claims/pending');
      setClaims(data.claims);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id, action) {
    try {
      await api.patch(`/claims/${id}/${action}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Action failed');
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/listings" className="btn btn-secondary">All listings</Link>
      </div>
      <h2>Pending claims</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : claims.length === 0 ? (
        <p className="muted">No pending claims.</p>
      ) : (
        <div className="claim-list">
          {claims.map((c) => (
            <div className="card claim-card" key={c.id}>
              <div className="claim-head">
                <span className="badge badge-category">{c.foundItem?.category}</span>
                <span className="muted">Claim #{c.id}</span>
              </div>
              {c.foundItem?.photoUrl && (
                <img className="claim-photo" src={c.foundItem.photoUrl} alt={c.foundItem.category} />
              )}
              <p><strong>Item:</strong> {c.foundItem?.description}</p>
              <p><strong>Location:</strong> {c.foundItem?.location}</p>
              <p><strong>Claimant:</strong> {c.claimant?.name} ({c.claimant?.email})</p>
              <p><strong>Verification answer:</strong> {c.verificationAnswer}</p>
              <div className="claim-actions">
                <button className="btn btn-success" onClick={() => act(c.id, 'approve')}>Approve</button>
                <button className="btn btn-danger" onClick={() => act(c.id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
