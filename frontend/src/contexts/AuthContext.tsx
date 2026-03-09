import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER'; payload: User | null };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOAD_USER':
      return {
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ciphersql_auth');
      if (stored) {
        const authData = JSON.parse(stored);
        if (authData.user) {
          dispatch({ type: 'LOAD_USER', payload: authData.user });
        } else {
          dispatch({ type: 'LOAD_USER', payload: null });
        }
      } else {
        dispatch({ type: 'LOAD_USER', payload: null });
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      dispatch({ type: 'LOAD_USER', payload: null });
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      try {
        const authData = {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        };
        localStorage.setItem('ciphersql_auth', JSON.stringify(authData));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    }
  }, [state.user, state.isAuthenticated]);

  const login = async (name: string, email: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple validation
    if (!name || !email) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error('Name and email are required');
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  const logout = () => {
    // Clear localStorage
    try {
      localStorage.removeItem('ciphersql_auth');
      localStorage.removeItem('ciphersql_progress');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
