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
Meteor.publish('providers', () => Thriver.providers.collection.find({}));

// Publish County ZIP codes
Meteor.publish('counties', () => Thriver.providers.counties.find({}));

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
    Thriver.providers.collection.insert(newProvider, (error) => {
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
    Thriver.providers.collection.remove({ _id: provider }, (error) => {
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
    console.log(provider);
    // Perform update
    Thriver.providers.collection.update({ _id: provider._id }, { $set: provider },
      (error) => {
        if (error) throw new Meteor.Error(error);
      });
  },
});
