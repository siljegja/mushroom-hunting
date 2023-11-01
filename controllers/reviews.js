const Sighting = require('../models/sightings'); 
const Review = require('../models/review.js'); 

module.exports.createReview = async (req, res) => {
    const sighting = await Sighting.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    sighting.reviews.push(review);
    await review.save();
    await sighting.save();
    req.flash('success', 'Created a new review')
    res.redirect(`/sightings/${sighting._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Sighting.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); 
    await Review.findByIdAndDelete(reviewId); 
    req.flash('success', 'Deleted review')
    res.redirect(`/sightings/${id}`);
}

