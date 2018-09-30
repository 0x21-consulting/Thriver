import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';
import Providers from '/logic/providers/schema';
import Sections from '/logic/sections/sections';
import History from '/views/history/history';

import './providers.html';
import './admin';

// Import after providers template due to dependency
import map from './maps';

// Subscriptions
Meteor.subscribe('providers');

/**
 * @summary Keep track of active provider
 * @type {ReactiveVar}
 */
Providers.active = new ReactiveVar(null);

/**
 * @summary Keep count of providers at the ready
 * @type {ReactiveVar}
 */
Providers.count = new ReactiveVar(0);

/**
 * @summary Update total count of providers`
 * @method
 */
Providers.collection.find({ parent: null }).observe({
  added: () => {
    Providers.count.set(Providers.count.get() + 1);
  },
});

// Counties and other provider data
Template.providers.helpers({
  // All counties (for dropdown list)
  // NOTE: We only want to display counties which have providers,
  //       which is why we aren't using the counties collection here
  // NOTE: Meteor's mongo driver still doesn't support
  //   db.collection.distinct(), so we have to hack it
  counties: () => _.chain(Providers.collection.find({}, { counties: 1 })
    .map(provider => provider.counties))

    // provider.counties is an array, so we have to flatten them all,
    // then sort them alphabetically, then return distinct ones
    .flatten().sort().uniq()
    .value()
  ,
});

Template.provider.helpers({
  // The current provider
  currentProvider: () => Providers.active.get(),

  // Current provider's counties served
  providerCounties: data => data.counties.join(', '),

  /**
   * @summary Get all linked offices
   * @function
   *   @param {Object} data
   * @returns {[Object]}
   */
  getOtherOffices: (data) => {
    if (data.parent) {
      const parent = Providers.collection.findOne({ _id: data.parent }, { name: 1 });
      const siblings = Providers.collection.find(
        { parent: data.parent },
        { name: 1 },
      ).map((doc) => {
        if (data._id !== doc._id) return doc;
        return undefined;
      });

      siblings.unshift(parent);

      return siblings;
    }

    // Children, in the case of parents
    const children = [];
    Providers.collection.find({ parent: data._id }).map(doc => children.push(doc));

    return children;
  },

  /**
   * @summary Return friendly URI
   * @function
   *   @param {String} name
   * @returns {String}
   */
  uri: name => `/service-providers/${Sections.generateId(name)}`,

  /**
   * @summary Create friendly phone number
   * @function
   *   @param {Number} phoneNumber - Phone number
   * @returns {String}
   */
  friendlyNumber: (phoneNumber) => {
    const num = `${phoneNumber}`;

    // Yes, we're only supporting US/Canada numbers
    if (num.length === 10) return `(${num.substr(0, 3)}) ${num.substr(3, 3)}-${num.substr(6)}`;
    if (num.length === 11) {
      return `+${num.substr(0, 1)} (${num.substr(1, 3)}) ${num.substr(4, 3)}-${num.substr(7)}`;
    }

    return phoneNumber;
  },
});

/**
 * Populate "View All Service Providers"
 * @method
 * @returns {LocalCollection.Cursor}
 */
Template.providersList.helpers({
  provider: () => Providers.collection.find({ parent: null }, { sort: { name: 1 } }),
});

/**
 * Make counties human-readable
 * @method
 * @returns {string}
 */
Template.providerListViewItem.helpers({
  counties: (data) => {
    if (data.counties instanceof Array) return data.counties.join(', ');

    return `${data.counties}`; // coerce into string
  },
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.providers.onRendered(() => {
  // Get db ID from current instance
  const instanceName = Template.instance().data.name;

  // Register
  if (instanceName) {
    History.registry.insert({
      element: Sections.generateId(instanceName),

      /** Handle deep-linking */
      callback: (path) => {
        // If there's no path, there's nothing to do
        if (!path.length) return;

        // Wait for collection and google API to become available
        Tracker.autorun((c) => {
          try {
            // Find provider, if one with this name exists
            Providers.collection.find().forEach((doc) => {
              if (path[0] === Sections.generateId(doc.name)) {
                // Set provider as active
                Providers.active.set(doc);

                // Update map
                map.panTo(new google.maps.LatLng( // eslint-disable-line no-undef
                  doc.coordinates.lat,
                  doc.coordinates.lon,
                ));
                map.setZoom(13);
              }
            });

            c.stop();
          } catch (error) { /* do nothing */ }
        });
      },
    });
  }
});

export default Providers.count;
