/**
 * @summary Events namespace
 * @type {Object}
 */
Thriver.events = {};

/**
 * @summary Events collection
 * @type {Mongo.Collection}
 */
Thriver.events.collection = new Mongo.Collection('events');

/**
 * @summary Events schema
 * @type {SimpleSchema}
 */
Thriver.events.schema = new SimpleSchema({
  /** ID */
  _id: {
    type: String,
    optional: true, // ID is autogenerated
    autoform: {
      type: 'hidden',
    },
  },
  /** Event Name */
  name: {
    type: String,
    optional: false,
  },
  /** Event description */
  description: {
    type: String,
    optional: false,
    autoform: {
      rows: 5,
    },
  },
  /** Starting datetime */
  start: {
    type: Date,
    optional: false,
    // Default to today
    defaultValue: new Date(new Date().toDateString()),
    autoform: {
      type: 'datetime-local',
    },
  },
  /** Ending datetime */
  end: {
    type: Date,
    optional: true,
    autoform: {
      type: 'datetime-local',
    },
  },
  /** Lat/Lon Coordinates for Physical locations */
  location: {
    type: Object,
    optional: false,
    defaultValue: {},
    label: 'Event Location',
  },
  'location.name': {
    type: String,
    optional: false,
    label: 'Location Name',
  },
  'location.latitude': {
    type: Number,
    decimal: true,
    optional: true,
  },
  'location.longitude': {
    type: Number,
    decimal: true,
    optional: true,
  },
  'location.mapUrl': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    label: 'Google Maps URL',
  },
  'location.webinarUrl': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    label: 'Webinar URL',
  },
  /** Cost Tiers */
  cost: {
    type: Array,
    defaultValue: [],
    optional: false,
    label: 'Price Tiers',
  },
  'cost.$': {
    type: Object,
  },
  'cost.$.description': {
    type: String,
    optional: false,
    label: 'Tier Description',
  },
  'cost.$.cost': {
    type: Number,
    decimal: true,
    optional: false,
    defaultValue: 0,
    label: 'Cost in Dollars',
  },
  /** Event HREF for Online Locations */
  registerUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    label: 'URL for Third-Party Registration Site',
  },

  /** Special Event Fields for Registration */
  registrationDetails: {
    type: Array,
    defaultValue: [],
    optional: false,
    label: 'Add fields for registration details',
  },
  'registrationDetails.$': {
    type: Object,
  },
  /** Name of field */
  'registrationDetails.$.name': {
    type: 'String',
    optional: false,
    label: 'Field Name',
  },
  /** Type of Field */
  'registrationDetails.$.type': {
    type: 'String',
    optional: false,
    allowedValues: [
      'text', 'email', 'yes/no', 'date', 'color', 'textarea',
    ],
    defaultValue: 'text',
  },
});
Thriver.events.collection.attachSchema(Thriver.events.schema);
