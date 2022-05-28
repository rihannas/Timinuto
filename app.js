const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATBASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

// parse URL encode bodies as sent by HTML forms
app.use(express.urlencoded({extended: false}));

// parse JSON bodies as sent by client
app.use(express.json());
app.use(cookieParser());



app.set('view engine', 'hbs');



db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected...")
    }
})

// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

//converting mysql table into json
// client.query('select * from db.table;', function(err, results, fields) {
//     if(err) throw err;

//     fs.writeFile('table.json', JSON.stringify(results), function (err) {
//       if (err) throw err;
//       console.log('Saved!');
//     });

//     client.end();   
// });

// app.use(function(req, res, next) {
//     next(createError(404));
// });

app.listen(5010, () => {
    console.log("Server started on Port 5010");
})