Template.feedback.events({
  /**
   * @summary Show form
   * @method
   */
  'click #showFeedbackForm': () => {
    document.querySelector('#feedback').classList.remove('hide');
    document.querySelector('#showFeedbackForm').classList.add('hide');
  },
});
