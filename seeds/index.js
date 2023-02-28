const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/camp-site');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Oneliner func - picks a random elm from a given array
// - pick a rand num * length of array, floor that - access that out of the array
const sample = array => array[Math.floor(Math.random() * array.length)];

// Func adds new campgrounds
const seedDB = async() => {
    await Campground.deleteMany({}); // delete all existing campgrounds
    // loop 20 times, for each loop:
    // - make a new campground set to 'city, state'
    //   -> picks a rand num that selects a rand city and a rand state in cities.js
    // - add title: a rand descriptor and a rand place (from seedHelpers.js)
    //   -> passes arr descriptors and places from seedHelpers.js to sample() - returns random
    for(let i = 0; i < 21; i++) {
        const random1000 = Math.floor(Math.random() * 1000); // .rand finds a rand num between 0-1, .floor ensures an integer
        const price = Math.floor(Math.random() * 20) + 10; 
        const camp = new Campground({
            // YOUR USER ID
            author: '63db7d1d8a94ab78c16d68e5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis iusto eum repudiandae animi, repellat voluptatum autem? Quae delectus sit veniam accusamus quas asperiores eaque cumque nemo officiis culpa? In, quae?',
            price, 
            geometry: { // set random coordinates for our seeds (used for the geomap)
                type : 'Point', 
                coordinates : [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ] 
            },
            images: [
                { 
                    url : 'https://res.cloudinary.com/dmhlzrw28/image/upload/v1675941830/YelpCamp/khlz15p0f7bckn8hozk6.jpg', 
                    filename : 'YelpCamp/khlz15p0f7bckn8hozk6',
                },
                {
                    url: 'https://res.cloudinary.com/dmhlzrw28/image/upload/v1675771504/YelpCamp/fzy2tlbmi1rengv9ymbu.jpg',
                    filename: 'YelpCamp/fzy2tlbmi1rengv9ymbu',
                }
            ]
        })
        await camp.save();
    }
}

// execute seedDB() that creates new Campgrounds - then closes
// - so we can call this index.js file to get new camps, then it closes itself
// - !! call this in terminal: node seeds/index.js  (won't work with nodemon)
seedDB().then(() => {
    mongoose.connection.close();
})

