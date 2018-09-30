import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import Sections from '/logic/sections/sections';

Meteor.methods({
  /**
   * @summary Add an Opportunity
   * @method
   *   @param {String}   id           - MonboDB ID of section to update
   *   @param {Object[]} opportunity  - Opportunity to add
   */
  addOpportunity: (id, opportunity) => {
    // Check Authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Check parameters
    check(id, String);
    check(opportunity, Object);
    check(opportunity.title, String);
    check(opportunity.content, String);

    // First, ensure the opportunities array already exists
    const { data } = Sections.get(id, ['data']);

    const opp = opportunity;

    // Create array if necessary
    if (!(data.opportunities instanceof Array)) data.opportunities = [];

    // Generate a random ID
    opp.id = Random.id();

    // Add to array
    data.opportunities.push(opp);

    // Now update document
    Sections.collection.update({ _id: id }, { $set: { data } });
  },

  /**
   * @summary Delete an Opportunity
   * @method
   *   @param {String} parentID      - ID of Parent element from which to remove opportunity
   *   @param {String} opportunityID - ID of opportunity to remove
   */
  deleteOpportunity: (parentID, opportunityID) => {
    // Check Authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Check parameters
    check(parentID, String);
    check(opportunityID, String);

    // Remove opportunity
    Sections.collection.update({ _id: parentID }, {
      $pull: {
        'data.opportunities': {
          id: opportunityID,
        },
      },
    });
  },

  /**
   * @summary Update an Opportunity's content
   * @method
   *   @param {String} parentID      - ID of parent
   *   @param {String} opportunityID - ID of opportunity
   *   @param {String} content       - New content
   */
  updateOpportunityContent: (parentID, opportunityID, content) => {
    // Check Authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Check parameters
    check(parentID, String);
    check(opportunityID, String);
    check(content, String);

    // Get parent's data data
    const data = Sections.get(parentID, ['data']).data.opportunities;

    // Find and remove opportunity from data array
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === opportunityID) data[i].content = content;
    }

    // Update opportunity
    Sections.collection.update({ _id: parentID }, {
      $set: {
        'data.opportunities': data,
      },
    });
  },

  /**
   * @summary Update an Opportunity's name
   * @method
   *   @param {String} parentID      - ID of parent
   *   @param {String} opportunityID - ID of opportunity
   *   @param {String} name          - New name
   */
  updateOpportunityName: (parentID, opportunityID, name) => {
    // Check Authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.Error('not-authorized');
    }

    // Check parameters
    check(parentID, String);
    check(opportunityID, String);
    check(name, String);

    // Get parent's data data
    const data = Sections.get(parentID, ['data']).data.opportunities;

    // Find and remove opportunity from data array
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === opportunityID) data[i].title = name;
    }

    // Update opportunity
    Sections.collection.update({ _id: parentID }, {
      $set: {
        'data.opportunities': data,
      },
    });
  },
});
