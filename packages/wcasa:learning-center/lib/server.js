// Publish Resource Center items
Meteor.publish('infosheets', () =>
  Thriver.resourceCenter.collection.find({ type: 'infosheet' }, { sort: { date: 1 } }));
Meteor.publish('webinars', () =>
  Thriver.resourceCenter.collection.find({ type: 'webinar' }, { sort: { date: 1 } }));

Meteor.methods({
  /**
   * @summary Add Resource Center Item
   * @method
   *   @param {Object} item - Item to add
   */
  addResourceCenterItem: (item) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    const thisItem = item;

    // Parameter checks
    check(item, Object);

    // Enforce UTC
    if (item.date instanceof Date) thisItem.date = new Date(thisItem.date.toISOString());

    // Perform Insert
    Thriver.resourceCenter.collection.insert(item, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Delete Resource Center Item
   * @method
   *   @param {String} id - ID of item to delete
   */
  deleteResourceCenterItem: (id) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(id, String);

    // Perform deletion
    Thriver.resourceCenter.collection.remove({ _id: id }, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },
});
