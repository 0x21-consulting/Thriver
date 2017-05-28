// Publish Learning Center items
Meteor.publish('infosheets', () =>
  Thriver.learningCenter.collection.find({ type: 'infosheet' }, { sort: { date: 1 } }));
Meteor.publish('webinars', () =>
  Thriver.learningCenter.collection.find({ type: 'webinar' }, { sort: { date: 1 } }));

Meteor.methods({
  /**
   * @summary Add Learning Center Item
   * @method
   *   @param {Object} item - Item to add
   */
  addLearningCenterItem: (item) => {
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
    Thriver.learningCenter.collection.insert(item, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Delete Learning Center Item
   * @method
   *   @param {String} id - ID of item to delete
   */
  deleteLearningCenterItem: (id) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(id, String);

    // Perform deletion
    Thriver.learningCenter.collection.remove({ _id: id }, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },
});
