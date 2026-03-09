import React, { useState, useRef, useEffect } from 'react';
import { User } from '../contexts/AuthContext';

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
}

/**
 * Profile dropdown component with user menu options
 */
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileSettings = () => {
    setIsOpen(false);
    // Navigate to profile settings or show modal
    console.log(`Profile Settings for ${user.name} clicked`);
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (confirm(`Are you sure you want to logout, ${user.name}?`)) {
      onLogout();
    }
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className="profile-dropdown__avatar">
          <span className="profile-dropdown__initial">{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <span className="profile-dropdown__name">{user.name}</span>
        <svg
          className={`profile-dropdown__arrow ${isOpen ? 'profile-dropdown__arrow--open' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="profile-dropdown__menu">
          <div className="profile-dropdown__header">
            <div className="profile-dropdown__user-info">
              <div className="profile-dropdown__user-avatar">
                <span className="profile-dropdown__user-initial">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="profile-dropdown__user-details">
                <div className="profile-dropdown__user-name">{user.name}</div>
                <div className="profile-dropdown__user-email">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="profile-dropdown__divider"></div>

          <div className="profile-dropdown__options">
            <button
              className="profile-dropdown__option"
              onClick={handleProfileSettings}
            >
              <svg
                className="profile-dropdown__option-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 14C13 11.7909 10.7614 10 8 10C5.23858 10 3 11.7909 3 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Profile Settings</span>
            </button>

            <button
              className="profile-dropdown__option profile-dropdown__option--logout"
              onClick={handleLogout}
            >
              <svg
                className="profile-dropdown__option-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 8L14 8M14 8L11.5 5.5M14 8L11.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
