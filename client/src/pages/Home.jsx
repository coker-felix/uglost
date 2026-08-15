import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const CATEGORIES = ['Electronics', 'ID/Documents', 'Bags', 'Keys', 'Other'];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [kind, setKind] = useState('');

  async function fetchItems() {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (q.trim()) params.q = q.trim();
      if (category) params.category = category;
      if (kind) params.kind = kind;
      const { data } = await api.get('/items', { params });
      setItems(data.items);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    fetchItems();
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Lost something on campus?</h1>
        <p>
          Search the University of Ghana lost &amp; found register, or report what
          you lost or found.
        </p>
        <div className="hero-actions">
          <Link to="/report/lost" className="btn btn-primary">Report Lost</Link>
          <Link to="/report/found" className="btn btn-secondary">Report Found</Link>
        </div>
      </section>

      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by description or location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="">Lost &amp; Found</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : items.length === 0 ? (
        <p className="muted">No listings match your search.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
