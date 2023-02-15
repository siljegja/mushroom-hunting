// Review routes

const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams: all id params from app.js and camp.js is merged. To avoid error: cannot read properties of null. Is needed because we prefixed routes with  :id in app.js
const reviews = require('../controllers/reviews'); // controller for review routes
const catchAsync = require('../utilities/catchAsync'); // require func for handling async errors
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware'); // middleware to verify review data

// Create review route - creates a review for a campground 
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete review route - delete a camp's review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// Export routes
module.exports = router;
