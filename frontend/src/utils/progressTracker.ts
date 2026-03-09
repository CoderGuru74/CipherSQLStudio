/**
 * Progress tracking utility for completed assignments
 * Stores completed assignment IDs in localStorage
 */

export interface ProgressData {
  completedAssignments: string[];
  totalAttempts: number;
  lastUpdated: string;
}

/**
 * Get current progress data from localStorage
 */
export const getProgressData = (): ProgressData => {
  try {
    const stored = localStorage.getItem('ciphersql_progress');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading progress data:', error);
  }
  
  return {
    completedAssignments: [],
    totalAttempts: 0,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Save progress data to localStorage
 */
export const saveProgressData = (data: ProgressData): void => {
  try {
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('ciphersql_progress', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving progress data:', error);
  }
};

/**
 * Mark an assignment as completed
 */
export const markAssignmentCompleted = (assignmentId: string): void => {
  const progressData = getProgressData();
  
  if (!progressData.completedAssignments.includes(assignmentId)) {
    progressData.completedAssignments.push(assignmentId);
    progressData.totalAttempts += 1;
    saveProgressData(progressData);
  }
};

/**
 * Check if an assignment is completed
 */
export const isAssignmentCompleted = (assignmentId: string): boolean => {
  const progressData = getProgressData();
  return progressData.completedAssignments.includes(assignmentId);
};

/**
 * Get progress statistics
 */
export const getProgressStats = (totalAssignments: number) => {
  const progressData = getProgressData();
  const completedCount = progressData.completedAssignments.length;
  const completionRate = totalAssignments > 0 ? (completedCount / totalAssignments) * 100 : 0;
  
  return {
    completedCount,
    totalCount: totalAssignments,
    completionRate: Math.round(completionRate),
    totalAttempts: progressData.totalAttempts,
    lastUpdated: progressData.lastUpdated,
  };
};

/**
 * Clear all progress data
 */
export const clearProgressData = (): void => {
  try {
    localStorage.removeItem('ciphersql_progress');
  } catch (error) {
    console.error('Error clearing progress data:', error);
  }
};
