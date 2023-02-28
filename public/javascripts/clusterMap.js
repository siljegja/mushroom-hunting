mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-103.5917, 40.6699],
    zoom: 3
});

// adding controls on map (zoom in and out)
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('campgrounds', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    }); 
 
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 10
            //   * Yellow, 30px circles when point count is between 10 and 30
            //   * Pink, 40px circles when point count is greater than or equal to 30
            'circle-color': [ // circle color
                'step',
                ['get', 'point_count'],
                '#9D91A3',
                10,
                '#9D91A3',
                30,
                '#C49792'
            ],
            'circle-radius': [  // circle size depending on the number of camps in it
                'step',
                ['get', 'point_count'],
                25, // pixel width
                10, // step (<100 camps will be 20px wide)
                20,
                30,
                25
            ]
        }
    });
    
    // change the clustered points
    map.addLayer({
        id: 'cluster-count', // adds count of camps in the cluster
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'], // text inside clustered points
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
    
    // change the unclustered points
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']], 
        paint: {
            'circle-color': '#EDAF97',
            'circle-radius': 6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    
    // inspect a cluster on click - zooms you in when clicked
    // the point you click on becomes the new center
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;
    
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });
    
    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
        const popUpText = e.features[0].properties.popUpMarkup;
        const coordinates = e.features[0].geometry.coordinates.slice();
        // const mag = e.features[0].properties.mag;
        // const tsunami =
        //     e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
    
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
    
        // make a PopUp
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                popUpText
            )
            .addTo(map);
    });
    
    // when your mouse enter over a cluster
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    // when your mouse leaves a cluster
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

});

