import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          UG<span>Lost</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/report/lost">Report Lost</NavLink>
          <NavLink to="/report/found">Report Found</NavLink>
          {token && <NavLink to="/me">My Activity</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-auth">
          {token ? (
            <>
              <span className="nav-user">{user?.name}</span>
              <button className="btn btn-ghost" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
