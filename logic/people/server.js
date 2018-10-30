import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import People from './schema';

// Structure
//   _id         {int}      auto_incr
//   name        {string}
//   title       {string}
//   email       {string}
//   boardMember {boolean}
//   picture     {string}   base64 representation of jpeg

// Publish people
Meteor.publish('people', () => People.collection.find({}));

Meteor.methods({
  /**
   * @summary Add New Person
   * @method
   *   @param {Object} person - Person to add
   */
  addPerson: (person) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(person, Object);

    People.collection.insert(person, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Delete a person
   * @method
   *   @param {String|Object} id - ID of person to delete
   */
  deletePerson: (id) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(id, Match.OneOf(String, Object));

    People.collection.remove({ _id: id }, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },
});
