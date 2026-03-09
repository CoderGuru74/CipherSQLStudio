import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

/**
 * Simple Login Modal component
 */
const LoginModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.name, formData.email);
      showSuccess(`Welcome to CipherSQL Studio, ${formData.name}!`);
      setIsOpen(false);
      setFormData({ name: '', email: '' });
    } catch (error: any) {
      showError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ name: '', email: '' });
  };

  if (!isOpen) {
    return (
      <button className="login-button" onClick={handleOpen}>
        Sign In
      </button>
    );
  }

  return (
    <div className="login-modal">
      <div className="login-modal__overlay" onClick={handleClose}>
        <div className="login-modal__content" onClick={(e) => e.stopPropagation()}>
          <div className="login-modal__header">
            <h2 className="login-modal__title">Welcome to CipherSQL Studio</h2>
            <p className="login-modal__subtitle">Sign in to start your SQL learning journey</p>
          </div>

          <form className="login-modal__form" onSubmit={handleSubmit}>
            <div className="login-modal__field">
              <label htmlFor="name" className="login-modal__label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="login-modal__input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="login-modal__field">
              <label htmlFor="email" className="login-modal__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="login-modal__input"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="login-modal__button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="login-modal__spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <button
            type="button"
            className="login-modal__close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M4 16L16 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
