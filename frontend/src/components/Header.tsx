import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import LoginModal from './LoginModal';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCompletionStats } = useProgress();

  // Calculate progress stats
  const progressStats = getCompletionStats(10); // Assuming 10 total assignments

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">SQL</div>
          <span>CipherSQL Studio</span>
        </Link>
        
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">
            Assignments
          </Link>
          <Link to="/progress" className="header__nav-link">
            Progress
            {progressStats.completionRate > 0 && (
              <span className="header__nav-badge">
                {progressStats.completionRate}%
              </span>
            )}
          </Link>
        </nav>

        <div className="header__user-menu">
          {user ? (
            <div className="header__user-greeting">
              <span className="header__greeting-text">
                Hello, {user.name}!
              </span>
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          ) : (
            <LoginModal />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
