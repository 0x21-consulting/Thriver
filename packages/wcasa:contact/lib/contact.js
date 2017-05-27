Meteor.methods({
  /**
   * @summary Handles Contact form submission
   * @method
   *   @param {string} name
   *   @param {string} email
   *   @param {string} comments
   */
  submitContactForm(name, email, comments) {
    check(name, String);
    check(email, String);
    check(comments, String);

    this.unblock();

    Email.send({
      to: 'micah.henning@wcasa.org',
      from: `${name} <${email}>`,
      subject: 'Comments from Website',
      text: `${name} has submitted comments on the WCASA website:\r\n\r\n${comments}`,
    });
  },
});
