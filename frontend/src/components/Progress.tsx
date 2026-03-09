import React from 'react';
import { getProgressStats } from '../utils/progressTracker';

/**
 * Progress component showing completion statistics
 */
const Progress: React.FC = () => {
  const stats = getProgressStats(10); // Total assignments would come from API

  return (
    <div className="progress">
      <div className="progress__header">
        <h1 className="progress__title">Your Progress</h1>
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
