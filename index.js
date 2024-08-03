const inquirer = require('inquirer');
const { query } = require('./db');

const mainMenu = async () => {
  try {
    const { choice } = await inquirer.prompt({
      name: 'choice',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit',
      ],
    });

    switch (choice) {
      case 'View All Departments':
        return viewDepartments();
      case 'View All Roles':
        return viewRoles();
      case 'View All Employees':
        return viewEmployees();
      case 'Add Department':
        return addDepartment();
      case 'Add Role':
        return addRole();
      case 'Add Employee':
        return addEmployee();
      case 'Update Employee Role':
        return updateEmployeeRole();
      default:
        process.exit();
    }
  } catch (err) {
    console.error('Error in mainMenu:', err);
  }
};

const viewDepartments = async () => {
  try {
    const res = await query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
  } catch (err) {
    console.error('Error viewing departments:', err);
    mainMenu();
  }
};

const viewRoles = async () => {
  try {
    const res = await query(
      `SELECT role.id, role.title, role.salary, department.name AS department
       FROM role
       JOIN department ON role.department_id = department.id`
    );
    console.table(res.rows);
    mainMenu();
  } catch (err) {
    console.error('Error viewing roles:', err);
    mainMenu();
  }
};

const viewEmployees = async () => {
  try {
    const res = await query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
       FROM employee
       JOIN role ON employee.role_id = role.id
       JOIN department ON role.department_id = department.id
       LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
    );
    console.table(res.rows);
    mainMenu();
  } catch (err) {
    console.error('Error viewing employees:', err);
    mainMenu();
  }
};

const addDepartment = async () => {
  try {
    const { name } = await inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    });

    await query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database`);
    mainMenu();
  } catch (err) {
    console.error('Error adding department:', err);
    mainMenu();
  }
};

const addRole = async () => {
  try {
    const departments = await query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(({ id, name }) => ({
      name,
      value: id,
    }));

    const { title, salary, department_id } = await inquirer.prompt([
      { name: 'title', type: 'input', message: 'Enter the title of the role:' },
      { name: 'salary', type: 'input', message: 'Enter the salary of the role:' },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      },
    ]);

    await query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, department_id]
    );
    console.log(`Added ${title} to the database`);
    mainMenu();
  } catch (err) {
    console.error('Error adding role:', err);
    mainMenu();
  }
};

const addEmployee = async () => {
  try {
    const roles = await query('SELECT * FROM role');
    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const employees = await query('SELECT * FROM employee');
    const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    managerChoices.push({ name: 'None', value: null });

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      { name: 'first_name', type: 'input', message: 'Enter the first name:' },
      { name: 'last_name', type: 'input', message: 'Enter the last name:' },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the role:',
        choices: roleChoices,
      },
      {
        name: 'manager_id',
        type: 'list',
        message: 'Select the manager:',
        choices: managerChoices,
      },
    ]);

    await query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
    console.log(`Added ${first_name} ${last_name} to the database`);
    mainMenu();
  } catch (err) {
    console.error('Error adding employee:', err);
    mainMenu();
  }
};

const updateEmployeeRole = async () => {
  try {
    const employees = await query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const roles = await query('SELECT * FROM role');
    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const { employee_id, role_id } = await inquirer.prompt([
      {
        name: 'employee_id',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the new role:',
        choices: roleChoices,
      },
    ]);

    await query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Updated employee role');
    mainMenu();
  } catch (err) {
    console.error('Error updating employee role:', err);
    mainMenu();
  }
};

mainMenu();
