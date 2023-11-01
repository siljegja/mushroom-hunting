const Sighting = require('../models/sightings'); 
const { cloudinary } = require('../cloudinary'); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapBoxToken = process.env.MAPBOX_TOKEN; 
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); 

module.exports.index = async (req, res) => {
    const sightings = await Sighting.find({});
    res.render('sightings/index', { sightings })
}

module.exports.renderNewForm = (req, res) => {        
    res.render('sightings/new')
}

module.exports.createSighting = async (req, res) => { 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.sighting.location,
        limit: 1
    }).send()
    const sighting = new Sighting(req.body.sighting);
    sighting.geometry = geoData.body.features[0].geometry;
    sighting.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    sighting.author = req.user._id; 
    await sighting.save();
    console.log(sighting)
    req.flash('success', 'Successfully made a new sighting') 
    res.redirect(`/sightings/${sighting._id}`)
}

module.exports.showSighting = async (req, res) => {  
    const sighting = await Sighting.findById(req.params.id).populate({ 
        path: 'reviews',  
        populate: {
            path: 'author'
        }
}).populate('author');
    if (!sighting) {
        req.flash('error', 'Sighting not found')
        return res.redirect('/sightings');
    }
    res.render('sightings/show', { sighting })
}

module.exports.renderEditForm = async (req, res) => {  
    const { id } = req.params;
    const sighting = await Sighting.findById(id); 
    if (!sighting) {
        req.flash('error', 'Sighting not found')
        return res.redirect('/sightings');
    }
    res.render('sightings/edit', { sighting }) 
}

module.exports.updateSighting = async (req, res) => {  
    const { id } = req.params;
    const sighting = await Sighting.findByIdAndUpdate(id, req.body.sighting, {runValidators: true});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); 
    sighting.images.push(...imgs); 
    await sighting.save();
    if(req.body.deleteImages) { 
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); 
        }
        await sighting.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages }}}}); 
    }   
    req.flash('success', 'Successfully updated sighting');
    res.redirect(`/sightings/${sighting._id}`)
}

module.exports.deleteSighting = async (req, res) => {
    const { id } = req.params;
    const deletedSighting = await Sighting.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted sighting')
    res.redirect('/sightings');
}
