import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

/**
 * @summary Thriver Settings
 * @namespace Settings
 */
const Settings = {};

/**
 * @summary Settings collection
 * @type {Collection}
 */
Settings.collection = new Mongo.Collection(null);

/**
 * @summary Get a setting
 * @function
 *   @param {string} setting      - The setting to call
 *   @param {any}    defaultValue - If no setting can be found, returns this value
 * @returns {defaultValue|undefined}
 */
Settings.get = (setting, defaultValue) => Settings.collection.findOne()[setting]
  || defaultValue || undefined;

/**
 * @summary Prefill settings collection
 * @method
 */
Meteor.startup(() => {
  /**
   * @summary Add object key-value pairs to settings collection
   * @method
   *   @param {string} settings - Reference to object to traverse
   */
  const addSettings = (settings) => {
    const keys = Object.keys(settings);
    const values = Object.values(settings);

    if (!(settings instanceof Object)) return;

    keys.forEach((setting, index) => {
      // Set key-value pair
      const pair = {};
      pair[setting] = values[index];

      // Add to collection
      Settings.collection.update({}, { $set: pair });
    });
  };

  // Just one settings record
  Settings.collection.insert({});

  // If there is no Meteor settings object, there's nothing to prefill
  if (!(Meteor.settings instanceof Object)) return;

  // Prefill server settings
  if (Meteor.isServer) addSettings(Meteor.settings);

  // Prefill client settings
  else if (Meteor.settings.public instanceof Object) addSettings(Meteor.settings.public);
});

export default Settings;
