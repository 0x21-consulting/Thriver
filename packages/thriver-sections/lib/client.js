/**
 * @summary Subscribe to Sections collection
 */
Meteor.subscribe('sections');

Template.canvas.helpers({
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
Thriver.sections.generateId = function (name) {
    var removeName;
    
    // Name must exist and be a string
    if (name === null || name === undefined) return '';
    check(name, Match.OneOf(Spacebars.kw, String) );

    // Spacebars.kw looks like: { hash: { name: "elementName" } }
    name = (name instanceof Spacebars.kw) ? name.hash.name : name;

    // Return empty string if null
    if (name === null) return '';

    // Is the name an empty string?
    removeName = !name.length;

    // Make all lower case, then replace spaces with hyphens
    name = name.toLowerCase().trim().replace(/ /g, '-').

    // anchors can't begin with numbers or hyphens
    replace(/^[\d-]*/g, '');

    // TODO: Validate URI doesn't include improper characters?

    if (removeName || name.length > 0)
        return name;

    return '';  // otherwise return an empty string
};
Template.registerHelper('anchor', Thriver.sections.generateId);
