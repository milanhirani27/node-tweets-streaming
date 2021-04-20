const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/AuthUser');

//passport authentication
module.exports = function(passport, req) {

  passport.use('user-local',
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message:'Invalid Email or Password.'});
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err){
            console.log(err);
          }
          if (isMatch) {
            return done(null, user, { message: "login Sucessfully"});
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
