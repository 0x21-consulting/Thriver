import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Sections from './sections';

/**
 * @summary Subscribe to Sections collection
 */
Meteor.subscribe('sections');

Template.canvas.helpers({
  /**
   * @summary Display page sections in body
   * @function
   */
  sections: () => Sections.get(),
  sectionsExist: () => !!Sections.get().count(),
});

Template.registerHelper('anchor', Sections.generateId);
