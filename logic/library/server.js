import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
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

  /**
   * @summary Request an item from the library
   * @method
   * @param {String} id - ID of the item to request
   */
  requestLibraryItem(id) {
    check(id, String);

    const item = Library.collection.findOne({ _id: id });
    const user = Meteor.users.findOne({ _id: this.userId });

    // For now just send an email
    Email.send({
      from: 'WCASA <website@wcasa.org>',
      to: 'Peter Fiala <peterf@wcasa.org>',
      subject: 'Library Request',
      text:
`Hello Peter,

There has been a request for a library item.

Item details:
Title:  ${item.title}
Classification:  ${item.classification}
Material:  ${item.material}
Keywords:  ${item.keywords}
Copies:  ${item.copies}

Requestor details:
Name:  ${user.profile.firstname} ${user.profile.lastname}
Email:  ${user.emails[0].address}
Phone:  ${user.profile.telephone}
Address:
  ${user.profile.address1}
  ${user.profile.address2 ? user.profile.address2 : ''}
  ${user.profile.city}, ${user.profile.state}  ${user.profile.zip}

Cheers,

The Website
`,
    });
  },
});
