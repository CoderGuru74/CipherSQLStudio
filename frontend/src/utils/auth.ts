/**
 * Authentication utilities for local storage management
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

/**
 * Get current authentication state from localStorage
 */
export const getAuthState = (): AuthState => {
  try {
    const stored = localStorage.getItem('ciphersql_auth');
    if (stored) {
      const authData = JSON.parse(stored);
      return {
        user: authData.user,
        isAuthenticated: !!authData.user,
      };
    }
  } catch (error) {
    console.error('Error reading auth data:', error);
  }
  
  return {
    user: null,
    isAuthenticated: false,
  };
};

/**
 * Save authentication state to localStorage
 */
export const saveAuthState = (user: User): void => {
  try {
    const authData = {
      user,
      isAuthenticated: true,
    };
    localStorage.setItem('ciphersql_auth', JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

/**
 * Clear authentication state from localStorage
 */
export const clearAuthState = (): void => {
  try {
    localStorage.removeItem('ciphersql_auth');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Login user with email and password (mock validation)
 */
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Mock authentication - in real app, this would be an API call
    setTimeout(() => {
      // Simple validation for demo
      if (email && password.length >= 6) {
        const user: User = {
          id: Date.now().toString(),
          name: email.split('@')[0], // Extract name from email
          email,
          createdAt: new Date().toISOString(),
        };
        
        saveAuthState(user);
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

/**
 * Register new user
 */
export const registerUser = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Mock registration - in real app, this would be an API call
    setTimeout(() => {
      // Simple validation for demo
      if (name && email && password.length >= 6) {
        const user: User = {
          id: Date.now().toString(),
          name,
          email,
          createdAt: new Date().toISOString(),
        };
        
        saveAuthState(user);
        resolve(user);
      } else {
        reject(new Error('Please fill all fields with valid data'));
      }
    }, 500);
  });
};

/**
 * Logout user
 */
export const logoutUser = (): void => {
  clearAuthState();
  // In a real app, you might want to redirect to login page
  window.location.reload();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated;
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  const authState = getAuthState();
  return authState.user;
};
