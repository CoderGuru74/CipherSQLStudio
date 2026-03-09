import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { getProgressStats } from '../utils/progressTracker';

const Header: React.FC = () => {
  const location = useLocation();
  const [progressStats, setProgressStats] = useState({ completedCount: 0, totalCount: 0, completionRate: 0 });

  useEffect(() => {
    // Update progress stats when component mounts or location changes
    const stats = getProgressStats(10); // Assuming 10 total assignments
    setProgressStats(stats);
  }, [location]);

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
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
