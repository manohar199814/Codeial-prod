const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const users = require('./users');
const posts = require('./posts');
const comment = require('./comment');

console.log('router loaded');

router.get('/',homeController.home);

router.use('/posts',posts);

router.use('/comment',comment);

router.get('/cart',homeController.cart);

router.use('/user',users);

//use api routers
router.use('/api',require('./api'));

module.exports = router;