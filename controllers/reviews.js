// Controllers for review routes

const Campground = require('../models/campground'); // require Campground Model from models folder
const Review = require('../models/review.js'); // require Review Model


// Function for new route - creating reviews for a campground (visible on camp's show page)
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a new review')
    res.redirect(`/campgrounds/${campground._id}`);
}


// Function for delete route - delete a camp's review 
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; // campId and reviewId from the route '/campgrounds/:id/reviews/:reviewId'
    // find campground we want to delete a review from - update camp by removing/pull the review from the campground's reviews array 
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); 
    await Review.findByIdAndDelete(reviewId); // find and delete the review we want to delete
    req.flash('success', 'Deleted review')
    res.redirect(`/campgrounds/${id}`);
}

