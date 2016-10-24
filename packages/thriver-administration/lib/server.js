Meteor.methods({
  // Return whether or not the logged-in user is an administrator
  isAdmin: () => !!Meteor.user() && !!Meteor.user().admin,

  /**
   * Determine last login for user.  Returns right now if not logged in.
   * @function
   * @returns {Date}
   */
  lastLogin: () => {
    if (Meteor.user() && Meteor.user().status && Meteor.user().status.lastLogin) {
      return Meteor.user().status.lastLogin.date;
    }

    return new Date();
  },

  /**
   * Add new Action Alert
   * @method
   *   @param {string} title   - Action alert title
   *   @param {Date}   date    - Datetime object instance
   *   @param {string} content - Action alert content
   */
  addActionAlert: (title, date, content) => {
    check(title, String);
    check(date, Date);
    check(content, String);

    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) {
      throw new Meteor.error('not-authorized');
    }

    // Generate URL for action alert
    const generateHref = () =>
      // Spaces become hyphens, no numbers or other characters,
      // lowercase, and only up to eight words
      `/action-alert/${title.toLowerCase()
        .replace(/[^a-z\s]/g, '').trim().split(/\s/)
        .join('-')
        .replace(/^((?:.+?-){7}.+?)-.+/, '$1')}/`;

    // Add action alert to db
    Thriver.newsroom.collection.insert({
      title,
      url: generateHref,
      date,
      type: 'actionAlert',
      content,
    });
  },
});
