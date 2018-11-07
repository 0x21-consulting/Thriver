import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Library from './schema';

// Publish Library Center items
Meteor.publish('library', () => Library.collection
  .find({}, { sort: { title: 1 } }));

Meteor.methods({
  /**
   * @summary Add Library Item
   * @method
   *   @param {Object} item - Item to add
   */
  addLibraryItem: (item) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(item, Object);

    // Perform Insert
    Library.collection.insert(item, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Delete Library Item
   * @method
   *   @param {String} id - ID of item to delete
   */
  deleteLibraryItem: (id) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(id, String);

    // Perform deletion
    Library.collection.remove({ _id: id }, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },
});
