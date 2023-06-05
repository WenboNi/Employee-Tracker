const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Hfdhdl123!@',
        database: 'employee_info'
    },
    
    console.log('You are now connected to the Employee Info database')
);

module.exports = db;

