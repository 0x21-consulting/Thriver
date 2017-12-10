// Subscribe to Provider data
Meteor.subscribe('providers');
Meteor.subscribe('counties');

// Map handler
Thriver.map = {};

// Close Map Search
Thriver.providers.closeMapSearch = () => {
  const search = document.querySelector('.providers .providerSearch');
  if (search instanceof Element && search.classList.contains('active')) {
    search.classList.remove('active');
  }
};

// Close Map Search
Thriver.providers.openDetails = () =>
  document.getElementById('service-providers').classList.remove('full-view');

// Setting the map view to full
const fullMap = (condition, providerSection) => {
  if (!providerSection) return;

  if (condition === true) {
    providerSection.classList.add('full-view');
    if (Thriver.map.getZoom() > 0) Thriver.map.setZoom(7);
    Thriver.map.setCenter(new google.maps.LatLng(44.863579, -89.574563));
  } else {
    providerSection.classList.remove('full-view');
  }
};

// Hide info label on mouseout
const hideLabel = () => {
  if (Thriver.map.infowindow) Thriver.map.infowindow.close();
};

// Initialize Google Maps API
const initialize = () => {
  // Create SVG Marker Pin
  const createPin = (fillColor, strokeColor) => ({
    // SVG Path
    path: 'M 24,4.1C21.2,1.4,17.9,0,14,0c-3.9,0-7.2,1.4-9.9,4.1C1.4,6.9,0,10.2,0,14c0,2,0.3,3.6,0.9,4.9l10,21.2c0.3,0.6,0.7,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.9,0.5c0.7,0,1.3-0.2,1.9-0.5c0.6-0.3,1-0.8,1.3-1.4l10-21.2c0.6-1.3,0.9-2.9,0.9-4.9C28.1,10.2,26.7,6.9,24,4.1L24,4.1z M19,19c-1.4,1.4-3,2.1-5,2.1c-1.9,0-3.6-0.7-5-2.1C7.7,17.6,7,16,7,14c0-1.9,0.7-3.6,2.1-5c1.4-1.4,3-2.1,5-2.1c1.9,0,3.6,0.7,5,2.1c1.4,1.4,2.1,3,2.1,5C21.1,16,20.4,17.6,19,19L19,19z M19,19',

    // Attributes
    fillColor,
    fillOpacity: 1,
    scale: 0.6,
    strokeWeight: 2,
    strokeColor,

    // Pin Position/Offset Controls
    size: new google.maps.Size(29, 43),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(14, 43),
  });

  // Hover effects
  // NOTE: Can't use lambda expression because of `this` context
  const mouseover = function mouseover() {
    this.setIcon(createPin('#00cad9', '#004146'), this);
  };
  const mouseout = function mouseout() {
    this.setIcon(createPin('#00b7c5', '#004146'), this);
  };

  // Display info label on hover
  // NOTE: Can't use lambda expression because of `this` context
  const displayLabel = function displayLabel() {
    // Close any existing infowindow
    if (Thriver.map.infowindow) Thriver.map.infowindow.close();

    // Create new infowindow
    Thriver.map.infowindow = new google.maps.InfoWindow({
      content: `<p class="providerTitle">${this.title}</p>`,
    });

    // Open new infowindow
    Thriver.map.infowindow.open(this.get('map'), this);
  };

  // Map Initialization function
  const init = () => {
    const mapElement = document.querySelector('#mapCanvas');

    // Map options
    const options = {
      scrollwheel: false,
      zoom: 7,
      center: new google.maps.LatLng(43.1, -89.4),
      zoomControl: true,
      minZoom: 7,
      maxZoom: 16,
      streetViewControl: false,
      zoomControlOptions: {
        style: 3,
      },
    };

    // Map instance
    Thriver.map = new google.maps.Map(mapElement, options);

    // County Layer
    const countyLayer = new geoXML3.parser({
      map: Thriver.map,
      singleInfoWindow: true,
      suppressInfoWindows: false,
    });
    countyLayer.parse('/packages/thriver_maps/lib/client/data/wisconsin_counties.kml');

    // Map Options
    Thriver.map.set('styles', [{
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    }, {
      stylers: [
        { gamma: 0.78 },
        { lightness: 5 },
        { saturation: 22 },
      ],
    }, {
      featureType: 'water',
      stylers: [
        { hue: '#00ddff' },
        { color: '#04648d' },
        { saturation: -23 },
        { lightness: 17 },
        { gamma: 1.94 },
      ],
    }]);

    // Wait for collection to become available before acting on it
    Deps.autorun((c) => {
      const providerSection = document.querySelector('#mapCanvas').parentElement
        .parentElement.parentElement;

      // Show the full map by default
      fullMap(true, providerSection);

      // Get all providers' IDs, names, and coordinates
      const providers = Thriver.providers.collection.find({}, { name: 1, coordinates: 1 });

      // If collection not ready, try again
      if (!providers.count()) return;

      // Create map markers for each provider
      providers.forEach((provider) => {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            provider.coordinates.lat,
            provider.coordinates.lon,
          ),
          icon: createPin('#00b7c5', '#004146'),
          animation: google.maps.Animation.DROP,
          title: provider.name,
          id: provider._id,
        });

        // Add hover effect
        google.maps.event.addListener(marker, 'mouseover', mouseover);
        google.maps.event.addListener(marker, 'mouseout', mouseout);

        // Display Label
        google.maps.event.addListener(marker, 'mouseover', displayLabel);

        // Hide Label
        google.maps.event.addListener(marker, 'mouseout', hideLabel);

        // Add to map
        marker.setMap(Thriver.map);

        // Click Marker
        // NOTE: Can't use lambda expression because of `this` context
        marker.addListener('click', function eventHandler() {
          // Show details pane
          document.getElementById('service-providers').classList.remove('full-view');
          google.maps.event.trigger(Thriver.map, 'resize');

          // Appropriate zoom level
          Thriver.map.setZoom(11);
          Thriver.map.panTo(marker.getPosition());

          // Show results if the result has an ID
          if (this.id) {
            Thriver.providers.active.set(Thriver.providers.collection
              .findOne({ _id: this.id }));
          }
        });
      });

      // Stop
      c.stop();
    });

    // Create a WCASA map marker
    (() => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.0346679, -89.4252416),
        icon: createPin('#062131', '##062131'),
        animation: google.maps.Animation.DROP,
        title: 'WCASA',
      });

      // Display Label
      google.maps.event.addListener(marker, 'mouseover', displayLabel);
      google.maps.event.addListener(marker, 'mouseout', hideLabel);

      // Add to map
      marker.setMap(Thriver.map);
    })();
  };

  // Create maps API script
  const googleApiKey = Thriver.settings.get('googleMapsApiKey');
  const script = document.createElement('script');
  if (googleApiKey) {
    script.src = `https://maps.googleapis.com/maps/api/js?v=3&libraries=geometry&callback=initializeMap&key=${googleApiKey}`;
  } else {
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=geometry&callback=initializeMap';
  }
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  // Maps API will look for initialize script in global scope
  window.initializeMap = init;
};

