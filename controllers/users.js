const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => { 
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => { 
    try {
        const {email, username, password} = req.body; 
        const user = new User({email, username}); 
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Mushroom Hunting');
            res.redirect('/sightings');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back. You are logged in');
    const redirectUrl = req.session.returnTo || '/sightings'; 
    delete redirectUrl;  
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function(err) { 
        if (err) return next(err);  
        req.flash('success', 'You are logged out');
        res.redirect('/sightings');
    });
}
