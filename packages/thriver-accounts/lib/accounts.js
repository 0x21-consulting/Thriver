/**
 * @summary Set mail environmental settings
 * @example smtp://username:password@example.com:587
 */
Meteor.startup( () => {
    console.log(Thriver.settings.collection.find().fetch());
    let url = 'smtp://' +
        encodeURIComponent(Thriver.settings.get('mail').username) + ':' +
                           Thriver.settings.get('mail').password +
        '@' +              Thriver.settings.get('mail').host      +
        ':' +              Thriver.settings.get('mail').port;
    console.log('url:', url);
    process.env.MAIL_URL = url;
});

/**
 * The Organizations collection
 */
Organizations = new Mongo.Collection('organizations');

Meteor.methods({
    /**
     * Handle sending email verification email
     * @method
     *   @param {String} id - Meteor user ID
     */
    sendVerificationEmail: function (id) {
        check(id, String);
        
        // Send email
        Accounts.sendVerificationEmail(id);
    },
    /**
     * Assign organizational association
     * @description
     *   A user's organizational association is determined by
     *   their email domain.  Therefore, only once a user has
     *   established an account and verified their email address
     *   will the association be established.
     * @method
     *   @param {string}   id       - The user's Meteor ID
     *   @param {Function} callback
     */
    assignOrganization: function (id, callback) {
        check(id, String);
        check(callback, Function);
        
        // Get user based on verification token
        var matches, user = Meteor.users.find({ '_id': id }, { 
            // Only get user id and emails array
            'emails': 1 }).fetch();
        
        // Validate user
        user = user[0]; // break out of array
        if (!user || !(user.emails instanceof Array) )
            return;
        
        // Get organization based on user's email domain
        matches = Organizations.find({
            domain: user.emails[0].address.replace(/.+@(.+)/, '$1')
        }).fetch();
        
        // If there's a match, associate
        if (matches instanceof Array)
            if (matches[0]._id)
                Meteor.users.update({ _id: user._id }, { 
                    $set : { organization: matches[0]._id }});
        
        // Otherwise do nothing
        
        // Execute callback
        if (callback instanceof Function)
            callback();
    },
    /**
     * Return the name of the user's designated organization association
     * @function
     * @returns {string}
     */
    getOrganization: function () {
        // Nothing to do if no user is logged in, or if they
        // don't have a designated organization
        if (!Meteor.user() || !Meteor.user().organization)
            return '';
            
        var organization = Organizations.find({ _id: Meteor.user().organization }).fetch();
        
        organization = organization[0]; // break out of array
        
        if (organization && organization.name)
            return organization.name;
        
        // User has an organization but it's not found in the database
        return '';
    }
});

/**
 * Email Template details
 */
Accounts.emailTemplates.siteName = 'WCASA';
Accounts.emailTemplates.from     = 'WCASA <noreply@wcasa.org>';

/**
 * Verify Email details
 */
Accounts.emailTemplates.verifyEmail.subject = function (user) {
    check(user, Object);

    return 'Verify your email address for WCASA';
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
    check(user, Object);
    check(url, String);

    return 'Hello ' + user.profile.firstname + '!\n\n' +
        'To verify your account email, simply click the link below.\n\n' + 
        url + '\n\n' + 'If you weren\'t expecting this email, simply delete it.\n\n' + 
        'Thanks!\n\nAll of us at WCASA';
};
