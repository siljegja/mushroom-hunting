const { sightingSchema, reviewSchema } = require('./schemas.js'); 
const Sighting = require('./models/sightings.js'); 
const ExpressError = require('./utilities/ExpressError'); 
const Review = require('./models/review.js'); 

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { 
        req.session.returnTo = req.originalUrl; 
        req.flash('error', 'You must be signed in')
        return res.redirect('/login');
    }
    next(); 
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const sighting = await Sighting.findById(id);
    if(!sighting.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/sightings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/sightings/${id}`);
    }
    next();
}

module.exports.validateSighting = (req, res, next) => {
    const { error } = sightingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    } 
}

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}