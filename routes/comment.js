const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy')
const comment_controller = require('../controllers/comment_controller');

router.post('/create',passport.checkAuthentication,comment_controller.create);
router.get('/destroy/:id',passport.checkAuthentication,comment_controller.destroy);

module.exports = router;