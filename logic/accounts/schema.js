import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

/**
 * @summary Notifications namespace
 */
const Notifications = {};

/**
 * @summary Notifications collection
 * @type {Mongo.Collection}
 */
Notifications.collection = new Mongo.Collection('notifications');

/**
 * @summary Profile namespace
 */
const Accounts = {};

/**
 * @summary Accounts Schema
 * @type {Object}
 */
Accounts.schema = {};

/**
 * @summary Subscriptions Schema
 * @type {SimpleSchema}
 */
Accounts.schema.subscriptions = new SimpleSchema({
  /** Newsletters */
  pressReleases: {
    type: Boolean,
    defaultValue: true,
    optional: false,
  },
  actionAlerts: {
    type: Boolean,
    defaultValue: true,
    optional: false,
  },
  newsletter: {
    type: Boolean,
    defaultValue: true,
    optional: false,
  },
  /** Listservs */
  expertWitness: {
    type: Boolean,
    defaultValue: false,
    optional: false,
  },
  campusSA: {
    type: Boolean,
    defaultValue: false,
    optional: false,
  },
  saAdvocates: {
    type: Boolean,
    defaultValue: false,
    optional: false,
  },
  saTaskForce: {
    type: Boolean,
    defaultValue: false,
    optional: false,
  },
  saPrevention: {
    type: Boolean,
    defaultValue: false,
    optional: false,
  },
});

/**
 * @summary Profile Schema
 * @type {SimpleSchema}
 */
Accounts.schema.profile = new SimpleSchema({
  /** Personal Details */
  firstname: {
    type: String,
    optional: false,
    label: 'First Name',
  },
  lastname: {
    type: String,
    optional: false,
    label: 'Last Name',
  },
  title: {
    type: String,
    optional: true,
    label: 'Job Title',
  },
  address1: {
    type: String,
    optional: true,
    label: 'Address',
  },
  address2: {
    type: String,
    optional: true,
    label: ' ',
  },
  city: {
    type: String,
    optional: true,
  },
  state: {
    type: String,
    allowedValues: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MS',
      'MO', 'MT', 'NE', 'NH', 'NV', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR',
      'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
      'AS', 'DC', 'GU', 'MP', 'PR', 'VI'],
    optional: true,
  },
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
    optional: false,
    label: 'ZIP Code',
  },
  telephone: {
    type: String,
    regEx: /(\+\s*?\d{1,3}\s*?)?[()-\d\s]{10,}/,
    optional: true,
  },

  /** Event Considerations */
  events: {
    type: Object,
    optional: false,
    defaultValue: {},
  },

  /** Dietary Restrictions */
  'events.diet': {
    type: Object,
    optional: false,
    defaultValue: {},
    label: 'I am a:',
  },
  /** Other restrictions */
  'events.diet.glutenFree': {
    type: Boolean,
    optional: true,
  },
  'events.diet.lactose': {
    type: Boolean,
    optional: true,
    label: 'Lactose Intollerant',
  },
  'events.diet.ovo': {
    type: Boolean,
    optional: true,
  },
  'events.diet.lacto': {
    type: Boolean,
    optional: true,
  },
  'events.diet.arian': {
    type: String,
    optional: true,
    allowedValues: ['Vegan', 'Vegetarian', 'Pescetarian'],
    label: ' ',
  },

  /** Allergens */
  'events.diet.allergies': {
    type: Object,
    optional: false,
    defaultValue: {},
    label: 'Food Allergies',
  },
  'events.diet.allergies.peanut': {
    type: Boolean,
    optional: true,
  },
  'events.diet.allergies.milk': {
    type: Boolean,
    optional: true,
  },
  'events.diet.allergies.egg': {
    type: Boolean,
    optional: true,
  },
  'events.diet.allergies.wheat': {
    type: Boolean,
    optional: true,
  },
  'events.diet.allergies.soy': {
    type: Boolean,
    optional: true,
  },
  'events.diet.allergies.fish': {
    type: Boolean,
    optional: true,
  },
  'events.diet.allergies.shellfish': {
    type: Boolean,
    optional: true,
  },

  /** Event requests or accommodations */
  'events.accommodations': {
    type: String,
    optional: true,
    label: 'Please list any accommodations requested for events you attend',
  },

  /** Emergency Contact */
  'events.emergencyName': {
    type: String,
    optional: true,
    label: 'Emergency Contact Name',
  },
  'events.emergencyRelationship': {
    type: String,
    allowedValues: ['Parent', 'Child', 'Sibling', 'Partner', 'Relative', 'Other'],
    optional: true,
    label: 'Emergency Contact Relation',
  },
  'events.emergencyTelephone': {
    type: String,
    regEx: /(\+\s*?\d{1,3}\s*?)?[()-\d\s]{10,}/,
    optional: true,
    label: 'Emergency Contact Number',
  },

  /** Registered Events */
  'events.registeredEvents': {
    type: Array,
    defaultValue: [],
    optional: false,
  },
  'events.registeredEvents.$': {
    type: Object,
  },
  'events.registeredEvents.$.id': {
    type: String,
    optional: false,
  },
  // an Events object could have any number of optional fields
  'events.registeredEvents.$.details': {
    type: Object,
    optional: true,
    blackbox: true,
  },

  /** Subscriptions */
  subscriptions: {
    type: Accounts.schema.subscriptions,
    optional: false,
  },

  /** Online */
  online: {
    type: Boolean,
    optional: true,
  },
});

/**
 * @summary User Schema
 * @type {SimpleSchema}
 */
Accounts.schema.user = new SimpleSchema({
  /** ID */
  _id: {
    type: String,
    optional: true, // autogenerated
  },
  /** Email addresses, used as account username */
  emails: {
    type: Array,
    optional: false,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },

  /** Services */
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },

  /** Roles */
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
  },

  /** Meta */
  heartbeat: {
    type: Date,
    optional: true,
  },
  createdAt: {
    type: Date,
  },

  /** User Status */
  status: {
    type: Object,
    optional: true,
    blackbox: true,
  },

  /** Profile */
  profile: {
    type: Accounts.schema.profile,
    optional: false,
  },

  /** Organization to which a user belongs */
  organization: {
    type: Mongo.ObjectID,
    optional: true,
  },

  /** Whether or not the user is an administrator */
  admin: {
    type: Boolean,
    optional: true,
  },

  /** Payment history */
  payments: {
    type: Array,
    defaultValue: [],
  },
  'payments.$': {
    type: Object,
    blackbox: true,
    optional: true,
  },
  stripeId: {
    type: String,
    optional: true,
  },
});

// Attach schema to users collection
Meteor.users.attachSchema(Accounts.schema.user);

// Indexes
if (Meteor.isServer) {
  Meteor.users.rawCollection().createIndex({ 'payments.description': 1 });
  Meteor.users.rawCollection().createIndex({ 'payments.metadata.event_id': 1 });
}

export { Notifications, Accounts };
