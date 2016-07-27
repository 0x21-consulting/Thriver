/**
 * @summary Thriver Settings
 * @namespace Thriver.settings
 */
Thriver.settings = {};

/**
 * @summary Settings collection
 * @type {Collection}
 */
Thriver.settings.collection = new Mongo.Collection(null);

/**
 * @summary Get a setting
 * @function
 *   @param {string} setting      - The setting to call
 *   @param {any}    defaultValue - If no setting can be found, returns this value
 * @returns {defaultValue|undefined}
 */
Thriver.settings.get = function (setting, defaultValue) {
    return Thriver.settings.collection.findOne()[setting] || defaultValue || undefined;
};

/**
 * @summary Prefill settings collection
 * @method
 */
Meteor.startup(function () {
    /**
     * @summary Add object key-value pairs to settings collection
     * @method
     *   @param {string} settings - Reference to object to traverse
     */
    var addSettings = function (settings) {
        var setting, pair;
        
        if (! (settings instanceof Object) )
            return;
        
        for (setting in settings) {
            // Set key-value pair
            pair = {};
            pair[setting] = settings[setting];
            
            // Add to collection
            Thriver.settings.collection.update({}, { $set: pair });
        }
    };
    
    // Just one settings record
    Thriver.settings.collection.insert({});
    
    // If there is no Meteor settings object, there's nothing to prefill
    if (! (Meteor.settings instanceof Object) )
        return;
    
    // Prefill server settings
    if (Meteor.isServer)
        addSettings(Meteor.settings);
    
    // Prefill client settings
    else if (Meteor.settings.public instanceof Object) 
        addSettings(Meteor.settings.public);
});
