// Subscriptions
Meteor.subscribe('providers');

/**
 * @summary Keep track of active provider
 * @type {ReactiveVar}
 */
Thriver.providers.active = new ReactiveVar(null);

// Counties and other provider data
Template.providers.helpers({
  // All counties (for dropdown list)
  // NOTE: We only want to display counties which have providers,
  //       which is why we aren't using the counties collection here
  counties: () =>
    // NOTE: Meteor's mongo driver still doesn't support
    //   db.collection.distinct(), so we have to hack it
    _.chain(
      Thriver.providers.collection.find({}, { counties: 1 }).map(provider =>
        provider.counties))

    // provider.counties is an array, so we have to flatten them all,
    // then sort them alphabetically, then return distinct ones
    .flatten().sort().uniq()
    .value()
  ,
});

Template.provider.helpers({
  // The current provider
  currentProvider: () =>
    Thriver.providers.active.get(),

  // Current provider's counties served
  providerCounties: data =>
    data.counties.join(', '),

  /**
   * @summary Get all linked offices
   * @function
   *   @param {Object} data
   * @returns {[Object]}
   */
  getOtherOffices: (data) => {
    const parent = Thriver.providers.collection.findOne({ _id: data.parent }, { name: 1 });
    const siblings = Thriver.providers.collection.find(
      { parent: data.parent }, { name: 1 }).map((doc) => {
        if (data._id !== doc._id) return doc;
        return undefined;
      });

    siblings.push(parent);

    // Children, in the case of parents
    Thriver.providers.collection.find({ parent: data._id }).map(doc => siblings.push(doc));

    return siblings;
  },

  /**
   * @summary Return friendly URI
   * @function
   *   @param {String} name
   * @returns {String}
   */
  uri: name => `/service-providers/${Thriver.sections.generateId(name)}`,

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
  provider: () =>
    Thriver.providers.collection.find({}),
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

// From jQuery Helpers File
// TODO: Rewrite
Template.providers.onRendered(() => {
  // Toggle provider list view
  $('.seeAllProviders').click((event) => {
    event.stopPropagation();
    event.preventDefault();

    document.getElementById('service-providers').classList.remove('full-view');
    $('body').addClass('providersListOpen');
  });

  document.addEventListener('mouseup', Thriver.providers.closeMapSearch);
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.providers.onRendered(() => {
  // Get db ID from current instance
  const instanceName = Template.instance().data.name;

  // Register
  Thriver.history.registry.insert({
    element: Thriver.sections.generateId(instanceName),

    /** Handle deep-linking */
    callback: path => path,
  });
});
