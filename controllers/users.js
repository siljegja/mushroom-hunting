// Controllers for user routes

const User = require('../models/user');


// Functions for register route
module.exports.renderRegisterForm = (req, res) => { // renders form - to get info we need to register as user
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => { // register the user 
    try {
        const {email, username, password} = req.body; // destructure from the form
        const user = new User({email, username}); // register a new user with the given mail, username from the form
        const registeredUser = await User.register(user, password);
        // register(user, password)
        // - user is registered with a hashed version of the password given in the form 
        // - checks if username is unique 
        req.login(registeredUser, err => { // log user in
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        // if problem - flash the erorr message
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

// Functions for login routes
module.exports.renderLogin =  (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back. You are logged in');
    const redirectUrl = req.session.returnTo || '/campgrounds'; // when logging in, return to path you were or /campgrounds if no prev path (npm i passport@0.5.0 version works)
    delete redirectUrl;  
    res.redirect(redirectUrl);
}

// Functions for logout routes 

module.exports.logout = (req, res) => {
    req.logout(function(err) { 
        if (err) return next(err);  // return err if error
        req.flash('success', 'You are logged out'); // otherwise flash a success msg
        res.redirect('/campgrounds');
    });
}
