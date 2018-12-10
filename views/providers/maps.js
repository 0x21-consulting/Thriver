import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import Providers from '/logic/providers/schema';
import Settings from '/logic/core/settings';
import geoXML3 from './geoxml3';
import MapLabel from '/views/lib/maplabel';

// Subscribe to Provider data
Meteor.subscribe('providers');
Meteor.subscribe('counties');

let { google } = window;

// Map handler
// eslint-disable-next-line import/no-mutable-exports
let mapObject = {};
const mapMarkers = [];


// Helper for Toggling Map Style based on zoom position
const mapStyle = (map, markers, zoom) => {
  if (zoom === 'county') {
    const styles = [{
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [{
        color: '#00c6dd',
      }],
    }, {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [{
        color: '#00b7c5',
      }, {
        visibility: 'on',
      }],
    }, {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{
        color: '#0094c4',
      }, {
        visibility: 'on',
      }],
    }, {
      elementType: 'labels',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'administrative.land_parcel',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'administrative.neighborhood',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'poi',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'road',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [{
        visibility: 'off',
      }],
    }, {
      featureType: 'transit',
      stylers: [{
        visibility: 'off',
      }],
    }];
    // Set Style Options
    map.setOptions({ styles });

    // Hide Pins
    for (let i = 0; i < markers.length; i += 1) {
      markers[i].setVisible(false);
    }
    // Center the map
    map.panTo(new google.maps.LatLng(44.668543, -89.756508));
    // Map Options
  } else {
    let styles = [{
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [{
        color: '#dff3f3',
      }],
    }, {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [{
        color: '#d7ece9',
      }, {
        visibility: 'on',
      }],
    }, {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{
        color: '#0094c4',
      }, {
        visibility: 'on',
      }],
    }, {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{
        color: '#ffffff',
      }],
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{
        color: '#00b7c5',
      }],
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{
        color: '#02deef',
      }],
    }];

    styles = styles.filter(featureType => featureType.name !== 'labels');
    styles = styles.filter(featureType => featureType.name !== 'administrative');
    styles = styles.filter(featureType => featureType.name !== 'administrative.land_parcel');
    styles = styles.filter(featureType => featureType.name !== 'administrative.neighborhood');
    styles = styles.filter(featureType => featureType.name !== 'poi');
    styles = styles.filter(featureType => featureType.name !== 'transit');

    // Set Style Options
    map.setOptions({ styles });
    // Show Pins
    for (let i = 0; i < markers.length; i += 1) {
      markers[i].setVisible(true);
    }
  }
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

  // Bounds
  mapObject.fitBounds(new google.maps.LatLngBounds(
    new google.maps.LatLng(x[1], y[1]), // Southwest
    new google.maps.LatLng(x[0], y[0]), // to Northeast
  ));

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
  if (!county || !moveMap(county.name)) return false;
  return true;
};

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
      center: new google.maps.LatLng(44.668543, -89.756508),
      zoomControl: true,
      minZoom: 7,
      maxZoom: 16,
      streetViewControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
        style: 3,
      },
      mapTypeControl: false,
      fullscreenControl: false,
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

    // Zoom Listener
    google.maps.event.addListener(mapObject, 'zoom_changed', function() {
      // Set Map View Style
      if (mapObject.getZoom() < 10) {
        mapStyle(mapObject, mapMarkers, 'county');
        // Clear any infowindows
        hideLabel();
      } else mapStyle(mapObject, mapMarkers, 'default');
    });

    // State Layer
    const stateLayer = new geoXML3.parser({ // eslint-disable-line new-cap
      map: mapObject,
      singleInfoWindow: true,
      suppressInfoWindows: true,
      zIndex: 1,
    });
    stateLayer.parse('/wisconsin_state.kml');

    // County Layer
    const clickablePolygon = (p) => {
      google.maps.event.addListener(
        p.polygon,
        'click',
        function () {
          if (mapObject.getZoom() < 10) moveMap(p.name);
        },
      );
      google.maps.event.addListener(
        p.polygon,
        'mouseover',
        function () {
          if (mapObject.getZoom() < 10) {
            p.polygon.setOptions({
              fillOpacity: 0.95,
              strokeColor: '#04cbe4',
              strokeOpacity: 0.95,
            });
          }
        },
      );
      google.maps.event.addListener(
        p.polygon,
        'mouseout',
        function () {
          if (mapObject.getZoom() < 10) {
            p.polygon.setOptions({
              fillOpacity: 0,
              strokeColor: '#f0fdff',
              strokeOpacity: 0.25,
            });
          }
        },
      );

      // Set Polygon Options
      p.polygon.setOptions({
        fillColor: '#04cbe4',
        strokeColor: '#f0fdff',
        fillOpacity: 0,
        strokeOpacity: 0.25,
      });
    };


    const countyLayer = new geoXML3.parser({ // eslint-disable-line new-cap
      map: mapObject,
      singleInfoWindow: true,
      suppressInfoWindows: true,
      zIndex: 2,
      afterParse: (doc) => {
        for (let i = 0; i < doc[0].placemarks.length; i += 1) {
          const p = doc[0].placemarks[i];
          clickablePolygon(p);
        }
      },
    });
    countyLayer.parse('/wisconsin_counties.kml');

    // Map Options
    mapObject.set('styles', [{
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    }, {
      featureType: 'administrative.province',
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

    // Country Labels
    MapLabel.prototype.initialize();
    const newLabel = (text, coordinates) => {
      /* eslint-disable no-new */
      new MapLabel({
        text,
        position: new google.maps.LatLng(coordinates[0], coordinates[1]),
        map: mapObject,
        fontSize: 11,
        align: 'center',
        fontFamily: '\'Lato\', sans-serif',
        fontColor: '#ffffff',
        textTransform: 'uppercase',
        strokeWeight: 0,
        strokeColor: 'transparent',
        zIndex: 3,
      });
    };

    newLabel('Adams', [43.973763, -89.767223]);
    newLabel('Ashland', [46.346291, -90.665154]);
    newLabel('Barron', [45.437192, -91.852892]);
    newLabel('Bayfield', [46.434199, -91.257282]);
    newLabel('Brown', [44.473961, -87.995926]);
    newLabel('Buffalo', [44.389759, -91.758714]);
    newLabel('Burnett', [45.865255, -92.367978]);
    newLabel('Calumet', [44.128410, -88.212132]);
    newLabel('Chippewa', [45.069092, -91.283505]);
    newLabel('Clark', [44.733596, -90.610201]);
    newLabel('Columbia', [43.471882, -89.330472]);
    newLabel('Crawford', [43.249910, -90.951230]);
    newLabel('Dane', [43.067468, -89.417852]);
    newLabel('Dodge', [43.472706, -88.704379]);
    newLabel('Door', [45.067808, -87.087936]);
    newLabel('Douglas', [46.463316, -91.892580]);
    newLabel('Dunn', [44.947741, -91.897720]);
    newLabel('Eau Claire', [44.726355, -91.286414]);
    newLabel('Florence', [45.849646, -88.400322]);
    newLabel('Fond Du Lac', [43.754722, -88.493284]);
    newLabel('Forest', [45.666882, -88.773225]);
    newLabel('Grant', [42.870062, -90.695368]);
    newLabel('Green', [42.697728, -89.605639]);
    newLabel('Green Lake', [43.871410, -88.987228]);
    newLabel('Iowa', [43.001021, -90.133692]);
    newLabel('Iron', [46.326550, -90.261299]);
    newLabel('Jackson', [44.324895, -90.806541]);
    newLabel('Jefferson', [43.073807, -88.773986]);
    newLabel('Juneau', [43.902836, -90.113984]);
    newLabel('Kenosha', [42.579703, -87.424898]);
    newLabel('Kewaunee', [44.500949, -87.291813]);
    newLabel('La Crosse', [43.908222, -91.111758]);
    newLabel('Lafayette', [42.655578, -90.130292]);
    newLabel('Langlade', [45.259204, -89.068190]);
    newLabel('Lincoln', [45.338319, -89.742082]);
    newLabel('Manitowoc', [44.105108, -87.413828]);
    newLabel('Marathon', [44.898036, -89.757823]);
    newLabel('Marinette', [45.346899, -87.991198]);
    newLabel('Marquette', [43.776053, -89.409095]);
    newLabel('Menominee', [44.991304, -88.669251]);
    newLabel('Milwaukee', [43.017655, -87.481575]);
    newLabel('Monroe', [43.945175, -90.619969]);
    newLabel('Oconto', [44.926575, -88.006516]);
    newLabel('Oneida', [45.713791, -89.536693]);
    newLabel('Outagamie', [44.388226, -88.464988]);
    newLabel('Ozaukee', [43.360715, -87.496553]);
    newLabel('Pepin', [44.660436, -91.834890]);
    newLabel('Pierce', [44.725337, -92.426279]);
    newLabel('Polk', [45.468030, -92.453154]);
    newLabel('Portage', [44.476246, -89.498070]);
    newLabel('Price', [45.679072, -90.359650]);
    newLabel('Racine', [42.754075, -87.414676]);
    newLabel('Richland', [43.376199, -90.435693]);
    newLabel('Rock', [42.669931, -89.075119]);
    newLabel('Rusk', [45.472734, -91.136745]);
    newLabel('Saint Croix', [45.028959, -92.447284]);
    newLabel('Sauk', [43.427998, -89.943329]);
    newLabel('Sawyer', [45.864913, -91.147130]);
    newLabel('Shawano', [44.789641, -88.755813]);
    newLabel('Sheboygan', [43.746002, -87.60546]);
    newLabel('Taylor', [45.211656, -90.504853]);
    newLabel('Trempealeau', [44.253050, -91.358867]);
    newLabel('Vernon', [43.599858, -90.815226]);
    newLabel('Vilas', [46.049848, -89.501254]);
    newLabel('Walworth', [42.668110, -88.541731]);
    newLabel('Washburn', [45.892463, -91.796423]);
    newLabel('Washington', [43.371156, -88.232917]);
    newLabel('Waukesha', [42.963807, -88.306707]);
    newLabel('Waupaca', [44.478004, -88.967006]);
    newLabel('Waushara', [44.122825, -89.239752]);
    newLabel('Winnebago', [44.055707, -88.668149]);
    newLabel('Wood', [44.461413, -90.038825]);
    // vertical: up is up / horizontal: up is left (sans negative)

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
        google.maps.event.addListener(marker, 'click', displayLabel);

        // Hide Label
        // google.maps.event.addListener(marker, 'mouseout', hideLabel);

        // Add to Global Marker Array
        mapMarkers.push(marker);
        marker.setVisible(false); // maps API hide call

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
        position: new google.maps.LatLng(),
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

    // Set the Map Style
    (() => {
      if (mapObject.getZoom() < 10) mapStyle(mapObject, mapMarkers, 'county');
      else mapStyle(mapObject, mapMarkers, 'default');
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
    // Clear any infowindows
    hideLabel();

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

    // Hide any open results
    Providers.active.set(undefined);

    hideLabel();
    fullMap(true, providerSection);
  },

  'click .seeAllProviders': (event) => {
    event.stopPropagation();
    event.preventDefault();

    // Clear any infowindows
    hideLabel();

    const providerSection = event.target.parentElement
      .parentElement.parentElement.parentElement;

    providerSection.classList.remove('full-view');
    document.body.classList.add('providersListOpen');
  },

  // Clicking ZIP Code GO button
  'click #zipCodeSearch + .submit': (event) => {
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
  'keyup #zipCodeSearch': (event) => {
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
  mapObject.setZoom(11);
};

Template.providerListViewItem.events({
  'click div.pad': followProviderLink,
});

// TODO: Reuse from providers event
Template.providersList.events({
  'click .fullMap': (event) => {
    event.stopPropagation();
    event.preventDefault();

    const providerSection = event.target.parentElement
      .parentElement.parentElement.parentElement;

    document.body.classList.remove('providersListOpen');
    providerSection.classList.add('full-view');

    google.maps.event.trigger(mapObject, 'resize');

    // Hide any open results
    Providers.active.set(undefined);

    hideLabel();
    fullMap(true, providerSection);
  },
});
