/**
 * @summary Publish Sections data from Mongo sections collection
 * @function
 *   @param {String} id - ID of section to get children sections
 */
Meteor.publish('sections', function (id) {
    var tabs;
    
    // id must be either a String or undefined
    check(id, Match.Maybe(String));
    
    if (id)
        return Thriver.sections.get(id);
    
    // Otherwise return all sections
    return Thriver.sections.get();
});
