import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

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
      to: 'wcasa@wcasa.org',
      from: 'WCASA Website <website@wcasa.org>',
      replyTo: `${name} <${email}>`,
      subject: `Message from ${name}`,
      text: `${name} (${email}) has submitted a message through the contact form on the WCASA website:\r\n\r\n${comments}`,
    });
  },
});
