// Campground Model

const mongoose = require('mongoose'); // require mongoose 
const Schema = mongoose.Schema; // shortcut (to simplify)
const Review = require('./review');

// Image schema 
const ImageSchema = new Schema({
    url: String,
    filename: String
})

// for adding image thumbnails virtual property/small image representation of a larger image
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200'); // this = the image
})
/*  
on every img - want to set up a thumbnal
- take the image's url: replace '/upload' with '/upload/w_200'
we add a virtual property 'thumbnail'
- so we don't need to store it in our database. 
- it is derived from the url we've already got
*/

// For our virtual property 'popUpMarkup'
const opts = { toJSON: { virtuals:true } }; //

// Campground Schema 
const CampgroundSchema = new Schema({ 
    title: String,
    images: [ImageSchema],  
    geometry: { // campground's geometric location
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number], // array of numbers
          required: true
        }
    },         
    price: Number, 
    description: String,
    location: String, 
    author: {
        type: Schema.Types.ObjectId, // use .populate in route to access the data, not just the objectid
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, // store a review as just an objectId, use .popualte to access the data
            ref: 'Review'
        }
    ]
}, opts);

// Virtual property for changing popUp text on the GeoMap (link to campground + preview of description)
// - can call popUpMarkup in our markup + javascript
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
});

// Deleting Middleware (query middleware). Deleting reviews related to a camp we've deleted
CampgroundSchema.post('findOneAndDelete', async function(camp) {
    if (camp) {
        await Review.deleteMany({
            _id: {
                $in: camp.reviews
            }

        })
    }
})
// if a camp was actually found and deleted
// delete all reviews where their id are in our deleted camp's review array

// Compile and export the Campground Model
module.exports = mongoose.model('Campground', CampgroundSchema);