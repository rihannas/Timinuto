const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATBASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;


    const { name, email, password } = req.body;

    // db.query('SELECT email FROM UserInfo WHERE email = ?', [email], async (error, results) => {
    //     // if(error) {
    //     //     console.log(error);
    //     // }

    //     // if(results.length > 0) {
    //     //     return res.render('index', {
    //     //         message: 'That email is already registed'
    //     //     })
    //     // } 
        
    //     // if( password != passwordConfirm )  {
    //     //     return res.render('index', {
    //     //         message: 'passwords do not match'
    //     //     });
    //     // }

    //     // let hashedPassword = await bcrypt.hash(password, 8);
    //     // console.log(hashedPassword);

    //    // res.send("testing")



    //     db.query('INSERT INTO UserInfo SET ?', {useremail:email, username: name, userpassword:password})

    // });


    db.query('INSERT INTO UserInfo SET ?', {useremail:email, username: name, userpassword:password});
   
}