import { Router, Request, Response } from 'express';

const router = Router();

// Mock assignments data - in real app, this would come from MongoDB
const assignments = [
  {
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
  {
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
];

// GET /api/assignments - Get all assignments
router.get('/', (req: Request, res: Response) => {
  try {
    const { difficulty, category, completed } = req.query;
    
    let filteredAssignments = assignments;
    
    if (difficulty) {
      filteredAssignments = filteredAssignments.filter(
        (assignment: any) => assignment.difficulty === difficulty
      );
    }
    
    if (category) {
      filteredAssignments = filteredAssignments.filter(
        (assignment: any) => assignment.category === category
      );
    }
    
    if (completed === 'true') {
      filteredAssignments = filteredAssignments.filter(
        (assignment: any) => assignment.completed
      );
    }
    
    res.json({
      assignments: filteredAssignments,
      total: filteredAssignments.length,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      error: 'Failed to fetch assignments',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/assignments/:id - Get specific assignment
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = assignments.find((a: any) => a.id === id);
    
    if (!assignment) {
      return res.status(404).json({
        error: 'Assignment not found',
        message: `Assignment with ID ${id} does not exist`,
      });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      error: 'Failed to fetch assignment',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/assignments/:id/attempt - Record assignment attempt
router.post('/:id/attempt', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { query, success, executionTime, error } = req.body;
    
    // In a real app, this would be saved to MongoDB
    const attempt = {
      id: Date.now().toString(),
      assignmentId: id,
      query,
      success,
      executionTime,
      error,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };
    
    console.log('Assignment attempt recorded:', attempt);
    
    res.status(201).json({
      message: 'Attempt recorded successfully',
      attempt,
    });
  } catch (error) {
    console.error('Error recording attempt:', error);
    res.status(500).json({
      error: 'Failed to record attempt',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
