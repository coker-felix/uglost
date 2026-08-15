import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MyActivity() {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [itemsRes, claimsRes] = await Promise.all([
          api.get('/items/mine'),
          api.get('/claims/mine'),
        ]);
        setItems(itemsRes.data.items);
        setClaims(claimsRes.data.claims);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Activity</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>My reports</h2>
        {items.length === 0 ? (
          <p className="muted">You have no reports yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.kind === 'lost' ? 'Lost' : 'Found'}</td>
                    <td>{i.category}</td>
                    <td>
                      <Link to={`/items/${i.id}`}>{i.description.slice(0, 60)}</Link>
                    </td>
                    <td>
                      <span className={`badge badge-${i.status}`}>{i.status}</span>
                    </td>
                    <td>{i.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2>My claims</h2>
        {claims.length === 0 ? (
          <p className="muted">You have no claims yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Verification answer</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.foundItem ? (
                        <Link to={`/items/${c.foundItem.id}`}>{c.foundItem.category}</Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td>{c.verificationAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
