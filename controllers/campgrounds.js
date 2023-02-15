// Controllers for campground routes (must be imported in our route)

// requires
const Campground = require('../models/campground'); // require Campground Model from models folder
const { cloudinary } = require('../cloudinary'); // to store images
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // to use geocoding api, to add map function
const mapBoxToken = process.env.MAPBOX_TOKEN; // mapbox access token
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // client - contains forward geocode (+ reverse) 

// function for index route - index page
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); // find all camps
    res.render('campgrounds/index', { campgrounds })
}

// functions for new route - create new campground
module.exports.renderNewForm = (req, res) => {         // render form to enter data for new campgorund
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => { // create new campground based on data from the form
    // Getting geodata (from our form) for our geomap 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // Create campground
    const campground = new Campground(req.body.campground);
    // Add campground's geomtric location
    campground.geometry = geoData.body.features[0].geometry;
    // Add campground images
    // - map over req.files array/map over the images
    // - for each elm in the array/for each image
    // - return an object with url and filename
    // - the objects are stored in 'images' array for that campground
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // Add campground author
    campground.author = req.user._id; // give the new camp an author param: save current authorized user as the author of the camp
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground') // Flash success-msg when we successfuly create a new camp. NB! Add in flash.ejs template + boilerplate
    res.redirect(`/campgrounds/${campground._id}`)
}

// function for show route - show a campground
module.exports.showCampround = async (req, res) => {   // route /campgrounds/:id -> 'id' property is in req.params.id + each obj in the database is given an id (check mongo shell)
    const campground = await Campground.findById(req.params.id).populate({ // populate - to access data, not just objectId. Populate the reviews on the campground (and the reviews' authors) + populate the author of the campground
        path: 'reviews',  
        populate: {
            path: 'author'
        }
}).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

// functions for edit route - edit a campground
module.exports.renderEditForm = async (req, res) => {  // render form to enter data you want to edit
    const { id } = req.params;
    const campground = await Campground.findById(id); 
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground }) 
}

module.exports.updateCampground = async (req, res) => {  // edits the campground based on the data from the form  
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true});
    // for updating the images 
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); // imgs = an array with objects of images' url and name 
    campground.images.push(...imgs); // pass in the data from 'imgs' array = pass in the individual object, not the actual array
    await campground.save();
    // for deleting images
    if(req.body.deleteImages) { // if there are imges we want to delete (there are elm in deleteImages array)
        // delete image from cloudinary
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); 
        }
        // delete image from database
        await campground.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages }}}}); // from 'images array', remove images where filename is in .deleteImages array
    }   
    // flash success msg when we edit a camp, then redirect to the camp's show page. NB! Add in flash.ejs template + boilerplate
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

// function for delete route - delete a campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}
// NB! Also deletion middleware in campground.js model, for deleting reviews related to a camp we've deleted
