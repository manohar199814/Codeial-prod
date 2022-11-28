const User = require('../models/user');
const ResetPassToken = require('../models/reset_pass_tokens')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const resetPasswordMailer = require('../mailers/reset_password_mailer');


module.exports.profile = (req,res) => {
    User.findById(req.params.id,(err,user) => {
        return res.render('user_profile',{
            title:'User Profile',
            profile_user:user
        });
    });   
}

module.exports.update = async (req,res) =>{
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('************* Multer error *********',err);
                }

                user.name = req.body.name;
                user.email =  req.body.email;

                if(req.file){

                    if(user.avatar){
                        // fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        fs.unlink(path.join(__dirname,'..',user.avatar), function(err) {
                            if(err && err.code == 'ENOENT') {
                                // file doens't exist
                                console.info("File doesn't exist, won't remove it.");
                            } else if (err) {
                                // other errors, e.g. maybe we don't have enough permission
                                console.error("Error occurred while trying to remove file");
                            } else {
                                console.info(`removed`);
                            }
                        });
                    }
                    //save the path of the uploaded file into avatar field field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            })
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        res.status(401).send('un authorised');
    }

}

//user/sign-in route
module.exports.signIn = (req,res) =>{
    res.render('user_sign_in',{title:'user SignIn'});
}

//user/sign-up route
module.exports.signUp = (req,res) =>{
    res.render('user_sign_up',{title:'user SignUp'});
}

module.exports.signOut = (req,res) => {
    return req.logout(function(err) {
        if (err) { console.log(err); }
        req.flash('success','You have logged out!')
        res.redirect('/');
      });
}
//post request after submitting signUP form
module.exports.create = (req,res) => {
    if(req.body.password !== req.body.confirm_password){
        req.flash('error','password not matched');
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},(err,user) => {
        if(err){
            req.flash('error','error in signup user');
            return;
        }
        if(!user){
            User.create(req.body,(err,user) =>{
                if(err){
                    req.flash('error','error in signup user');
                }
                req.flash('success','Sign up Successful')
                return res.redirect('/user/sign-in');
            });
        }else{
            req.flash('error','User already exists');
            return res.redirect('back');
        }
    });
}

//post request after submitting signIn form
module.exports.createSession = (req,res) => {
    req.flash('success','logged in Successfully');
    return res.redirect('/');
}

//reset password 

module.exports.getResetPassWord = (req,res) => {
    res.render('user_pass_reset.ejs',{title:'user Paasword Reset'});
}

module.exports.postResetPassWord = (req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err){
            req.flash('error','error in Password reset of user');
            return;
        }
        if(!user){
            if(req.xhr) {
                req.flash('error','User Not found! Enter valid email');
                return res.status(200).json({ 
                    data:{
                        user:user
                    },
                    message:"User Not found",
                    error:req.flash('error')
                })
            }
        }else{
            if(req.xhr) {
                req.flash('success','Mail is sent to your email to reset Password');
                let token = crypto.randomBytes(32).toString('hex');
                ResetPassToken.create({accessToken:token,user:user._id,isValid:true},(err,token) => {
                    resetPasswordMailer.resetPassword(user.name,user.email,token.accessToken)
                });
                return res.status(200).json({ 
                    data:{
                        user:user._id
                    },
                    message:"User Found",
                    success:req.flash('success')
                })
            }
        }
    });
}

module.exports.getResetLink = function(req,res) {
    ResetPassToken.findOne({accessToken:req.query.accessToken},(err,token) => {
        res.render('user_change_pass.ejs',{title:'user Paasword Reset',accessToken:token});
    })
}

module.exports.postResetLink = function(req,res) {
    ResetPassToken.findOne({accessToken:req.query.accessToken},(err,token) =>{
        User.findById(token.user,(err,user) => {
            if(err){
                console.log(err,'error in reset user password');
                return
            }
            if(user){
                if(req.body.password === req.body.confimPassword){
                    user.password = req.body.password;
                    user.save();
                    token.isValid = false;
                    token.save();
                    res.render('reset_success.ejs',{title:'Reset Successful'});
                }
            }
        })
    })
}

