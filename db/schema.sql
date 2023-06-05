DROP DATABASE IF EXISTS Employee_Info;
CREATE DATABASE Employee_Info;

USE Employee_Info;

CREATE DATABASE Employee_Info;

USE Employee_info;

CREATE TABLE departments(
department_id INT auto_increment PRIMARY KEY,
department_name VARCHAR(30)
);

CREATE TABLE roles (
role_id INT auto_increment PRIMARY KEY,
role_title VARCHAR(30),
department_id int,
salary DECIMAL,
 FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE employees (
employee_id INT auto_increment PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id Int,
manager_id int,
 FOREIGN KEY (role_id) REFERENCES roles(role_id) ,
 FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);