const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');

router.route('/register')
    .get(users.renderRegisterForm) 
    .post(catchAsync(users.registerUser)) 

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)

router.get('/logout', users.logout);

module.exports = router;

