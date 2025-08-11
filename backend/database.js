const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password123@@',
    database: 'expense_tracker'
});

connection.connect(err => {
    if(err) throw err;
    console.log('MySQL is connected...');
});

module.exports = connection;