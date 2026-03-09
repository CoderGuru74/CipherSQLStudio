import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  estimatedTime: number;
  completed: boolean;
  progress: number;
  totalAttempts: number;
  successRate: number;
}

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Basic SELECT Queries',
        description: 'Learn how to retrieve data from a single table using SELECT statements with WHERE clauses.',
        difficulty: 'easy',
        category: 'Basics',
        estimatedTime: 15,
        completed: true,
        progress: 100,
        totalAttempts: 3,
        successRate: 100
      },
      {
        id: '2',
        title: 'JOIN Operations',
        description: 'Master INNER JOIN, LEFT JOIN, and RIGHT JOIN to combine data from multiple tables.',
        difficulty: 'medium',
        category: 'Joins',
        estimatedTime: 30,
        completed: false,
        progress: 60,
        totalAttempts: 5,
        successRate: 80
      },
      {
        id: '3',
        title: 'Aggregate Functions',
        description: 'Use COUNT, SUM, AVG, MIN, and MAX functions to perform calculations on data.',
        difficulty: 'medium',
        category: 'Aggregation',
        estimatedTime: 25,
        completed: false,
        progress: 0,
        totalAttempts: 0,
        successRate: 0
      },
      {
        id: '4',
        title: 'Subqueries and CTEs',
        description: 'Advanced techniques using subqueries, Common Table Expressions, and nested queries.',
        difficulty: 'hard',
        category: 'Advanced',
        estimatedTime: 45,
        completed: false,
        progress: 0,
        totalAttempts: 0,
        successRate: 0
      },
      {
        id: '5',
        title: 'GROUP BY and HAVING',
        description: 'Group data and filter groups using GROUP BY and HAVING clauses.',
        difficulty: 'medium',
        category: 'Aggregation',
        estimatedTime: 35,
        completed: false,
        progress: 20,
        totalAttempts: 2,
        successRate: 50
      },
      {
        id: '6',
        title: 'Window Functions',
        description: 'Learn ROW_NUMBER, RANK, DENSE_RANK, and other window functions for advanced analytics.',
        difficulty: 'hard',
        category: 'Advanced',
        estimatedTime: 60,
        completed: false,
        progress: 0,
        totalAttempts: 0,
        successRate: 0
      }
    ];

    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'completed') return assignment.completed;
    return assignment.difficulty === filter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'assignment-card__difficulty--easy';
      case 'medium':
        return 'assignment-card__difficulty--medium';
      case 'hard':
        return 'assignment-card__difficulty--hard';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="assignment-list">
        <div className="assignment-list__container">
          <div className="loading">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <div className="assignment-list__container">
        <header className="assignment-list__header">
          <h1 className="assignment-list__title">SQL Learning Assignments</h1>
          <p className="assignment-list__subtitle">
            Master SQL through hands-on practice with real-world scenarios
          </p>
        </header>

        <div className="assignment-list__filters">
          <button
            className={`assignment-list__filter-button ${
              filter === 'all' ? 'assignment-list__filter-button--active' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button
            className={`assignment-list__filter-button ${
              filter === 'completed' ? 'assignment-list__filter-button--active' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed ({assignments.filter(a => a.completed).length})
          </button>
          <button
            className={`assignment-list__filter-button ${
              filter === 'easy' ? 'assignment-list__filter-button--active' : ''
            }`}
            onClick={() => setFilter('easy')}
          >
            Easy
          </button>
          <button
            className={`assignment-list__filter-button ${
              filter === 'medium' ? 'assignment-list__filter-button--active' : ''
            }`}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button
            className={`assignment-list__filter-button ${
              filter === 'hard' ? 'assignment-list__filter-button--active' : ''
            }`}
            onClick={() => setFilter('hard')}
          >
            Hard
          </button>
        </div>

        {filteredAssignments.length === 0 ? (
          <div className="assignment-list__empty">
            <div className="assignment-list__empty-icon">📚</div>
            <h2 className="assignment-list__empty-title">No assignments found</h2>
            <p className="assignment-list__empty-description">
              Try adjusting your filters or check back later for new assignments.
            </p>
          </div>
        ) : (
          <div className="assignment-list__grid">
            {filteredAssignments.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignment/${assignment.id}`}
                className={`assignment-card ${
                  assignment.progress === 0 && !assignment.completed ? 'assignment-card__locked' : ''
                }`}
              >
                <div className="assignment-card__header">
                  <h3 className="assignment-card__title">{assignment.title}</h3>
                  <span className={`assignment-card__difficulty ${getDifficultyColor(assignment.difficulty)}`}>
                    {assignment.difficulty}
                  </span>
                </div>
                
                <p className="assignment-card__description">{assignment.description}</p>
                
                <div className="assignment-card__meta">
                  <div className="assignment-card__stats">
                    <div className="assignment-card__stat">
                      <span className="assignment-card__stat-icon">⏱️</span>
                      <span>{assignment.estimatedTime}m</span>
                    </div>
                    <div className="assignment-card__stat">
                      <span className="assignment-card__stat-icon">📊</span>
                      <span>{assignment.successRate}%</span>
                    </div>
                  </div>
                  
                  <div className="assignment-card__progress">
                    {assignment.completed ? (
                      <span className="assignment-card__completed">✓ Completed</span>
                    ) : (
                      <>
                        <div className="assignment-card__progress-bar">
                          <div
                            className="assignment-card__progress-fill"
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                        <span>{assignment.progress}%</span>
                      </>
                    )}
                  </div>
                </div>
                
                {assignment.progress === 0 && !assignment.completed && (
                  <div className="assignment-card__locked-icon">🔒</div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
