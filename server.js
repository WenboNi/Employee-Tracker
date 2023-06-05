const inquirer = require('inquirer');
const db = require('./connection/connection.js');
const consoleTable = require('console.table');

db.connect((err)=>{
    if(err)throw err;
    console.log(`
    _ _ _ _ _ _ _              _ _ _ _ _ _
    |                                     |
    |       ***Employee Manager ***       |                                     
    |_ __ __ _ __              __ ___ __ _| \n`)
    promptOption();
})
function promptOption(){
   inquirer
    .prompt([
        {
            type:'list',
            name:'option',
            message:'Please select the function you would like to perform',
            choices :['View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role',
            'Exit'
        ]
        }

    ])
    .then(function (response) {
        const Option = response.option;
        if (Option === 'View All Departments') {
            viewDepartments();
        }else if (Option === 'View All Roles'){
            viewRoles();
        }else if (Option === 'View All Employees') {
            viewEmployees();
        }else if (Option === 'Add A Department') {
            addDepartment();
        }else if (Option === 'Add A Role') {
            addRole();
        }else if (Option === 'Add An Employee') {
            addEmployee();
        }else if (Option === 'Update An Employee Role') {
            updateEmployeeRole();
        }else if (Option === 'Exit') {
            db.end();
        }else{
            console.log("Invalid Attempt");
            promptOption();
        }
    })
}

//To View all Company Departments within Database
function viewDepartments(){
    db.query('SELECT * FROM departments;', (err,res) => {
      if(err)throw err;
      console.table(res);

      promptOption();

    })
}

//To view roles of all employees within Database
function viewRoles() {
  db.query(`
  SELECT 
  roles.role_id AS ROLE_ID,
   roles.role_title AS ROLE_TITLE,
    roles.salary AS Employee_Salary, 
    departments.department_id AS Department_ID, 
    departments.department_name AS DEPARTMENT
     FROM 
     roles JOIN departments ON roles.department_id = departments.department_id;`,(err,res)=>{
      if(err)throw err;
      console.table(res);

      promptOption();
    })
}
//To view all employees in database
function viewEmployees(){
    db.query(`SELECT
     employees.employee_id AS EMPLOYEE_ID,
      employees.first_name AS FIRST_NAME ,
      employees.last_name AS LAST_NAME ,
      roles.role_id AS ROLE_ID,
      roles.role_title AS  JOB_TITLE,
       roles.salary AS SALARY ,
       departments.department_name AS DEPARTMENT
        ,departments.department_id AS DEPARTMENT_ID,
         employees.manager_id AS MANAGER 
         FROM
          employees JOIN roles
           ON employees.role_id =roles.role_id JOIN departments ON roles.department_id =departments.department_id;`,(err,res)=>{
        if(err)throw err;
        console.table(res);

        promptOption();
    })
}

//To add a department to database
function addDepartment(){
    return inquirer.prompt ([{
        type:'input',
        name:'department_name',
        massage:'Enter the Department Name'
    }
]).then((response)=>{
    db.query(`INSERT INTO departments (department_name) VALUES ('${response.department_name}')`,(err,res)=>{
        if (err)throw err;
        console.table(`\n ${response.department_name} addded to the Database \n`);
        promptOption();
    })
})
}

//To add role of employee to database
function addRole() {
    db.query('SELECT * FROM departments;', (err, res) => {
      if (err) throw err;
      const roleDepartment = res.map(department => ({
        name: department.department_name,
        value: department.department_id
      }));
  
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department does this role belong to?',
            choices: roleDepartment
          },
          {
            name: 'role_title',
            type: 'input',
            message: 'What is the name of the role?'
          },
          {
            name: 'role_salary',
            type: 'input',
            message: 'What is the salary for this role?',
            validate: salaryValue => {
              if (isNaN(salaryValue)) {
                console.log('\n Enter a numerical value \n');
                return false;
              }
              return true;
            }
          }
        ])
        .then(response => {
          const { departmentName, role_title, role_salary } = response;
          const query = 'INSERT INTO roles (ROLE_TITLE, salary, department_id) VALUES (?, ?, ?)';
          const values = [role_title, role_salary, departmentName];
  
          db.query(query, values, (err, res) => {
            if (err) throw err;
            console.log(`\n ${role_title} has been added in Employee_Info database. \n`);
            promptOption();
          });
        });
    });
  }

//To add new employees to the database  
function addEmployee() {
    db.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;
        const employeeRoles = res.map(role => ({
          name: role.role_title,
          value: role.role_id
        }));
    
        db.query('SELECT * FROM employees;', (err, res) => {
          if (err) throw err;
          const managers = res.map(manager => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.employee_id
          }));
    
          inquirer
            .prompt([
              {
                name: 'first_name',
                type: 'input',
                message: "Enter the employee's first name:"
              },
              {
                name: 'last_name',
                type: 'input',
                message: "Enter the employee's last name:"
              },
              {
                name: 'role_id',
                type: 'list',
                message: "Select the employee's role:",
                choices: employeeRoles
              },
              {
                name: 'manager_id',
                type: 'list',
                message: "Select the employee's manager:",
                choices: [{ name: 'None', value: null }, ...managers]
              }
            ])
            .then(response => {
              const { first_name, last_name, role_id, manager_id } = response;
              const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
              const values = [first_name, last_name, role_id, manager_id];
    
              db.query(query, values, (err, res) => {
                if (err) throw err;
                console.log(`\n ${first_name} ${last_name} has been added to the Employee_Info database. \n`);
                promptOption();
              });
            });
        });
      });
    }

//To update an employee's role in database
function updateEmployeeRole() {
    // Retrieve the list of employees from the database
    db.query('SELECT * FROM employees', (err, employees) => {
      if (err) throw err;
  
      // Prompt the user to select an employee to update
      inquirer.prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.employee_id
          }))
        }
      ]).then(answer => {
        const employeeId = answer.employeeId;
  
        // Retrieve the list of roles from the database
        db.query('SELECT * FROM roles', (err, roles) => {
          if (err) throw err;
  
          // Prompt the user to select a new role for the employee
          inquirer.prompt([
            {
              name: 'roleId',
              type: 'list',
              message: 'Select the new role for the employee:',
              choices: roles.map(roles => ({
                name: roles.role_title,
                value: roles.role_id
              }))
            }
          ]).then(answer => {
            const roleId = answer.roleId;
  
            // Update the employee's role in the database
            db.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [roleId, employeeId], (err, result) => {
              if (err) throw err;
  
              console.log('Employee role updated successfully.');
              promptOption();
            });
          });
        });
      });
    });
  }
