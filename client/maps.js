// Subscribe to Provider data
Meteor.subscribe('providers');

// Initialize Google Maps API
var initialize = function () {
    // Map handler
    var map,
    
    // Map Initialization function
    initialize = function () {
        var mapElement = document.querySelector('#map-canvas'),
        
        // Map options
        options = {
            scrollwheel : false,
            zoom        : 12,
            center      : new google.maps.LatLng(43.1, -89.4),
            zoomControl : true,
            streetViewControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE
            }
        };
        
        // Map instance
        map = new google.maps.Map(mapElement, options);
        
        // Get all providers' IDs, names, and coordinates
        Providers.find({}, { name: 1, coordinates: 1}).
        
        // Create map markers for each provider
        forEach(function (provider) {
            var marker = new google.maps.Marker({
                position : new google.maps.LatLng(provider.coordinates[0],
                           provider.coordinates[1]),
                icon     : createPin('#f56f76'),
                animation: google.maps.Animation.DROP,
                title    : provider.name,
                id       : provider._id
            });
            
            // Add hover effect
            google.maps.event.addListener(marker, 'mouseover', mouseover);
            google.maps.event.addListener(marker, 'mouseout', mouseout);
            
            // Display Label
            google.maps.event.addListener(marker, 'click', displayLabel);
            
            // Add to map
            marker.setMap(map);
        });
        
        // Geolocation
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(function (position) {
                var closest,
                
                // Get the distance from current location for each provider
                providers = Providers.find({}, { coordinates: 1 }).map(function (provider) {
                    // Calculate distance
                    var distance = Math.sqrt(
                        Math.pow(position.coords.latitude  - provider.coordinates[0], 2)  +
                        Math.pow(position.coords.longitude - provider.coordinates[1], 2) );
                    
                    return { id: provider._id, distance: distance };
                });
                
                // Sort array
                providers.sort(function (a, b) { return a.distance - b.distance; });
                
                // Get closest provider
                closest = Providers.findOne({ _id: providers[0].id });
                console.debug(closest, map);
                
                // Center on it
                map.panTo(new google.maps.LatLng(
                    closest.coordinates[0],
                    closest.coordinates[1]
                ));
                
                // Show results
                Session.set('currentProvider', closest);
                
                /*var parser = new geoXML3.parser({ map: map });
                console.debug(parser);
                parser.parse('/kml/dane.xml');
                
                var county = new google.maps.KmlLayer(
                    'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=6&cad=rja&uact=8&ved=0CEIQFjAFahUKEwiS56zm0oTHAhUB7YAKHQoQAOI&url=http%3A%2F%2Fwww.nohrsc.noaa.gov%2Fdata%2Fvector%2Fmaster%2Fcnt_us.kmz&ei=6gi7VZLKGoHagwSKoICQDg&usg=AFQjCNFuWrQr5e84jhSo2bWp09QO-MtoMg&sig2=gAvpWT8iDoBPLeN3OMyNRQ', {
                    preserveViewport: false,
                });
                county.setMap(map);
                
                google.maps.event.addListener(county, 'status_changed', function () {
                    console.debug(county.getStatus());
                });*/
            });
    },
    
    // Create SVG Marker Pin
    createPin = function (fillColor) {
        return {
            // SVG Path
            path: 'M 24,4.1C21.2,1.4,17.9,0,14,0c-3.9,0-7.2,1.4-9.9,4.1C1.4,6.9,0,10.2,0,14c0,2,0.3,3.6,0.9,4.9l10,21.2c0.3,0.6,0.7,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.9,0.5c0.7,0,1.3-0.2,1.9-0.5c0.6-0.3,1-0.8,1.3-1.4l10-21.2c0.6-1.3,0.9-2.9,0.9-4.9C28.1,10.2,26.7,6.9,24,4.1L24,4.1z M19,19c-1.4,1.4-3,2.1-5,2.1c-1.9,0-3.6-0.7-5-2.1C7.7,17.6,7,16,7,14c0-1.9,0.7-3.6,2.1-5c1.4-1.4,3-2.1,5-2.1c1.9,0,3.6,0.7,5,2.1c1.4,1.4,2.1,3,2.1,5C21.1,16,20.4,17.6,19,19L19,19z M19,19',
            
            // Attributes
            fillColor   : fillColor,
            fillOpacity : 1,
            scale       : 1,
            //shape     : shape,
            strokeWeight: 0,
            
            // Pin Position/Offset Controls
            size        : new google.maps.Size(29, 43),
            origin      : new google.maps.Point(0,0),
            anchor      : new google.maps.Point(14, 43)
        }
    },
    
    // Hover effects
    mouseover = function () {
        this.setIcon(createPin('#000'), this);
    },
    mouseout = function () {
        this.setIcon(createPin('#f56f76'), this);
    },
    
    // Display info label on click
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
        
        // Show results
        Session.set('currentProvider', Providers.findOne({ _id: this.id }));
    },
    
    // Create maps API script
    script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=true&callback=initializeMap';
    document.body.appendChild(script);
    
    // Maps API will look for initialize script in global scope
    window.initializeMap = initialize;
};

// On proper initialization (meteor sucks at handling race conditions)
Template.body.onRendered(function () {
    Template.providers.onRendered(initialize);
});