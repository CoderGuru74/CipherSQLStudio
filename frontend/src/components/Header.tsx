import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
          </Link>
        </nav>

        <div className="header__user-menu">
          <button className="header__user-button">
            <div className="header__user-avatar">U</div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
