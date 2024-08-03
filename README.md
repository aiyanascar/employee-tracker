# Employee Tracker

## Description

Employee Tracker is a command-line application that allows business owners to view and manage the departments, roles, and employees in their company. It is built using Node.js, Inquirer, and PostgreSQL.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/employee-tracker.git
2. Navigate to the project directory:
    cd employee-tracker
3. Install the dependencies:
    npm 
    
## Usage

1. Ensure PostgreSQL is installed and running on your machine.

2. Create the PostgreSQL database:
    psql -U postgres -h localhost

    CREATE DATABASE employee_tracker;
    \c employee_tracker
3. Create the tables and seed the database:
    -- Create department table
    CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
    );

    -- Create role table
    CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
    );

    -- Create employee table
    CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    );

    psql -U your_username -h localhost -d employee_tracker -f seeds.sql
4. Run the application:
    node index.js

## Database Schema
The database schema includes the following tables:

department: Contains department details.
role: Contains role details, including title, salary, and department ID.
employee: Contains employee details, including first name, last name, role ID, and manager ID.

## Features
View all departments
View all roles
View all employees
Add a department
Add a role
Add an employee
Update an employee role
Contributing
Contributions are welcome! Please fork this repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.
