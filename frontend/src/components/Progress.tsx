import React from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Mock assignment data
const mockAssignments = [
  { id: '1', title: 'Basic SELECT Queries', difficulty: 'easy' },
  { id: '2', title: 'JOIN Operations', difficulty: 'medium' },
  { id: '3', title: 'Aggregate Functions', difficulty: 'medium' },
  { id: '4', title: 'Subqueries and CTEs', difficulty: 'hard' },
  { id: '5', title: 'GROUP BY and HAVING', difficulty: 'medium' },
  { id: '6', title: 'Window Functions', difficulty: 'hard' },
  { id: '7', title: 'JSON Functions', difficulty: 'medium' },
  { id: '8', title: 'Recursive CTEs', difficulty: 'hard' },
  { id: '9', title: 'Performance Tuning', difficulty: 'hard' },
  { id: '10', title: 'Advanced Joins', difficulty: 'hard' },
];

/**
 * Progress component showing completion statistics
 */
const Progress: React.FC = () => {
  const { completedAssignments, totalAttempts } = useProgress();
  const { user } = useAuth();

  const stats = {
    completedCount: completedAssignments.length,
    totalCount: mockAssignments.length,
    completionRate: mockAssignments.length > 0 ? Math.round((completedAssignments.length / mockAssignments.length) * 100) : 0,
    totalAttempts,
  };
        return (
    <div className="progress">
      <div className="progress__header">
        <h1 className="progress__title">
          {user ? `Welcome back, ${user.name}!` : 'Your Progress'}
        </h1>
        <p className="progress__subtitle">Track your SQL learning journey</p>
      </div>

      <div className="progress__stats">
        <div className="progress__stat-card">
          <div className="progress__stat-number">{stats.completedCount}</div>
          <div className="progress__stat-label">Completed</div>
        </div>
        
        <div className="progress__stat-card">
          <div className="progress__stat-number">{stats.totalCount}</div>
          <div className="progress__stat-label">Total</div>
        </div>
        
        <div className="progress__stat-card">
          <div className="progress__stat-number">{stats.completionRate}%</div>
          <div className="progress__stat-label">Completion Rate</div>
        </div>
        
        <div className="progress__stat-card">
          <div className="progress__stat-number">{stats.totalAttempts}</div>
          <div className="progress__stat-label">Total Attempts</div>
        </div>
      </div>

      <div className="progress__overview">
        <h2 className="progress__section-title">Overview</h2>
        
        <div className="progress__progress-bar">
          <div className="progress__progress-fill" style={{ width: `${stats.completionRate}%` }}>
            <span className="progress__progress-text">{stats.completionRate}% Complete</span>
          </div>
        </div>

        <div className="progress__assignments">
          <h3 className="progress__assignments-title">Assignments</h3>
          
          <div className="progress__assignment-list">
            {mockAssignments.map((assignment) => (
              <Link 
                key={assignment.id} 
                to={`/assignment/${assignment.id}`}
                className={`progress__assignment-item ${
                  completedAssignments.includes(assignment.id) ? 'progress__assignment-item--completed' : ''
                }`}
              >
                <div className="progress__assignment-info">
                  <div className="progress__assignment-title">{assignment.title}</div>
                  <div className="progress__assignment-difficulty">
                    <span className={`progress__difficulty progress__difficulty--${assignment.difficulty}`}>
                      {assignment.difficulty}
                    </span>
                  </div>
                </div>
                {completedAssignments.includes(assignment.id) && (
                  <div className="progress__assignment-badge">
                    ✓ Completed
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="progress__achievements">
          <h3 className="progress__achievements-title">Achievements</h3>
          
          {stats.completedCount > 0 && (
            <div className="progress__achievement">
              <div className="progress__achievement-icon">🏆</div>
              <div className="progress__achievement-content">
                <div className="progress__achievement-title">First Steps</div>
                <div className="progress__achievement-description">Complete your first assignment</div>
              </div>
            </div>
          )}
          
          {stats.completedCount >= 5 && (
            <div className="progress__achievement">
              <div className="progress__achievement-icon">⭐</div>
              <div className="progress__achievement-content">
                <div className="progress__achievement-title">SQL Learner</div>
                <div className="progress__achievement-description">Complete 5 assignments</div>
              </div>
            </div>
          )}
          
          {stats.completionRate === 100 && (
            <div className="progress__achievement">
              <div className="progress__achievement-icon">🎯</div>
              <div className="progress__achievement-content">
                <div className="progress__achievement-title">Master</div>
                <div className="progress__achievement-description">Complete all assignments</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
