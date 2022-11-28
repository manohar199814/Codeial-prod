const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsApi = require('../../../controllers/api/v1/posts_api_controller')

router.get('/',postsApi.index);
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }),postsApi.delete)
module.exports = router;