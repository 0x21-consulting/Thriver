Meteor.methods({
    isAdmin: function () {
        // Return whether or not the logged-in user is an administrator
        return Meteor.user() && Meteor.user().admin? true : false;
    },
    
    /**
     * Determine last login for user.  Returns right now if not logged in.
     * @function
     * @returns {Date}
     */
    lastLogin: function () {
        if (Meteor.user() && Meteor.user().status && Meteor.user().status.lastLogin)
            return Meteor.user().status.lastLogin.date;
        
        return new Date();
    },
    
    /**
     * Add new Action Alert
     * @method
     *   @param {string} title   - Action alert title
     *   @param {Date}   date    - Datetime object instance
     *   @param {string} content - Action alert content
     */
    addActionAlert: function (title, date, content) {
        // Check authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.error('not-authorized');
        
        // Mutual suspicion
        title = '' + title;
        content = '' + content;
        if ( !(date instanceof Date) )
            date = new Date();
        
        // Generate URL for action alert
        var href = (function () {
            // Spaces become hyphens, no numbers or other characters,
            // lowercase, and only up to eight words
            return '/action-alert/' + title.toLowerCase().
                replace(/[^a-z\s]/g,'').trim().split(/\s/).join('-').
                replace(/^((?:.+?-){7}.+?)-.+/, '$1') + '/';
        })();
        
        // Add action alert to db
        Newsroom.insert({
            title  : title,
            url    : href,
            date   : date,
            type   : 'actionAlert',
            content: content
        });
    }
});
