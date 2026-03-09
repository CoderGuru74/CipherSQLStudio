import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuestionPanel from './QuestionPanel';
import SchemaViewer from './SchemaViewer';
import SQLEditor from './SQLEditor';
import ResultsTable from './ResultsTable';

interface Assignment {
  id: string;
  title: string;
  description: string;
  question: string;
  requirements: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  estimatedTime: number;
  schema: any;
  sampleData: any;
}

const Workspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [executing, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockAssignments: Record<string, Assignment> = {
      '1': {
        id: '1',
        title: 'Basic SELECT Queries',
        description: 'Learn how to retrieve data from a single table using SELECT statements with WHERE clauses.',
        question: 'Write a SQL query to find all employees who work in the Engineering department and have a salary greater than 70000.',
        requirements: [
          'Select all columns from the employees table',
          'Filter by department = "Engineering"',
          'Filter by salary > 70000',
          'Order by salary in descending order'
        ],
        difficulty: 'easy',
        category: 'Basics',
        estimatedTime: 15,
        schema: {
          tables: [
            {
              name: 'employees',
              columns: [
                { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'NOT NULL'] },
                { name: 'first_name', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
                { name: 'last_name', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
                { name: 'email', type: 'VARCHAR(100)', constraints: ['UNIQUE', 'NOT NULL'] },
                { name: 'department', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
                { name: 'salary', type: 'DECIMAL(10,2)', constraints: ['NOT NULL'] },
                { name: 'hire_date', type: 'DATE', constraints: ['NOT NULL'] }
              ]
            }
          ]
        },
        sampleData: {
          employees: [
            { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@company.com', department: 'Engineering', salary: 75000.00, hire_date: '2022-01-15' },
            { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@company.com', department: 'Marketing', salary: 65000.00, hire_date: '2021-03-20' },
            { id: 3, first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@company.com', department: 'Engineering', salary: 80000.00, hire_date: '2020-06-10' },
            { id: 4, first_name: 'Sarah', last_name: 'Williams', email: 'sarah.williams@company.com', department: 'Engineering', salary: 68000.00, hire_date: '2023-02-28' }
          ]
        }
      },
      '2': {
        id: '2',
        title: 'JOIN Operations',
        description: 'Master INNER JOIN, LEFT JOIN, and RIGHT JOIN to combine data from multiple tables.',
        question: 'Write a SQL query to find all employees and their corresponding department information. Include employees even if they don\'t have a department assigned.',
        requirements: [
          'Select employee name, email, and department name',
          'Use LEFT JOIN to include all employees',
          'Order by employee last name'
        ],
        difficulty: 'medium',
        category: 'Joins',
        estimatedTime: 30,
        schema: {
          tables: [
            {
              name: 'employees',
              columns: [
                { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'NOT NULL'] },
                { name: 'first_name', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
                { name: 'last_name', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
                { name: 'email', type: 'VARCHAR(100)', constraints: ['UNIQUE', 'NOT NULL'] },
                { name: 'department_id', type: 'INTEGER', constraints: ['FOREIGN KEY'] }
              ]
            },
            {
              name: 'departments',
              columns: [
                { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'NOT NULL'] },
                { name: 'name', type: 'VARCHAR(50)', constraints: ['UNIQUE', 'NOT NULL'] },
                { name: 'manager', type: 'VARCHAR(100)', constraints: [] }
              ]
            }
          ]
        },
        sampleData: {
          employees: [
            { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@company.com', department_id: 1 },
            { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@company.com', department_id: 2 },
            { id: 3, first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@company.com', department_id: 1 },
            { id: 4, first_name: 'Sarah', last_name: 'Williams', email: 'sarah.williams@company.com', department_id: null }
          ],
          departments: [
            { id: 1, name: 'Engineering', manager: 'Tom Brown' },
            { id: 2, name: 'Marketing', manager: 'Lisa Davis' },
            { id: 3, name: 'Sales', manager: 'Bob Wilson' }
          ]
        }
      }
    };

    setTimeout(() => {
      if (id && mockAssignments[id]) {
        setAssignment(mockAssignments[id]);
        setQuery('-- Write your SQL query here\nSELECT * FROM employees;');
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleRunQuery = async () => {
    if (!query.trim()) return;

    setExecuting(true);
    try {
      // Mock API call - in real app, this would call the backend
      setTimeout(() => {
        // Mock results based on the query
        const mockResults = {
          columns: ['id', 'first_name', 'last_name', 'email', 'department', 'salary'],
          rows: [
            [1, 'John', 'Doe', 'john.doe@company.com', 'Engineering', 75000.00],
            [3, 'Mike', 'Johnson', 'mike.johnson@company.com', 'Engineering', 80000.00]
          ],
          rowCount: 2,
          executionTime: '12ms'
        };
        setResults(mockResults);
        setExecuting(false);
      }, 1500);
    } catch (error) {
      console.error('Error executing query:', error);
      setResults({
        error: 'Failed to execute query. Please check your syntax.',
        columns: [],
        rows: [],
        rowCount: 0,
        executionTime: '0ms'
      });
      setExecuting(false);
    }
  };

  const handleClearQuery = () => {
    setQuery('');
    setResults(null);
  };

  const handleResetQuery = () => {
    if (assignment) {
      setQuery('-- Write your SQL query here\nSELECT * FROM employees;');
      setResults(null);
    }
  };

  if (loading) {
    return (
      <div className="workspace">
        <div className="workspace__container">
          <div className="loading">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading assignment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="workspace">
        <div className="workspace__container">
          <div className="error">
            <div className="error__header">
              <div className="error__icon">❌</div>
              <div className="error__content">
                <h3 className="error__title">Assignment Not Found</h3>
                <p className="error__message">The assignment you're looking for doesn't exist or has been removed.</p>
              </div>
            </div>
            <div className="error__actions">
              <Link to="/" className="error__button">
                Back to Assignments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <div className="workspace__container">
        <header className="workspace__header">
          <Link to="/" className="workspace__back-button">
            ← Back to Assignments
          </Link>
          <h1 className="workspace__title">{assignment.title}</h1>
          <div className="workspace__actions">
            <span className={`assignment-card__difficulty assignment-card__difficulty--${assignment.difficulty}`}>
              {assignment.difficulty}
            </span>
            <span>⏱️ {assignment.estimatedTime}m</span>
          </div>
        </header>

        <div className="workspace__content">
          <div className="workspace__left-panel">
            <div className="workspace__section">
              <div className="workspace__section-header">
                <h2 className="workspace__section-title">Question</h2>
              </div>
              <div className="workspace__section-content">
                <QuestionPanel
                  question={assignment.question}
                  requirements={assignment.requirements}
                  assignmentId={assignment.id}
                />
              </div>
            </div>

            <div className="workspace__section">
              <div className="workspace__section-header">
                <h2 className="workspace__section-title">Database Schema</h2>
              </div>
              <div className="workspace__section-content">
                <SchemaViewer
                  schema={assignment.schema}
                  sampleData={assignment.sampleData}
                />
              </div>
            </div>
          </div>

          <div className="workspace__right-panel">
            <div className="workspace__section">
              <div className="workspace__section-header">
                <h2 className="workspace__section-title">SQL Editor</h2>
              </div>
              <div className="workspace__section-content">
                <SQLEditor
                  value={query}
                  onChange={setQuery}
                  onRun={handleRunQuery}
                  onClear={handleClearQuery}
                  onReset={handleResetQuery}
                  executing={executing}
                />
              </div>
            </div>

            <div className="workspace__section">
              <div className="workspace__section-header">
                <h2 className="workspace__section-title">Results</h2>
              </div>
              <div className="workspace__section-content">
                <ResultsTable
                  results={results}
                  loading={executing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
