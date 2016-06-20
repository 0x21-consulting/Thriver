/**
 * @summary Get section details
 * @function
 *   @param {String}   id - The ID of a section whose details to get;
 *       returns all page sections by default
 *   @param {String[]} fields - Fields to include
 */
Thriver.sections.get = function (id, fields) {
    // Meteor Collection.find options
    var fieldsObj = {
        fields: {},
        sort: { order: 1 }
    },
    
    // other variables
    i, j, tabs;
    
    // id must either be a String or undefined
    check( id, Match.Maybe(String) );
    
    // Fields must be an array of fields to include
    check( fields, Match.Maybe([String]) );
    
    // Prepare fields projection filter
    if (fields instanceof Array && fields.length > 0)
        for (i = 0, j = fields.length; i < j; ++i)
            fieldsObj.fields[ fields[i] ] = true;
    
    if (id) {
        //tabs = Thriver.sections.collection.findOne({ _id: id }, { tabs: true });
        //tabs = tabs.tabs;
        //if (tabs)
        //    return Thriver.sections.collection.find({ _id: { $in: tabs }}, fieldsObj);
        tabs = Thriver.sections.collection.findOne({ _id: id }, fieldsObj);
        
        return tabs;
    } else
    
    // Return all page sections
    return Thriver.sections.collection.find({ }, fieldsObj);
    //return Thriver.sections.collection.find({ displayOnPage: true }, fieldsObj);
};
