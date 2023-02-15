// Campground routes

/* 
Restful routes for campgrounds (routes with crud operations + http methods)
Set up middleware
router.get(path, middlewareX, middlewareY, controller_function)
*/

// Require
const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds'); // controller for campground routes
const catchAsync = require('../utilities/catchAsync'); // require func for handling async errors
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware'); 
const multer = require('multer'); // middleware for handling multipart/form-data, for uploading file
const { storage } = require('../cloudinary'); // cloudinary storage
const upload = multer({ storage }); // store using cloudinary storage

// Routes
router.route('/')
    .get(catchAsync (campgrounds.index)) // index route
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgrounds.createCampground)) // new route - create campground 
                         // .single expect one file/image, .array expect multiple files

router.get('/new', isLoggedIn, campgrounds.renderNewForm); // new route - render form 

router.route('/:id')
    .get(catchAsync (campgrounds.showCampround)) // show campground route
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) // edit route - udpate campground 
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // delete campground route

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); // edit route - render form


// Old way of structuring routes: 

// Index route
// router.get('/', catchAsync (campgrounds.index));

// New campground route
// router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// router.post('/', isLoggedIn, validateCampground, catchAsync (campgrounds.createCampground));

// Show campground route
// router.get('/:id', catchAsync (campgrounds.showCampround));

// Edit/Update campground route
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// Delete campground route
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// Export routes
module.exports = router;