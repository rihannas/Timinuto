const mysql = require("mysql");


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATBASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});


