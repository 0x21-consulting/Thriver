/**
 * @summary Get section details
 * @function
 *   @param {String}   id - The ID of a section whose details to get;
 *       returns all page sections by default
 *   @param {String[]} fields - Fields to include
 * @returns {LocalCollection.Cursor | Object | undefined}
 */
Thriver.sections.get = (id, fields) => {
  // id must either be a String or undefined
  check(id, Match.Maybe(String));

  // Fields must be an array of fields to include
  check(fields, Match.Maybe([String]));

  // Meteor Collection.find options
  const fieldsObj = {
    fields: {},
    sort: { order: 1 },
  };

  // Prepare fields projection filter
  if (fields instanceof Array && fields.length > 0) {
    for (let i = 0; i < fields.length; i += 1) {
      fieldsObj.fields[fields[i]] = true;
    }
  }

  if (id) return Thriver.sections.collection.findOne({ _id: id }, fieldsObj);

  // Return all page sections
  return Thriver.sections.collection.find({ displayOnPage: true }, fieldsObj);
};
