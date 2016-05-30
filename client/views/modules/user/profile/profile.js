// Populate Profile tab under Account Overview
Template.profile.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    },
    organization: function () {
        return organization.get();
    },
    email: function () {
        var user = Meteor.user();
        if (user && user.emails && user.emails[0])
            return user.emails[0].address;
        return '';
    }
});

// Update Profile
Template.profile.events({
    /**
     * Handle submission of Account Settings form under Profile tab
     * @method
     *   @param {$.Event} event - Event passed by form submission
     */
    'submit form': function (event) {
        if (! (event instanceof $.Event))
            return;
        
        // Prevent navigation
        event.preventDefault(); event.stopPropagation();
        
        var name  = event.target[0].value,
            email = event.target[2].value,
            user  = Meteor.user(), i, j;
        
        // Can't do anything if not logged in
        if (!user || !user.profile) return;
        
        // Enforce proper name format by removing excess spaces,
        // making all lower case, then capitalizing just the first character
        name = name.trim().replace(/\s+/g, ' ').toLowerCase().split(/\s/);
        for (i = 0, j = name.length; i < j; ++i)
            name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
        name = name.join(' ');
        
        // Compare with db
        if (name !== ( user.profile.firstname + ' ' + user.profile.lastname )) {
            // Update profile (clients are allowed profile changes)
            Meteor.users.update({
                _id: Meteor.userId(),
            }, { $set: { 
                'profile.firstname': name.replace(/^(.+)\s.+/, '$1'),
                'profile.lastname' : name.replace(/^.+\s(.+)/, '$1')
            }});
        }
        
    }
});