// Subscribe to Provider data
Meteor.subscribe('providers');
Meteor.subscribe('counties');

var Counties  = new Mongo.Collection('counties'),

// Providers cursor
providers,

// Map handler
map = {},

// Initialize Google Maps API
initialize = function () {
    // Map Initialization function
    var initialize = function () {
        var mapElement = document.querySelector('#mapCanvas'),

        // Map options
        options = {
            scrollwheel : false,
            zoom        : 12,
            center      : new google.maps.LatLng(43.1, -89.4),
            zoomControl : true,
            minZoom     : 6,
            maxZoom     : 13,
            streetViewControl: false,
            zoomControlOptions: {
                style: 3
            },
        };


        // Map instance
        map = new google.maps.Map(mapElement, options);
        map.set('styles', [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "stylers": [
                    { "gamma": 0.78 },
                    { "lightness": 5 },
                    { "saturation": 22 }
                ]
            },
            {
                "featureType": "water",
                "stylers": [
                    { "hue": "#00ddff" },
                    { "color": "#04648d" },
                    { "saturation": -23 },
                    { "lightness": 17 },
                    { "gamma": 1.94 }
                ]
            }
        ]);

        // Wait for collection to become available before acting on it
        Deps.autorun(function (c) {
            // Get all providers' IDs, names, and coordinates
            providers = Providers.find({}, { name: 1, coordinates: 1});

            // If collection not ready, try again
            if ( !providers.count() ) return;

            // Create map markers for each provider
            providers.forEach(function (provider) {
                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(provider.coordinates[0],
                            provider.coordinates[1]),
                    icon     : createPin('#00b7c5','#004146'),
                    animation: google.maps.Animation.DROP,
                    title    : provider.name,
                    id       : provider._id
                });

                // Add hover effect
                google.maps.event.addListener(marker, 'mouseover', mouseover);
                google.maps.event.addListener(marker, 'mouseout',  mouseout);

                // Display Label
                google.maps.event.addListener(marker, 'mouseover', displayLabel);

                // Add to map
                marker.setMap(map);

                //Click Marker
                marker.addListener('click', function() {
                    fullMap(false);
                    google.maps.event.trigger(map,'resize');
                    map.setZoom(12);
                    map.panTo(marker.getPosition());

                    // Show results if the result has an ID
                    if (this.id)
                        Session.set('currentProvider', Providers.findOne({ _id: this.id }));
                });
            });

            // Stop
            c.stop();
            var infoWindow = new google.maps.InfoWindow({map: map});
            // Geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var closest,

                    // Get the distance from current location for each provider
                    providers = Providers.find({}, { coordinates: 1 }).map(function (provider) {
                        // Calculate distance
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(
                            new google.maps.LatLng(position.coords.latitude,
                                position.coords.longitude),
                            new google.maps.LatLng(provider.coordinates[0],
                                provider.coordinates[1])
                        );

                        return { id: provider._id, distance: distance };
                    });

                    // Sort array
                    providers.sort(function (a, b) { return a.distance - b.distance; });

                    // Get closest provider
                    closest = Providers.findOne({ _id: providers[0].id });

                    // Center on it
                    map.panTo(new google.maps.LatLng(
                        closest.coordinates[0],
                        closest.coordinates[1]
                    ));

                    // Show results
                    Session.set('currentProvider', closest);
                }, function() {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else{
                handleLocationError(false, infoWindow, map.getCenter());
            }
        });

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
          document.getElementById("service-providers").classList.add("full-view");
          if (map.getZoom() > 0) map.setZoom(7);
          map.setCenter(new google.maps.LatLng(44.863579, -89.574563));
      }


        // Create a WCASA map marker
        (function () {
            var marker = new google.maps.Marker({
                position : new google.maps.LatLng(43.0346679, -89.4252416),
                icon     : createPin('#062131','##062131'),
                animation: google.maps.Animation.DROP,
                title    : 'WCASA'
            });

            // Display Label
            google.maps.event.addListener(marker, 'mouseover', displayLabel);
            google.maps.event.addListener(marker, 'mouseout',  hideLabel);

            // Add to map
            marker.setMap(map);
        })();

    },

    // Create SVG Marker Pin
    createPin = function (fillColor,strokeColor) {
        return {
            // SVG Path
            path: 'M 24,4.1C21.2,1.4,17.9,0,14,0c-3.9,0-7.2,1.4-9.9,4.1C1.4,6.9,0,10.2,0,14c0,2,0.3,3.6,0.9,4.9l10,21.2c0.3,0.6,0.7,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.9,0.5c0.7,0,1.3-0.2,1.9-0.5c0.6-0.3,1-0.8,1.3-1.4l10-21.2c0.6-1.3,0.9-2.9,0.9-4.9C28.1,10.2,26.7,6.9,24,4.1L24,4.1z M19,19c-1.4,1.4-3,2.1-5,2.1c-1.9,0-3.6-0.7-5-2.1C7.7,17.6,7,16,7,14c0-1.9,0.7-3.6,2.1-5c1.4-1.4,3-2.1,5-2.1c1.9,0,3.6,0.7,5,2.1c1.4,1.4,2.1,3,2.1,5C21.1,16,20.4,17.6,19,19L19,19z M19,19',

            // Attributes
            fillColor   : fillColor,
            fillOpacity : 1,
            scale       : 0.9,
            //shape     : shape,
            strokeWeight: 2,
            strokeColor : strokeColor,

            // Pin Position/Offset Controls
            size        : new google.maps.Size(29, 43),
            origin      : new google.maps.Point(0,0),
            anchor      : new google.maps.Point(14, 43)
        }
    },

    // Hover effects
    mouseover = function () {
        this.setIcon(createPin('#00cad9','#004146'), this);
    },
    mouseout = function () {
        this.setIcon(createPin('#00b7c5','#004146'), this);
    },

    // Display info label on hover
    displayLabel = function () {
        // Close any existing infowindow
        if (map.infowindow)
            map.infowindow.close();

        // Create new infowindow
        map.infowindow = new google.maps.InfoWindow({
            content: '<p class="providerTitle">' + this.title + '</p>'
        });

        // Open new infowindow
        map.infowindow.open(this.get('map'), this);

    },

    // Create maps API script
    script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&libraries=geometry&callback=initializeMap';
    document.body.appendChild(script);

    // Maps API will look for initialize script in global scope
    window.initializeMap = initialize;
},

