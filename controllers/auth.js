const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATBASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if( !email || !password ) {
        return res.status(400).render('login', {
          message: 'Please provide an email and password'
        })
      }
  
      db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if( !results || !(await bcrypt.compare(password, results[0].password)) ) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
            })
            } else {
            const id = results[0].id;
    
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
    
            console.log("The token is: " + token);
    
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }
    
                res.cookie('jwt', token, cookieOptions );
                res.status(200).redirect("/");
            }
  
        })
  
    } catch (error) {
      console.log(error);
    }
}



exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const { name, email, password, passwordConfirm } = req.body;


    

    // res.render('main')

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if (email == '' || name == '' || password == '') {
            return res.render('register', {
                message: 'Enter information please.'
            })
        }

        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already registered'
            });

        } else if ( password !== passwordConfirm ) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        } 

        

        
        const hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);

        // res.send("testing")



        db.query('INSERT INTO users SET ?', {email: email, name: name, password: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error)
            } else {
                console.log(results);
                return res.render('login', {
                    message: 'User Registered'
                });
            }
        });
    
    });


}

exports.add = (req, res) => {

    console.log(req.body);

    const {taskname, time, email} = req.body;

    //this only works for user with id 6, which is user egg only
    //this part has to be changed to work with other users too.


    db.query('INSERT INTO trying SET ?', {taskname: taskname, timetaken: time, ownerid: 6}, (error, results) => {
        if(error) {
            console.log(error)
        } else {
            console.log(results);
            return res.render('profile', {
                message: 'Time Added'
            });
        }
    });
}


exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies);
    if( req.cookies.jwt) {
      try {
        //1) verify the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET
        );
  
        console.log(decoded);
  
        //2) Check if the user still exists
        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
          console.log(result);
  
          if(!result) {
            return next();
          }
  
          req.user = result[0];
          console.log("user is")
          console.log(req.user);
          return next();
  
        });
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      next();
    }
}

  
exports.logout = async (req, res) => {
res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
});

res.status(200).redirect('/');
}



// query to calculate the time



// db.query('SELECT taskname, SUM(timetaken) AS TotalTime, AVG(timetaken) AS AverageTime, COUNT(taskname) AS TaskCount FROM trying GROUP BY taskname', (error, results, taskname, AverageTime, TotalTime, TaskCount) => {
//     if(error) {
//         console.log(error)
//     } else {
//         taskname, TotalTime, AverageTime, TaskCount = results
//         res.render('reports', { title: 'Task List', taskname: taskname, action: 'list',  userData: results});
    
//     }
// }); 


// 'SELECT taskname, SUM(timetaken) AS TotalTime, AVG(timetaken) AS AverageTime, COUNT(taskname) AS TaskCount FROM trying GROUP BY taskname'


// db.query('SELECT taskname, SUM(timetaken) AS TotalTime, AVG(timetaken) AS AverageTime, COUNT(taskname) AS TaskCount FROM trying GROUP BY taskname', (error, results) => {
//     if(error) {
//         console.log(error)
//     } else {
        
//         console.log(results)
//     }
// }); 

exports.reporting = (req, res, next) => {


db.query('SELECT taskname AS TaskName, SUM(timetaken) AS TotalTime, AVG(timetaken) AS AverageTime, COUNT(taskname) AS TaskCount FROM trying GROUP BY taskname', (error, results, fields) => {
    if(error) {
        console.log(error)
    } else {
        res.render('reports', { title: 'Task List', action: 'list',  userData: results});
    
    }
}); 
}