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
            center      : new google.maps.LatLng(43.1, -89.4)
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
                title    : provider.name
            });
            
            // Add hover effect
            google.maps.event.addListener(marker, 'mouseover', mouseover);
            google.maps.event.addListener(marker, 'mouseout', mouseout);
            
            // Add to map
            marker.setMap(map);
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
    
    // Create maps API script
    script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=true&callback=initialize';
    document.body.appendChild(script);
    
    // Maps API will look for initialize script in global scope
    window.initialize = initialize;
};

// On proper initialization
Template.body.onRendered(function () {
    Template.providers.onRendered(initialize);
});