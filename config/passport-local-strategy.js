const passport = require('passport');

var LocalStrategy = require('passport-local');

const User = require('../models/user')

//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},
(req,email,password,done) => {
    User.findOne({email:email},(err,user) => {
        if(err){
            req.flash('error',err)
            return done(err);
        }

        if(!user  ||  user.password !== password){
            req.flash('error','Invalid Username/Password');
            return done(null,false);
        }else{
            return done(null,user);
        }
    })
}
));

//searializing the user to decide which key is to be kept in cookie
passport.serializeUser((user,done)=>{
    done(null,user.id);
})

//deserialzing the user from the key in cookie
passport.deserializeUser((id,done) => {
    User.findById(id,(err,user) =>{
        if(err){
            console.log('Error in fetching User -> passport'); 
            return done(err);
        }

        return done(null,user);
    })
});


passport.checkAuthentication = (req,res,next) => {

    //if user is signed in , then pass on request to next fucntion (controller's action)
    if(req.isAuthenticated()) {
        return next();
    } 

    //if user not signed in

        return res.redirect('/user/sign-in');
    

}

passport.setAuthenticatedUser = (req,res,next) => {
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from session cookie and wwe are sending this to locals for use of views
        res.locals.user = req.user;
    }

    next();
}

passport.checkAuthenticationSignin = (req,res,next) => {

    //if user is signed in , then pass on request to next fucntion (controller's action)
    if(req.isAuthenticated()) {
        return res.redirect('/user/profile');
    } 

    //if user not signed in

        return next();
    

}
module.exports = passport;