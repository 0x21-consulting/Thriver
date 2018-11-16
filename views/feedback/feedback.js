import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Feedback from '/logic/feedback/schema';

import './feedback.html';

// Subscribe to feedback
Meteor.subscribe('feedback');

Template.feedback.events({
  /**
   * @summary Show form
   * @method
   */
  'click #showFeedbackForm': () => {
    document.querySelector('#feedback').classList.remove('hide');
  },

  /**
   * @summary Pick an element on the page
   * @method
   *   @param {$.Event} event
   */
  'click #selectElement': (event) => {
    /**
     * @summary Handle hover effect
     * @method
     *   @param {Event} thisEvent
     */
    const hover = (thisEvent) => {
      thisEvent.preventDefault();
      thisEvent.stopPropagation();

      thisEvent.target.classList.add('feedbackHover');
    };

    /**
     * @summary Handle unhover effect
     * @method
     *   @param {Event} thisEvent
     */
    const unhover = (thisEvent) => {
      thisEvent.preventDefault();
      thisEvent.stopPropagation();

      thisEvent.target.classList.remove('feedbackHover');
    };

    /**
     * @summary Handle element selection
     * @method
     *   @param {Event} event
     */
    const click = (thisEvent) => {
      // If a user initiated this click
      if (thisEvent.isTrusted) {
        thisEvent.preventDefault();
        thisEvent.stopPropagation();

        document.body.removeEventListener('mouseover', hover);
        document.body.removeEventListener('mouseout', unhover);
        document.body.removeEventListener('click', click);

        // Build path
        let path = '';
        for (let i = thisEvent.path.length - 1; i >= 0; i -= 1) {
          // Exclude unhelpful nodes
          switch (thisEvent.path[i].tagName) {
            case 'undefined':
            case undefined:
            case 'HTML':
            case 'SHADOW':
              break;

            default:
              // Add this node
              path += thisEvent.path[i].tagName.toLowerCase();

              // Add ID
              if (thisEvent.path[i].id) path += `#${thisEvent.path[i].id}`;

              // Add any classes
              if (thisEvent.path[i].classList) {
                path += `.${thisEvent.path[i].classList.value.replace(/ /g, '.')}`;
              }

              // Add next node indicator
              if (i) path += ' > ';
          }
        }

        // Add path to element for form submission
        const parent = event.target;
        parent.dataset.element = path.replace('.feedbackHover', '');

        // Remove any hover state
        document.querySelectorAll('.feedbackHover').forEach(element => element
          .classList.remove('feedbackHover'));
      }
    };

    // Assign events
    document.body.addEventListener('mouseover', hover);
    document.body.addEventListener('mouseout', unhover);
    document.body.addEventListener('click', click);
  },

  /**
   * @summary Submit feedback
   * @method
   *   @param {$.Event} event
   */
  'submit #feedback': (event) => {
    event.preventDefault();

    const form = event.target;

    Meteor.call(
      'addFeedback',
      form.querySelector('#selectElement').dataset.element,
      form.querySelector('textarea').value,
      (error) => {
        if (error) {
          throw new Meteor.Error(error);
        }

        // Reset form
        form.reset();
        form.querySelector('#selectElement').dataset.element = 'No element selected';
        form.classList.add('hide');
      },
    );
  },

  /**
   * @summary Close feedback form
   * @method
   *   @param {$.Event} event
   */
  'click #feedback button.close': (event) => {
    event.preventDefault();

    // Hide form and show button
    document.querySelector('#feedback').classList.add('hide');
  },
});

Template.feedbackAdmin.helpers({
  /**
   * @summary Return all feedback items
   * @function
   * @returns {Mongo.Collection}
   */
  feedbackItem: () => Feedback.collection.find(),

  /**
   * @summary User who reported feedback
   * @function
   * @returns {string}
   */
  reporter: () => {
    const data = Template.currentData();

    // TODO(micchickenburger): Display useful name
    return data.userId;
  },
});

Template.feedbackAdmin.events({
  /**
   * @summary Close feedback
   * @method
   */
  'click button.close': () => document.querySelector('#feedbackAdmin').classList.add('hide'),
});

Template.admin.events({
  /**
   * @summary Show feedback
   * @method
   */
  'click #viewFeedback': () => document.querySelector('#feedbackAdmin')
    .classList.remove('hide'),
});
