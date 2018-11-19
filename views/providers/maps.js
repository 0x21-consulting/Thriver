import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import Providers from '/logic/providers/schema';
import Settings from '/logic/core/settings';
import geoXML3 from './geoxml3';

// Subscribe to Provider data
Meteor.subscribe('providers');
Meteor.subscribe('counties');

let { google } = window;

// Map handler
// eslint-disable-next-line import/no-mutable-exports
let mapObject = {};

// Close Map Search
Providers.closeMapSearch = () => {
  const search = document.querySelector('.providers .providerSearch');
  if (search instanceof Element && search.classList.contains('active')) {
    search.classList.remove('active');
  }
};

// Close Map Search
Providers.openDetails = () => document.getElementById('service-providers').classList.remove('full-view');

// Setting the map view to full
const fullMap = (condition, providerSection) => {
  if (!providerSection) return;

  if (condition === true) {
    providerSection.classList.add('full-view');
    if (mapObject.getZoom() > 0) mapObject.setZoom(7);
    mapObject.setCenter(new google.maps.LatLng(44.863579, -89.574563));
  } else {
    providerSection.classList.remove('full-view');
  }
};

// Hide info label on mouseout
const hideLabel = () => {
  if (mapObject.infowindow) mapObject.infowindow.close();
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
    if (mapObject.infowindow) mapObject.infowindow.close();

    // Create new infowindow
    mapObject.infowindow = new google.maps.InfoWindow({
      content: `<p class="providerTitle">${this.title}</p>`,
    });

    // Open new infowindow
    mapObject.infowindow.open(this.get('map'), this);
  };

  // Map Initialization function
  const init = () => {
    ({ google } = window);
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
    mapObject = new google.maps.Map(mapElement, options);

    // Drag Bounds
    const allowedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(42.070704, -92.729125),
      new google.maps.LatLng(46.503119, -86.315914),
    );
    let lastValidCenter = mapObject.getCenter();

    google.maps.event.addListener(mapObject, 'center_changed', function() {
      if (allowedBounds.contains(mapObject.getCenter())) {
        lastValidCenter = mapObject.getCenter();
        return;
      }
      mapObject.panTo(lastValidCenter);
    });

    // State Layer
    const stateLayer = new geoXML3.parser({ // eslint-disable-line new-cap
      map: mapObject,
      singleInfoWindow: true,
      suppressInfoWindows: false,
    });
    stateLayer.parse('/wisconsin_state.kml');

    // County Layer
    const countyLayer = new geoXML3.parser({ // eslint-disable-line new-cap
      map: mapObject,
      singleInfoWindow: true,
      suppressInfoWindows: false,
    });
    countyLayer.parse('/wisconsin_counties.kml');

    // Map Options
    mapObject.set('styles', [{
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
    Tracker.autorun((c) => {
      const providerSection = document.querySelector('#mapCanvas').parentElement
        .parentElement.parentElement;

      // Show the full map by default
      fullMap(true, providerSection);

      // Get all providers' IDs, names, and coordinates
      const providers = Providers.collection.find({}, { name: 1, coordinates: 1 });

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
        marker.setMap(mapObject);

        // Click Marker
        // NOTE: Can't use lambda expression because of `this` context
        marker.addListener('click', function eventHandler() {
          // Show details pane
          document.getElementById('service-providers').classList.remove('full-view');
          google.maps.event.trigger(mapObject, 'resize');

          // Appropriate zoom level
          mapObject.setZoom(11);
          mapObject.panTo(marker.getPosition());

          // Show results if the result has an ID
          if (this.id) {
            Providers.active.set(Providers.collection
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
      marker.setMap(mapObject);
    })();
  };

  // Create maps API script
  const googleApiKey = Settings.get('googleMapsApiKey');
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
  let providers = [];
  let x = [];
  let y = [];

  // Get coordinates for all providers for that county
  providers = Providers.collection.find({
    counties: { $elemMatch: { $in: [county] } },
  }, { coordinates: 1, name: 1 }).map(provider => ({
    // We only care about the coordinates
    coordinates: provider.coordinates,
    id: provider._id,
    name: provider.name,
  }));

  // If there aren't any providers for this county, report that
  if (!providers.length) return false;

  // Calculate bounding box
  // Determine lowest and highest Lat values
  providers.sort((a, b) => b.coordinates.lat - a.coordinates.lat);

  x = [providers[0].coordinates.lat,
    providers[providers.length - 1].coordinates.lat];

  // Determine lowest and highest Lon values
  providers.sort((a, b) => b.coordinates.lon - a.coordinates.lon);

  y = [providers[0].coordinates.lon,
    providers[providers.length - 1].coordinates.lon];

  // If there was only one result, click on it for the user
  if (providers.length === 1) {
    Providers.active.set(Providers.collection
      .findOne({ _id: providers[0].id }));
    document.getElementById('service-providers').classList.remove('full-view');
    google.maps.event.trigger(mapObject, 'resize');
  } else {
    document.getElementById('service-providers').classList.add('full-view');
    google.maps.event.trigger(mapObject, 'resize');
  }

  return true;
};

// Get county from ZIP code number
const getCounty = (zip) => {
  let county = '';

  // Get county
  county = Providers.counties.findOne({
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
    Providers.openDetails();
    const name = event.target.value;

    moveMap(name);

    // Close search field
    Providers.closeMapSearch();
    document.body.classList.remove('providersListOpen');
  },

  // Geolocate
  'click button.geolocate': () => {
    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Get the distance from current location for each provider
        const distanceProviders = Providers.collection.find({}, { coordinates: 1 })
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

        // Nothing to do if there aren't any providers
        if (!distanceProviders.length) return;

        // Get closest provider
        const closest = Providers.collection.findOne({ _id: distanceProviders[0].id });

        // Show details pane and resize map
        document.getElementById('service-providers').classList.remove('full-view');
        google.maps.event.trigger(mapObject, 'resize');

        // Center on it
        mapObject.panTo(new google.maps.LatLng(
          closest.coordinates.lat,
          closest.coordinates.lon,
        ));

        mapObject.setZoom(11);

        // Show results
        Providers.active.set(closest);
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

    google.maps.event.trigger(mapObject, 'resize');

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
    Providers.closeMapSearch();
    Providers.openDetails();
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
      Providers.closeMapSearch();
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
  event.stopPropagation();
  event.preventDefault();

  const { data } = Template.instance();

  // Update info section
  Providers.active.set(Providers.collection
    .findOne({ _id: data._id }));

  // Close providers section
  document.body.classList.remove('providersListOpen');

  // Update map
  document.getElementById('service-providers').classList.remove('full-view');
  google.maps.event.trigger(mapObject, 'resize');
  mapObject.panTo(new google.maps.LatLng(
    data.coordinates.lat,
    data.coordinates.lon,
  ));
  mapObject.setZoom(13);
};

Template.providerListViewItem.events({
  'click div.pad': followProviderLink,
});

export default mapObject;
