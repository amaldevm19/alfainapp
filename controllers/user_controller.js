const db = require('../config/db')
const User = require('../models/user_model')

const user_controller = {
    login_form:(req, res)=>{
        console.log("Session in login form")
        console.log(req.session.user);
        console.log(req.cookies.user_sid);
        res.render('users/login');
    },
    login_function:(req, res)=>{
        let data ={}
        User.findOne({  user_email: req.body.userEmail }, function(err, user) {
            if (err || !user) {
                data ={
                    error:true,
                    message:"User Name / Password is not correct"
                }
                res.send(data);
                return;
            }
            user.comparePassword(req.body.userPassword, function(err, isMatch) {
                if(err || !isMatch){
                    data ={
                        error:true,
                        message:"User Name / Password is not correct"
                    }
                    res.send(data);
                    return;
                }
                if(isMatch){
                    data ={
                        error:false,
                        message:"You are successfully logged in"
                    }
                    req.session.user = {
                        user_email:user.user_email,
                        is_superuser:user.is_superuser,
                        user_name:user.user_name

                    };
                    
                    req.session.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            //Data get lost here
                            console.log("Session in login function")
                            console.log(req.session.user);
                            console.log(req.cookies.user_sid);
                            res.send(data);
                        }
                    });
                    // res.redirect('/projects')
                    
                }
            });

        })
      
        //res.redirect('/');
    },
    logout_function:(req, res)=>{
        res.clearCookie('user_sid');
        res.redirect('/');
    },
    signup_form:(req,res)=>{
        res.render('users/signup');
    },
    signup_function:(req,res, next)=>{
        let user = new User({
            user_name:req.body.userName,
            user_email: req.body.userEmail,
            password: req.body.userPassword,
            is_superuser:false,
            user_department:req.body.userDepartment,
        });
        user.save(function(err) {
            let data ={}
            if (err) {
                console.log(err.code)
                data ={
                    error:true,
                    message:"User already exist"
                }
                res.send(data);
                return;
            }
            
            data ={
                error:false,
                message:"User successfully registered."
            }
            res.send(data);
        });
        
    }

}

module.exports = user_controller;