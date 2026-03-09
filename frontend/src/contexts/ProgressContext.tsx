import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface ProgressState {
  completedAssignments: string[];
  totalAttempts: number;
  lastUpdated: string | null;
}

export interface ProgressContextType extends ProgressState {
  markAssignmentCompleted: (assignmentId: string) => void;
  isAssignmentCompleted: (assignmentId: string) => boolean;
  getCompletionStats: (totalAssignments: number) => {
    completedCount: number;
    totalCount: number;
    completionRate: number;
    totalAttempts: number;
  };
  clearProgress: () => void;
}

// Action types
type ProgressAction =
  | { type: 'MARK_COMPLETED'; payload: string }
  | { type: 'LOAD_PROGRESS'; payload: ProgressState }
  | { type: 'CLEAR_PROGRESS' }
  | { type: 'INCREMENT_ATTEMPTS' };

// Reducer
const progressReducer = (state: ProgressState, action: ProgressAction): ProgressState => {
  switch (action.type) {
    case 'MARK_COMPLETED':
      return {
        ...state,
        completedAssignments: state.completedAssignments.includes(action.payload)
          ? state.completedAssignments
          : [...state.completedAssignments, action.payload],
        lastUpdated: new Date().toISOString(),
      };
    case 'LOAD_PROGRESS':
      return action.payload;
    case 'CLEAR_PROGRESS':
      return {
        completedAssignments: [],
        totalAttempts: 0,
        lastUpdated: null,
      };
    case 'INCREMENT_ATTEMPTS':
      return {
        ...state,
        totalAttempts: state.totalAttempts + 1,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: ProgressState = {
  completedAssignments: [],
  totalAttempts: 0,
  lastUpdated: null,
};

// Context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Provider component
export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ciphersql_progress');
      if (stored) {
        const progressData = JSON.parse(stored);
        dispatch({ type: 'LOAD_PROGRESS', payload: progressData });
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      const progressData = {
        completedAssignments: state.completedAssignments,
        totalAttempts: state.totalAttempts,
        lastUpdated: state.lastUpdated,
      };
      localStorage.setItem('ciphersql_progress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }, [state]);

  const markAssignmentCompleted = (assignmentId: string) => {
    dispatch({ type: 'MARK_COMPLETED', payload: assignmentId });
  };

  const isAssignmentCompleted = (assignmentId: string): boolean => {
    return state.completedAssignments.includes(assignmentId);
  };

  const getCompletionStats = (totalAssignments: number) => {
    const completedCount = state.completedAssignments.length;
    const completionRate = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;
    
    return {
      completedCount,
      totalCount: totalAssignments,
      completionRate,
      totalAttempts: state.totalAttempts,
    };
  };

  const clearProgress = () => {
    try {
      localStorage.removeItem('ciphersql_progress');
    } catch (error) {
      console.error('Error clearing progress from localStorage:', error);
    }
    dispatch({ type: 'CLEAR_PROGRESS' });
  };

  const value: ProgressContextType = {
    ...state,
    markAssignmentCompleted,
    isAssignmentCompleted,
    getCompletionStats,
    clearProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

// Hook to use progress context
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
