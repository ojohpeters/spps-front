import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/dashboard" className="logo">
          <div className="logo-icon">S</div>
          SPPS
        </Link>
        
        <nav>
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/students">Students</Link></li>
            <li><Link to="/upload">Upload Results</Link></li>
            <li><Link to="/factors">Factors</Link></li>
            <li><Link to="/predictions">Predictions</Link></li>
          </ul>
        </nav>

        <div className="user-info">
          <span className="user-name">
            {user.first_name || user.username}
          </span>
          <span className="role-badge">
            {user.role}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
