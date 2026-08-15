import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/items', { params: { status: 'all' } });
      setItems(data.items);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    try {
      await api.delete(`/items/${id}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to remove listing');
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>All Listings</h1>
        <Link to="/admin" className="btn btn-secondary">Back to claims</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kind</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.kind === 'lost' ? 'Lost' : 'Found'}</td>
                  <td>{i.category}</td>
                  <td>{i.description.slice(0, 60)}</td>
                  <td>
                    <span className={`badge badge-${i.status}`}>{i.status}</span>
                  </td>
                  <td>
                    {i.status !== 'removed' && (
                      <button className="btn btn-danger btn-sm" onClick={() => remove(i.id)}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
