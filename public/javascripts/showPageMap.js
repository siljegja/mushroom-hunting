mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v10',
    center: sighting.geometry.coordinates,
    zoom: 9, 
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(sighting.geometry.coordinates) 
    .setPopup( 
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${sighting.title} </h3><p>${sighting.location}</p>`
        )
    )
    .addTo(map) 

