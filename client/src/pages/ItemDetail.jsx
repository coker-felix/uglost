import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ItemDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showClaim, setShowClaim] = useState(false);
  const [answer, setAnswer] = useState('');
  const [claimMsg, setClaimMsg] = useState('');
  const [claimError, setClaimError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/items/${id}`);
      setItem(data.item);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load item');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function submitClaim(e) {
    e.preventDefault();
    setClaimError('');
    setClaimMsg('');
    try {
      await api.post('/claims', { foundItemId: item.id, verificationAnswer: answer });
      setClaimMsg('Claim submitted! An administrator will review it shortly.');
      setShowClaim(false);
      setAnswer('');
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to submit claim');
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }
  if (error || !item) {
    return (
      <div className="page">
        <p className="error">{error || 'Item not found'}</p>
      </div>
    );
  }

  const canClaim = item.kind === 'found' && item.status === 'active' && token;

  return (
    <div className="page narrow">
      <Link to="/" className="back-link">← Back to search</Link>
      <div className="card detail">
        {item.photoUrl && (
          <img className="detail-photo" src={item.photoUrl} alt={item.category} />
        )}
        <div className="detail-head">
          <span className={`badge badge-${item.kind}`}>
            {item.kind === 'lost' ? 'Lost' : 'Found'}
          </span>
          <span className={`badge badge-${item.status}`}>{item.status}</span>
        </div>
        <h1>{item.category}</h1>
        <p className="detail-desc">{item.description}</p>
        <dl className="detail-meta">
          <div>
            <dt>Location</dt>
            <dd>{item.location}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{item.date}</dd>
          </div>
        </dl>

        {canClaim && !showClaim && (
          <button className="btn btn-primary" onClick={() => setShowClaim(true)}>
            Claim this item
          </button>
        )}

        {canClaim && showClaim && (
          <form className="form" onSubmit={submitClaim}>
            <label>
              Describe a distinguishing detail to verify ownership
              <textarea
                rows={3}
                maxLength={1000}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="e.g. a scratch on the corner, the contents of the bag…"
                required
              />
            </label>
            {claimError && <p className="error">{claimError}</p>}
            <button type="submit" className="btn btn-primary">Submit claim</button>
          </form>
        )}

        {claimMsg && <p className="success">{claimMsg}</p>}

        {item.kind === 'found' && item.status === 'active' && !token && (
          <p className="muted">
            <Link to="/login">Log in</Link> to claim this item.
          </p>
        )}
      </div>
    </div>
  );
}
