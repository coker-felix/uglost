import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  const isLost = item.kind === 'lost';
  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <div className="item-card-photo">
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.category} loading="lazy" />
        ) : (
          <div className="photo-placeholder">{isLost ? 'Lost' : 'Found'}</div>
        )}
      </div>
      <div className="item-card-body">
        <div className="item-card-top">
          <span className={`badge badge-${item.kind}`}>{isLost ? 'Lost' : 'Found'}</span>
          <span className="badge badge-category">{item.category}</span>
        </div>
        <p className="item-card-desc">{item.description}</p>
        <div className="item-card-meta">
          <span className="truncate">{item.location}</span>
          <span>{item.date}</span>
        </div>
      </div>
    </Link>
  );
}
