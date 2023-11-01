const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Sighting = require('../models/sightings');

mongoose.connect('mongodb://localhost:27017/mushroom-hunting');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
}); 

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Sighting.deleteMany({}); 
    for(let i = 0; i < 15; i++) {
        const random1000 = Math.floor(Math.random() * 1000); 
        const sighting = new Sighting({
            author: '6540d5c44194065d323bb2e6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'The fly agaric mushroom is one of the most recognizable mushrooms. Be aware that it is poisonous and should not be eaten.',
            geometry: { 
                type : 'Point', 
                coordinates : [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ] 
            },
            
            images: [
                {
                    url: 'https://res.cloudinary.com/dmhlzrw28/image/upload/v1698740945/MushroomHunting/ed-van-duijn-dpDXYWj8oas-unsplash_wgvoe8.jpg',
                    filename: 'MushroomHunting/ed-van-duijn-dpDXYWj8oas-unsplash_wgvoe8.jpg',
                },
                { 
                    url : 'https://res.cloudinary.com/dmhlzrw28/image/upload/v1698742012/MushroomHunting/krzysztof-niewolny--nMPFpR9tek-unsplash_pwfzok.jpg', 
                    filename : 'MushroomHunting/krzysztof-niewolny--nMPFpR9tek-unsplash_pwfzok.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/dmhlzrw28/image/upload/v1698742016/MushroomHunting/igor-yemelianov-2zf9OjuoqQk-unsplash_wpvagu.jpg',
                    filename: 'MushroomHunting/igor-yemelianov-2zf9OjuoqQk-unsplash_wpvagu.jpg/',
                }  
            ]
        })
        await sighting.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

