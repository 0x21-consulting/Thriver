Template.feedback.events({
  /**
   * @summary Show form
   * @method
   */
  'click #showFeedbackForm': () => {
    document.querySelector('#feedback').classList.remove('hide');
    document.querySelector('#showFeedbackForm').classList.add('hide');
  },

  /**
   * @summary Pick an element on the page
   * @method
   *   @param {$.Event} parentEvent
   */
  'click #selectElement': (parentEvent) => {
    /**
     * @summary Handle hover effect
     * @method
     *   @param {Event} event
     */
    const hover = (event) => {
      check(event, Event);

      event.preventDefault();
      event.stopPropagation();

      event.target.classList.add('feedbackHover');
    };

    /**
     * @summary Handle unhover effect
     * @method
     *   @param {Event} event
     */
    const unhover = (event) => {
      check(event, Event);

      event.preventDefault();
      event.stopPropagation();

      event.target.classList.remove('feedbackHover');
    };

    /**
     * @summary Handle element selection
     * @method
     *   @param {Event} event
     */
    const click = (event) => {
      check(event, Event);

      // If a user initiated this click
      if (event.isTrusted) {
        event.preventDefault();
        event.stopPropagation();

        document.body.removeEventListener('mouseover', hover);
        document.body.removeEventListener('mouseout', unhover);
        document.body.removeEventListener('click', click);

        // Build path
        let path = '';
        for (let i = event.path.length - 1; i >= 0; i -= 1) {
          // Exclude unhelpful nodes
          switch (event.path[i].tagName) {
            case 'undefined':
            case undefined:
            case 'HTML':
            case 'SHADOW':
              break;

            default:
              // Add this node
              path += event.path[i].tagName.toLowerCase();

              // Add ID
              if (event.path[i].id) path += `#${event.path[i].id}`;

              // Add any classes
              if (event.path[i].classList) {
                path += `.${event.path[i].classList.value.replace(/ /g, '.')}`;
              }

              // Add next node indicator
              if (i) path += ' > ';
          }
        }

        // Add path to element for form submission
        const parent = parentEvent.target;
        parent.dataset.element = path.replace('.feedbackHover', '');

        // Remove any hover state
        document.querySelectorAll('.feedbackHover').forEach(element =>
          element.classList.remove('feedbackHover'));
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
    check(event, $.Event);
    event.preventDefault();

    const form = event.target;

    Meteor.call('addFeedback', form.querySelector('#selectElement').dataset.element,
      form.querySelector('textarea').value, (error) => {
        if (error) {
          throw new Meteor.Error(error);
        }

        // Reset form
        form.reset();
        form.querySelector('#selectElement').dataset.element = 'No element selected';
        form.classList.add('hide');
        document.querySelector('#showFeedbackForm').classList.remove('hide');
      });
  },

  /**
   * @summary Close feedback form
   * @method
   *   @param {$.Event} event
   */
  'click #feedback button.close': (event) => {
    check(event, $.Event);
    event.preventDefault();

    // Hide form and show button
    document.querySelector('#feedback').classList.add('hide');
    document.querySelector('#showFeedbackForm').classList.remove('hide');
  },
});