// Helper for moving map based on provider locations
const moveMap = (county) => {
  check(county, String);

  let providers = [];
  let x = [];
  let y = [];

  // Get coordinates for all providers for that county
  providers = Thriver.providers.collection.find({
    counties: { $elemMatch: { $in: [county] } },
  }, { coordinates: 1, name: 1 }).map(provider =>
    // We only care about the coordinates
    ({
      coordinates: provider.coordinates,
      id: provider._id,
      name: provider.name,
    }));

  // If there aren't any providers for this county, report that
  if (!providers.length) return false;

  // Calculate bounding box
  // Determine lowest and highest Lat values
  providers.sort((a, b) =>
    b.coordinates.lat - a.coordinates.lat);

  x = [providers[0].coordinates.lat,
    providers[providers.length - 1].coordinates.lat];

  // Determine lowest and highest Lon values
  providers.sort((a, b) =>
    b.coordinates.lon - a.coordinates.lon);

  y = [providers[0].coordinates.lon,
    providers[providers.length - 1].coordinates.lon];

  // If there was only one result, click on it for the user
  if (providers.length === 1) {
    Thriver.providers.active.set(Thriver.providers.collection
      .findOne({ _id: providers[0].id }));
    document.getElementById('service-providers').classList.remove('full-view');
    google.maps.event.trigger(Thriver.map, 'resize');
  } else {
    document.getElementById('service-providers').classList.add('full-view');
    google.maps.event.trigger(Thriver.map, 'resize');
  }

  // Bounds
  Thriver.map.fitBounds(new google.maps.LatLngBounds(
    new google.maps.LatLng(x[1], y[1]), // Southwest
    new google.maps.LatLng(x[0], y[0]), // to Northeast
  ));

  return true;
};

