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
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockAssignments: Record<string, Assignment> = {
      '1': {
        id: '1',
        title: 'Basic SELECT Queries',
        description: 'Learn how to retrieve data from a single table.',
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
          tables: [{
            name: 'employees',
            columns: [
              { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY'] },
              { name: 'salary', type: 'DECIMAL', constraints: ['NOT NULL'] },
              { name: 'department', type: 'VARCHAR', constraints: ['NOT NULL'] }
            ]
          }]
        },
        sampleData: {}
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
    
    setTimeout(() => {
      setResults({
        columns: ['id', 'first_name', 'last_name', 'email', 'department', 'salary'],
        rows: [[1, 'John', 'Doe', 'john.doe@company.com', 'Engineering', 75000.00]],
        rowCount: 1,
        executionTime: '12ms'
      });
      setExecuting(false);
    }, 1500);
  };

  if (loading) return <div className="loading"><div className="loading__spinner"></div></div>;

  return (
    <div className="workspace">
      {/* Header section with Back Button */}
      <header className="workspace__header">
        <Link to="/" className="workspace__back-button">← Back to Assignments</Link>
        <h1 className="workspace__title">{assignment?.title}</h1>
        <div className="workspace__actions">
          <span className={`assignment-card__difficulty assignment-card__difficulty--${assignment?.difficulty}`}>
            {assignment?.difficulty}
          </span>
        </div>
      </header>

      <div className="workspace__content">
        {/* LEFT PANEL */}
        <div className="workspace__left-panel">
          <div className="workspace__section">
            <div className="workspace__section-header">
              <h2 className="workspace__section-title">Question</h2>
            </div>
            <div className="workspace__section-content">
              <QuestionPanel 
                question={assignment?.question || ''} 
                requirements={assignment?.requirements || []} 
                assignmentId={assignment?.id || ''} 
              />
            </div>
          </div>

          <div className="workspace__section">
            <div className="workspace__section-header">
              <h2 className="workspace__section-title">Database Schema</h2>
            </div>
            <div className="workspace__section-content">
              <SchemaViewer schema={assignment?.schema} sampleData={assignment?.sampleData} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="workspace__right-panel">
          {/* THE SQL EDITOR - Ensure classes match _workspace.scss */}
          <div className="editor-panel">
            <SQLEditor
              value={query}
              onChange={setQuery}
              onRun={handleRunQuery}
              onClear={() => setQuery('')}
              onReset={() => setQuery('-- Write your SQL query here\nSELECT * FROM employees;')}
              executing={executing}
            />
          </div>

          <div className="workspace__section">
            <div className="workspace__section-header">
              <h2 className="workspace__section-title">Results</h2>
            </div>
            <div className="workspace__section-content">
              <ResultsTable results={results} loading={executing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;