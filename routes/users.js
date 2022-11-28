const express = require('express');
const router = express.Router();

const passport =require('passport');

const userController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);

router.post('/update/:id',passport.checkAuthentication, userController.update);

router.get('/sign-in',passport.checkAuthenticationSignin,userController.signIn);

router.get('/sign-up',passport.checkAuthenticationSignin,userController.signUp);

router.get('/sign-out',userController.signOut);

router.get('/password-reset',userController.getResetPassWord);

router.post('/password-reset',userController.postResetPassWord);

router.get('/reset-password/',userController.getResetLink);

router.post('/reset-password',userController.postResetLink);

//post request route for sign up
router.post('/create',userController.create); 

//post request route for singin submits
router.post('/create-Session', passport.authenticate('local', { failureRedirect: '/user/sign-in' }),userController.createSession);

//google o auth sign in
router.get('/auth/google',passport.authenticate('google', { scope:[ 'email', 'profile' ] }));

//google call back route
router.get( '/auth/google/callback', passport.authenticate( 'google', {failureRedirect: '/sign-in'}),userController.createSession);
module.exports = router;