// Get county from ZIP code number
const getCounty = (zip) => {
  check(zip, String);

  let county = '';

  // Get county
  county = Thriver.providers.counties.findOne({
    // Minimongo doesn't support $eq for some reason
    zips: { $elemMatch: { $in: [zip] } },
  });

  // Now get providers that support that county
  if (!moveMap(county.name)) return false;
  return true;
};

Template.providers.onRendered(initialize);

Template.providers.events({
  // Not a real form; don't submit it anywhere
  'submit #search': event => event.preventDefault(),

  // County drop-down list
  'change #county': (event) => {
    Thriver.providers.openDetails();
    const name = event.target.value;

    check(name, String);

    moveMap(name);

    // Close search field
    Thriver.providers.closeMapSearch();
    document.body.classList.remove('providersListOpen');
  },

  // Geolocate
  'click button.geolocate': () => {
    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Get the distance from current location for each provider
        const distanceProviders = Thriver.providers.collection.find({}, { coordinates: 1 })
          .map((provider) => {
            // Calculate distance
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
              ),
              new google.maps.LatLng(
                provider.coordinates.lat,
                provider.coordinates.lon,
              ),
            );

            return { id: provider._id, distance };
          });

        // Sort array
        distanceProviders.sort((a, b) => a.distance - b.distance);

        // Get closest provider
        const closest = Thriver.providers.collection.findOne({ _id: distanceProviders[0].id });

        // Show details pane and resize map
        document.getElementById('service-providers').classList.remove('full-view');
        google.maps.event.trigger(Thriver.map, 'resize');

        // Center on it
        Thriver.map.panTo(new google.maps.LatLng(
          closest.coordinates.lat,
          closest.coordinates.lon,
        ));

        Thriver.map.setZoom(11);

        // Show results
        Thriver.providers.active.set(closest);
      });
    }
  },

  'click .mapView': (event) => {
    event.stopPropagation();
    event.preventDefault();

    document.body.classList.remove('providersListOpen');
    hideLabel();
  },

  'click .fullMap': (event) => {
    event.stopPropagation();
    event.preventDefault();

    const providerSection = event.target.parentElement
      .parentElement.parentElement.parentElement;

    document.body.classList.remove('providersListOpen');
    providerSection.classList.add('full-view');

    google.maps.event.trigger(Thriver.map, 'resize');

    hideLabel();
    fullMap(true, providerSection);
  },

  'click .seeAllProviders': (event) => {
    event.stopPropagation();
    event.preventDefault();

    const providerSection = event.target.parentElement
      .parentElement.parentElement.parentElement;

    providerSection.classList.remove('full-view');
    document.body.classList.add('providersListOpen');
  },

  // Clicking ZIP Code GO button
  'click #zip + .submit': (event) => {
    // Stop form submission
    event.preventDefault();

    const target = event.currentTarget;

    if (!getCounty(target.parentElement.querySelector('#zip').value)) {
      // No providers for this county
      target.parentElement.dataset.error = '\uf071';
      return;
    }
    target.parentElement.removeAttribute('data-error');

    // Close search field
    Thriver.providers.closeMapSearch();
    Thriver.providers.openDetails();
  },

  // Reaching 5 digits
  'keyup #zip': (event) => {
    const target = event.currentTarget;

    if (target.value.length === 5) {
      if (!getCounty(target.value)) {
        // No providers for this county
        target.parentElement.dataset.error = '\uf071';
        return;
      }
      target.parentElement.removeAttribute('data-error');

      // Close search field
      Thriver.providers.closeMapSearch();
      document.body.classList.remove('providersListOpen');
    }
  },
});

/**
 * Follow Provider link to pin on map
 * @method
 *   @param {$.Event} event - jQuery event passed to handler
 */
const followProviderLink = (event) => {
  check(event, $.Event);

  event.stopPropagation();
  event.preventDefault();

  const { data } = Template.instance();

  // Update info section
  Thriver.providers.active.set(Thriver.providers.collection
    .findOne({ _id: data._id }));

  // Close providers section
  document.body.classList.remove('providersListOpen');

  // Update map
  document.getElementById('service-providers').classList.remove('full-view');
  google.maps.event.trigger(Thriver.map, 'resize');
  Thriver.map.panTo(new google.maps.LatLng(
    data.coordinates.lat,
    data.coordinates.lon,
  ));
  Thriver.map.setZoom(13);
};

Template.providerListViewItem.events({
  'click div.pad': followProviderLink,
});