// Helper for moving map based on provider locations
moveMap = function (county) {
    var providers = [], x = [], y = [];

    // Mutual Suspician
    county = '' + county;
    if (!county) throw new Error('Invalid county');

    // Get coordinates for all providers for that county
    providers = Providers.find({ counties: { $elemMatch: { $in: [county] }}},
        { coordinates: 1, name:1 }).map(function (provider) {
            // We only care about the coordinates
            return {
                coordinates: provider.coordinates,
                id: provider._id,
                name: provider.name
            };
    });

    // Calculate bounding box
    // Determine lowest and highest Lat values
    providers.sort(function (a, b) {
        return b.coordinates[0] - a.coordinates[0];
    });
    x = [ providers[0].coordinates[0], providers[providers.length - 1].coordinates[0] ];

    // Determine lowest and highest Lon values
    providers.sort(function (a, b) {
        return b.coordinates[1] - a.coordinates[1];
    });
    y = [ providers[0].coordinates[1], providers[providers.length - 1].coordinates[1] ];

    // Bounds
    map.fitBounds(new google.maps.LatLngBounds(
        new google.maps.LatLng( x[1], y[1] ), // Southwest
        new google.maps.LatLng( x[0], y[0] )  // to Northeast
    ));

    // If there was only one result, click on it for the user
    if (providers.length === 1){
        Session.set('currentProvider', Providers.findOne({ _id: providers[0].id }));
    } else{
        document.getElementById("service-providers").classList.add("full-view");
    }
},

// Setting the map view to full
fullMap = function (condition) {
    if (condition == true){
        document.getElementById("service-providers").classList.add("full-view");
        if (map.getZoom() > 0) map.setZoom(7);
        map.setCenter(new google.maps.LatLng(44.863579, -89.574563));
    } else{
        document.getElementById("service-providers").classList.remove("full-view");
    }
},

// Hide info label on mouseout
hideLabel = function () {
    if (map.infowindow)
        map.infowindow.close();
},

// Get X and Y Coordinates based on web mercator projection
getXY = function (lat, lon) {
    console.info('Meters per pixel', 156543.03392 * Math.cos(lat * Math.PI / 180)
        / Math.pow(2, 12));
    return [
        128 / Math.PI * Math.pow(2, 12) * (lon + Math.PI),
        128 / Math.PI * Math.pow(2, 12) * (Math.PI -
            Math.log( Math.tan( Math.PI / 4 + lat / 2 ) ))
    ];
},

// Get county from ZIP code number
getCounty = function (zip) {
    var county = '';

    // Mutual Suspicion
    if (!zip) throw new Error('No ZIP element?');

    // Get county
    county = Counties.findOne({ zips:
        // Minimongo doesn't support $eq for some reason
        { $elemMatch: { $in: [zip] } }});

    // Now get providers that support that county
    moveMap(county.name);
};



// On proper initialization (meteor sucks at handling race conditions)
//Template.body.onRendered(function () {
    Template.providers.onRendered(initialize);
//});

Template.providers.events({
    // County drop-down list
    'change #county': function (event) {
        openDetails();
        var name = event.target.value;

        // Mutual Suspician
        if (!name) throw new Error('Invalid county');

        moveMap(name);

        // Close search field
        closeMapSearch();
        document.body.classList.remove('providersListOpen');
    },
    'click .mapView': function (event) {
        event.stopPropagation();event.preventDefault();
        document.body.classList.remove('providersListOpen');
        document.getElementById("service-providers").classList.add("full-view");
        google.maps.event.trigger(map,'resize');
        hideLabel();
        fullMap(true);
    },
    'click .fullMap': function (event){
        event.stopPropagation();event.preventDefault();
        document.body.classList.remove('providersListOpen');
        document.getElementById("service-providers").classList.add("full-view");
        google.maps.event.trigger(map,'resize');
        hideLabel();
        fullMap(true);
    },
    // Clicking ZIP Code GO button
    'click #zip + .submit': function (event) {
        // Stop form submission
        event.preventDefault();

        getCounty(event.currentTarget.parentElement.querySelector('#zip').value);

        // Close search field
        closeMapSearch();
        openDetails();
    },
    // Reaching 5 digits
    'keyup #zip': function (event) {
        if (event.currentTarget.value.length === 5) {
            openDetails();
            getCounty(event.currentTarget.value);
            document.body.classList.remove('providersListOpen');
            // Close search field
            closeMapSearch();
            google.maps.event.trigger(map,'resize');
        }
    }
});

/**
 * Follow Provider link to pin on map
 * @method
 *   @param {$.Event} event - jQuery event passed to handler
 */
Template.providerListViewItem.events({
    'click div.pad': function (event) {
        if ( !(event instanceof $.Event) ) return;
        event.stopPropagation();
        event.preventDefault();

        // Update info section
        Session.set('currentProvider', Providers.findOne({ _id: this._id }));

        // Update map
        map.panTo(new google.maps.LatLng(
            this.coordinates[0],
            this.coordinates[1]
        ));

        // Close providers section
        document.body.classList.remove('providersListOpen');
    }
});
