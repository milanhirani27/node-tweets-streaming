const bcrypt = require('bcryptjs');
const User = require('../models/AuthUser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const path = require('path');

//register
exports.register = function(req, res, next) {
	var userInfo = req.body;
	if(!userInfo.email || !userInfo.name || !userInfo.password || !userInfo.password2){
		req.flash('error_msg','All field are required..');
		res.redirect('/users/register');
	} else {
		if (userInfo.password == userInfo.password2) {
			User.findOne({email:userInfo.email},function(err,data){
				if(!data){
					var newUser = new User({
							email:userInfo.email,
							name: userInfo.name,
							password: userInfo.password,
							password2: userInfo.password2
						});
						bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
						async function main() {

						//welcomw email		
					    var transport = nodemailer.createTransport({
					        host: "smtp.mailtrap.io",
					        port: 2525,
					        auth: {
					          user: "cec9437db3a12a",
					          pass: "52f355240f9b45"
					        }
					    });
					
						let info = await transport.sendMail({
							from: 'test1@gmail.com', 
							to: 'test2@gmail.com, test3@gmail.com', 
							subject: "Welcome to our App", 
							html: `<p> HI ${newUser.name} </p>
									<p>Welcome to App , Let me Know how you get along with APP</p>`, 
						});
							console.log("Message sent: %s", info.messageId);
							
							console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
					}
					main().catch(console.error)
                    .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
            });
			}else{
				req.flash('error_msg','Email is already used.');
				res.redirect('/users/register');
				}
			});
		}else{
			req.flash('error_msg','password is not matched');
			res.redirect('/users/register');
		}
	}  
};


//forget password
exports.forgetpassword = async (req,res,email) => {  
	const emaildata = req.body.email;
	if(!emaildata){
		req.flash('error_msg', 'Email is required');
		res.redirect('/resetPassword')
	}
	const user = await User.findOne({ email:req.body.email });
	if(!user){
		req.flash('error_msg', 'Enter a valid Email');
		res.redirect('/resetPassword')
	}
	try{
	if(user.email){
		const token =jwt.sign({id : user._id},'tokengeneration')
		const link = `http://localhost:3000/resetPassword/${token}`;
		user.resetToken = token,
		user.expireToken = Date.now() + 3600000
		user.save()
    	var transport = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "cec9437db3a12a",
				pass: "52f355240f9b45"
			}
      	});
	  	let info = await transport.sendMail({
		    from: 'test1@gmail.com', 
		    to: 'test2@gmail.com, test3@gmail.com', 
		    subject: "forget Password", 
		    html: ` <p>Hi ${user.name},</p>
					<p>You requested to reset your password.</p>
					<p> Please, click the link below to reset your password</p>
					<a href="${link}">Reset Password</a>
					`, 
				 });
		req.flash('success_msg', 'Mail sent your Register Email-Id');
		res.redirect('/users/login')
		console.log("Message sent: %s", info.messageId);

		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); 

	}else{
		req.flash('error_msg', 'Enter a valid Email');
		res.redirect('/resetPassword')
	}
	}catch(e){
		console.log(e);
	}
}
  
// request reset password
exports.requestResetPassword = async (req,res) => {  
	try{
	const newPassword = req.body.password;
	const newPassword2 = req.body.password2;
	var resetToken = req.params.token;
	const user = await User.findOne({ resetToken });
	if(!newPassword || !newPassword2){
		req.flash('error_msg','password is required');
	    res.redirect('/resetPassword/'+resetToken)
	}
	if(newPassword == newPassword2){
		if(user){
			bcrypt.hash(newPassword, 10, function(err, hash) {
				user.password = hash;
				user.resetToken = null;
				expireToken = null
				user.save()
			});	
		}	
		req.flash('success_msg', 'Password Reset Sucessfully');
		res.redirect('/users/login')
    }else{
		req.flash('error_msg','password is not matched');
		res.redirect('/resetPassword/'+resetToken)
        }
	}
	catch(e){
		console.log(e);
	}
}

// Login
exports.login =  (req, res, next) => {
	passport.authenticate('user-local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
};

// Dashboard for user login and tweet stream
exports.dashboard = (req, res) => {
	res.sendFile(path.resolve(__dirname, '../views/index.html') , user= req.user)
  }

// Logout
exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
  	res.redirect('/users/login');
};
  
