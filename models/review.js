// Review Model

const mongoose = require('mongoose'); // require mongoose 
const Schema = mongoose.Schema; // shortcut (to simplify)

// define a schema 
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// compile and export the Campground Model
module.exports = mongoose.model('Review', reviewSchema);