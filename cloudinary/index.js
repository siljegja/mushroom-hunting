// Cloudinary file (for image upload)

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // for uploading multiple iamges

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// instantiate an instance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary, // object we configured above
    params: {
        folder: 'YelpCamp', // Folder in cloudinary where we will store things
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// export cloudinary and storage
module.exports = {
    cloudinary,
    storage
}

