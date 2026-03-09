import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/auth';
import { useToast } from '../hooks/useToast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

/**
 * Authentication modal component for login and signup
 */
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginUser(formData.email, formData.password);
        showSuccess(`Welcome back, ${user.name}!`);
        onClose();
      } else {
        const user = await registerUser(formData.name, formData.email, formData.password);
        showSuccess(`Welcome to CipherSQL Studio, ${user.name}!`);
        onClose();
      }
    } catch (error: any) {
      showError(error.message || 'Authentication failed');
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

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose}>
        <div className="auth-modal__content" onClick={(e) => e.stopPropagation()}>
          <div className="auth-modal__header">
            <h2 className="auth-modal__title">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-modal__subtitle">
              {mode === 'login' 
                ? 'Sign in to continue your SQL learning journey'
                : 'Join CipherSQL Studio and start learning SQL today'
              }
            </p>
          </div>

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-modal__field">
                <label htmlFor="name" className="auth-modal__label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="auth-modal__input"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div className="auth-modal__field">
              <label htmlFor="email" className="auth-modal__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="auth-modal__input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-modal__field">
              <label htmlFor="password" className="auth-modal__label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="auth-modal__input"
                placeholder="Enter your password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="auth-modal__button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="auth-modal__spinner"></div>
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="auth-modal__footer">
            <p className="auth-modal__switch-text">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="auth-modal__switch-button"
                onClick={switchMode}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <button
            type="button"
            className="auth-modal__close"
            onClick={onClose}
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

export default AuthModal;
