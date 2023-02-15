// JavaScrit for our GeoMap

// script for the geo map 
mapboxgl.accessToken = mapToken; // mapToken variable is found in show.ejs
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    // center: [-74.5, 40], // starting position [lng, lat]
    center: campground.geometry.coordinates,
    zoom: 9, // starting zoom
});

// adding controls on map (zoom in and out)
map.addControl(new mapboxgl.NavigationControl());

// Create a Marker and add it to the map
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates) // set cordinates
    .setPopup( // add popup component to marker
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${campground.title} </h3><p>${campground.location}</p>`
        )
    )
    .addTo(map) // add to our map

