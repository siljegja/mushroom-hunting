const express = require('express');
const router = express.Router();
const sightings = require('../controllers/sightings'); 
const catchAsync = require('../utilities/catchAsync'); 
const { isLoggedIn, isAuthor, validateSighting } = require('../middleware'); 
const multer = require('multer'); 
const { storage } = require('../cloudinary'); 
const upload = multer({ storage }); 

router.route('/')
    .get(catchAsync (sightings.index)) 
    .post(isLoggedIn, upload.array('image'), validateSighting, catchAsync (sightings.createSighting)) 

router.get('/new', isLoggedIn, sightings.renderNewForm);

router.route('/:id')
    .get(catchAsync (sightings.showSighting)) 
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSighting, catchAsync(sightings.updateSighting))  
    .delete(isLoggedIn, isAuthor, catchAsync(sightings.deleteSighting)) 

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(sightings.renderEditForm)); 

module.exports = router;