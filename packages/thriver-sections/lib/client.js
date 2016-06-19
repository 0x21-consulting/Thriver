/**
 * @summary Subscribe to Sections collection
 */
Meteor.subscribe('sections');

Template.body.helpers({
    /**
     * @summary Display page sections in body
     * @function
     */
    sections: function () {
        return Thriver.sections.get();
    }
});

/**
 * @summary Dynamically-generate anchor href for each section
 * @method
 *   @param {String} name - The section name
 * @returns {String}
 */
Template.registerHelper('anchor', function (name) {
    var removeName;

    // Name must exist and be a string
    check(name, Spacebars.kw);

    // We're expecting to only build anchors for elements that actually have names
    if (!name || !name.hash || !name.hash.name)
        return '';

    // Mutual Suspicion
    name = '' + name.hash.name;

    // Is the name an empty string?
    removeName = !name.length;

    // Make all lower case, then replace spaces with hyphens
    name = name.toLowerCase().trim().replace(/ /g, '-').

    // anchors can't begin with numbers or hyphens
    replace(/^[\d-]*/g, '');

    if (removeName || name.length > 0)
        return name;

    return '';  // otherwise return an empty string
});
