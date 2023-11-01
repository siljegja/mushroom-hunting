const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200'); 
})

const opts = { toJSON: { virtuals:true } };

const SightingSchema = new Schema({ 
    title: String,
    images: [ImageSchema],  
    geometry: { 
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },         
    description: String,
    location: String, 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

SightingSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/sightings/${this._id}">${this.title}</a></strong>`
});

SightingSchema.post('findOneAndDelete', async function(sighting) {
    if (sighting) {
        await Review.deleteMany({
            _id: {
                $in: sighting.reviews
            }

        })
    }
})

module.exports = mongoose.model('Sighting', SightingSchema);