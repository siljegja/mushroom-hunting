// User routes

const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');

// Register new user route
router.route('/register')
    .get(users.renderRegisterForm) 
    .post(catchAsync(users.registerUser)) 

// Login route
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)
         // passport.authenticate(strategy, {obj}) middeware
         // - 'local' strategy - verifies username and password.
         // - failureFlash - flash a mesg if failure, failureRedirect: redirect to /login if failure

// Logout route
router.get('/logout', users.logout);

// Export routes
module.exports = router;

