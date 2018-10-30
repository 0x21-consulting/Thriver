import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Providers from './schema';

// Structure
//   _id                 {string}    auto_incr
//   Name                {string}
//   Counties served     {string[]}
//   Address             {string}
//   Coordinates for map {float[]}
//   Phone number        {string}
//   Crisis number       {string}
//   Email address       {string}
//   Website URL         {string}
//   Facebook URL        {string}
//   Twitter URL         {string}

// Publish providers
Meteor.publish('providers', () => Providers.collection.find({}));

// Publish County ZIP codes
Meteor.publish('counties', () => Providers.counties.find({}));

Meteor.methods({
  /**
   * @summary Insert new Provider into database
   * @method
   *   @param {Object} provider - Provider to add
   */
  addProvider: (provider) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) throw new Meteor.Error('not-authorized');

    // Parameter checks
    check(provider, Object);

    const newProvider = provider;

    // Perform Insert
    Providers.collection.insert(newProvider, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Delete a provider
   * @method
   *   @param {Object} provider - Provider to Delete
   */
  deleteProvider: (provider) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) throw new Meteor.Error('not-authorized');

    // Parameter checks
    check(provider, String);

    // Perform update
    Providers.collection.remove({ _id: provider }, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Update a Provider
   * @method
   *   @param {Object} provicer - Provider to modify
   */
  updateProvider: (provider) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) throw new Meteor.Error('not-authorized');

    // Parameter checks
    check(provider, Object);

    // Perform update
    Providers.collection.update(
      { _id: provider._id },
      { $set: provider },
      (error) => {
        if (error) throw new Meteor.Error(error);
      },
    );
  },
});
