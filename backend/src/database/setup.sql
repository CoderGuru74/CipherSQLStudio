-- CipherSQL Studio Database Setup
-- Run this script to create the initial database structure
-- This should be run by a database administrator, not the read-only user

-- Create main database (if it doesn't exist)
-- CREATE DATABASE ciphersql_studio;

-- Connect to the database
-- \c ciphersql_studio;

-- Create sample tables for SQL practice assignments

-- Employees table for basic SELECT queries
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0),
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table for JOIN operations
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    manager VARCHAR(100),
    budget DECIMAL(12,2) CHECK (budget >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table for complex queries
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Planning', 'Active', 'Completed', 'On Hold')),
    budget DECIMAL(12,2) CHECK (budget >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee projects junction table
CREATE TABLE IF NOT EXISTS employee_projects (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    hours_worked INTEGER DEFAULT 0 CHECK (hours_worked >= 0),
    start_date DATE NOT NULL,
    end_date DATE,
    UNIQUE(employee_id, project_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table for aggregate functions
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    sale_date DATE NOT NULL,
    salesperson_id INTEGER NOT NULL REFERENCES employees(id),
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table for complex JOINs
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    registration_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table for window functions
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for employees
INSERT INTO employees (first_name, last_name, email, department, salary, hire_date) VALUES
('John', 'Doe', 'john.doe@company.com', 'Engineering', 75000.00, '2022-01-15'),
('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 65000.00, '2021-03-20'),
('Mike', 'Johnson', 'mike.johnson@company.com', 'Engineering', 80000.00, '2020-06-10'),
('Sarah', 'Williams', 'sarah.williams@company.com', 'Engineering', 68000.00, '2023-02-28'),
('Tom', 'Brown', 'tom.brown@company.com', 'Engineering', 95000.00, '2019-11-05'),
('Lisa', 'Davis', 'lisa.davis@company.com', 'Marketing', 72000.00, '2020-08-15'),
('Bob', 'Wilson', 'bob.wilson@company.com', 'Sales', 55000.00, '2022-05-20'),
('Alice', 'Anderson', 'alice.anderson@company.com', 'Sales', 62000.00, '2021-12-10'),
('Charlie', 'Miller', 'charlie.miller@company.com', 'HR', 58000.00, '2023-01-08'),
('Diana', 'Taylor', 'diana.taylor@company.com', 'Finance', 70000.00, '2020-04-12')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for departments
INSERT INTO departments (name, manager, budget) VALUES
('Engineering', 'Tom Brown', 500000.00),
('Marketing', 'Lisa Davis', 200000.00),
('Sales', 'Bob Wilson', 300000.00),
('HR', 'Diana Taylor', 150000.00),
('Finance', 'Diana Taylor', 180000.00)
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for projects
INSERT INTO projects (name, department_id, start_date, end_date, status, budget) VALUES
('Website Redesign', 1, '2023-01-01', '2023-06-30', 'Completed', 75000.00),
('Mobile App', 1, '2023-03-15', '2023-12-31', 'Active', 120000.00),
('Marketing Campaign', 2, '2023-02-01', '2023-04-30', 'Completed', 25000.00),
('Sales Dashboard', 3, '2023-04-01', NULL, 'Active', 45000.00),
('HR System Upgrade', 4, '2023-05-01', '2023-08-31', 'Planning', 35000.00)
ON CONFLICT DO NOTHING;

-- Insert sample data for employee projects
INSERT INTO employee_projects (employee_id, project_id, role, hours_worked, start_date, end_date) VALUES
(1, 1, 'Lead Developer', 480, '2023-01-01', '2023-06-30'),
(3, 1, 'Senior Developer', 420, '2023-01-01', '2023-06-30'),
(4, 1, 'Junior Developer', 380, '2023-01-01', '2023-06-30'),
(2, 2, 'Marketing Lead', 120, '2023-03-15', NULL),
(6, 2, 'Content Creator', 80, '2023-03-15', NULL),
(7, 3, 'Sales Analyst', 200, '2023-04-01', NULL),
(8, 3, 'Sales Manager', 180, '2023-04-01', NULL)
ON CONFLICT (employee_id, project_id) DO NOTHING;

-- Insert sample data for sales
INSERT INTO sales (product_name, category, quantity, unit_price, sale_date, salesperson_id, region) VALUES
('Laptop Pro', 'Electronics', 15, 1200.00, '2023-01-15', 7, 'North'),
('Office Chair', 'Furniture', 25, 350.00, '2023-01-20', 8, 'North'),
('Software License', 'Software', 50, 150.00, '2023-01-25', 7, 'South'),
('Desk Lamp', 'Furniture', 30, 75.00, '2023-02-10', 8, 'East'),
('Monitor 4K', 'Electronics', 20, 450.00, '2023-02-15', 7, 'West'),
('Keyboard', 'Electronics', 40, 120.00, '2023-02-20', 8, 'Central'),
('Mouse', 'Electronics', 60, 45.00, '2023-03-05', 7, 'North'),
('Webcam', 'Electronics', 35, 80.00, '2023-03-10', 8, 'South')
ON CONFLICT DO NOTHING;

-- Insert sample data for customers
INSERT INTO customers (company_name, contact_name, email, phone, address, city, country, registration_date, status) VALUES
('Tech Corp', 'John Smith', 'john.smith@techcorp.com', '555-0101', '123 Tech Street', 'San Francisco', 'USA', '2022-01-15', 'Active'),
('Global Solutions', 'Maria Garcia', 'maria.garcia@globalsolutions.com', '555-0102', '456 Business Ave', 'New York', 'USA', '2022-02-20', 'Active'),
('Innovation Labs', 'David Chen', 'david.chen@innovationlabs.com', '555-0103', '789 Innovation Blvd', 'Boston', 'USA', '2022-03-10', 'Active'),
('Digital Agency', 'Sarah Johnson', 'sarah.johnson@digitalagency.com', '555-0104', '321 Creative Way', 'Los Angeles', 'USA', '2022-04-05', 'Pending'),
('StartUp Inc', 'Mike Wilson', 'mike.wilson@startupinc.com', '555-0105', '654 Entrepreneur St', 'Austin', 'USA', '2022-05-12', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for orders
INSERT INTO orders (customer_id, order_date, total_amount, status, priority) VALUES
(1, '2023-01-15', 15000.00, 'Delivered', 2),
(2, '2023-01-20', 8500.00, 'Shipped', 3),
(3, '2023-02-10', 22000.00, 'Processing', 1),
(1, '2023-02-25', 12000.00, 'Delivered', 3),
(4, '2023-03-05', 5000.00, 'Pending', 4),
(5, '2023-03-15', 18000.00, 'Active', 2),
(2, '2023-03-20', 9500.00, 'Delivered', 2),
(3, '2023-04-01', 25000.00, 'Shipped', 1)
ON CONFLICT DO NOTHING;

-- Insert sample data for order items
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
(1, 'Laptop Pro', 10, 1200.00),
(1, 'Monitor 4K', 5, 450.00),
(2, 'Office Chair', 20, 350.00),
(2, 'Desk Lamp', 10, 75.00),
(3, 'Software License', 100, 150.00),
(3, 'Keyboard', 50, 120.00),
(4, 'Mouse', 30, 45.00),
(5, 'Webcam', 20, 80.00),
(6, 'Laptop Pro', 15, 1200.00),
(7, 'Monitor 4K', 8, 450.00),
(8, 'Keyboard', 40, 120.00)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_salary ON employees(salary);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_category ON sales(category);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Grant read-only permissions to the read-only user
-- This should be run after creating the read-only user
-- GRANT CONNECT ON DATABASE ciphersql_studio TO ciphersql_readonly;
-- GRANT USAGE ON SCHEMA public TO ciphersql_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO ciphersql_readonly;
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ciphersql_readonly;
