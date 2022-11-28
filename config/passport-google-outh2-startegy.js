const passport = require('passport');
const googleStrategy = require( 'passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//tell passport to use strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //find user
    User.findOne({ email: profile.emails[0].value }, function (err, user) {
        if(err){
            console.log(err,'error in google strategy passport');
            return;
        }
        console.log(profile);

        if(user){
            //if used set user as req.user
            return done(null,user)
        }else{
            //if not found create user and set req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log(err,'error in creating user');
                    return;
                }

                return done(null,user);
            })
        }

    });
  }
));