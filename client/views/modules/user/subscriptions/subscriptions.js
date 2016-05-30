// Subscriptions tab
Template.subscriptions.helpers({
    /**
     * Email Subscription to Press Releases
     */
    pressReleases: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.pressReleases;
        return false;
    },
    /**
     * Email Subscription to Action Alerts
     */
    actionAlerts: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.actionAlerts;
        return false;
    },
    /**
     * Email Subscription to the Newsletter
     */
    newsletter: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.newsletter;
        return false;
    },
    /**
     * Expert Witness Listserv Subscription
     */
    expertWitness: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.expertWitness;
        return false;
    },
    /**
     * SA Prevention Listserv Subscription
     */
    saPrevention: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.saPrevention;
        return false;
    },
    /**
     * Survivors & Allies Task Force Listserv Subscription
     */
    saTaskForce: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.saTaskForce;
        return false;
    },
    /**
     * Sexual Assault Advocates Listserv Subscription
     */
    saAdvocates: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.saAdvocates;
        return false;
    },
    /**
     * Campus Sexual Assault Listserv Subscription
     */
    campusSA: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.campusSA;
        return false;
    }
});
Template.subscriptions.events({
    /**
     * Subscribe to something
     * @method
     *   @param {$.Event} event - Checked event
     */
    'change #subscriptions input[type="checkbox"]': function (event) {
        if (! (event instanceof $.Event) )
            return;
        
        // Get checkbox info
        var checked = event.target.checked, query, xhr;
        
        switch (event.target.id) {
            case 'pressReleasesToggle':
                query = { 'profile.subscriptions.pressReleases': checked? true : false }; break;
            case 'actionAlertsToggle':
                query = { 'profile.subscriptions.actionAlerts':  checked? true : false }; break;
            case 'newsletterToggle':
                query = { 'profile.subscriptions.newsletter':    checked? true : false }; break;
            case 'expertWitnessToggle':
                query = { 'profile.subscriptions.expertWitness': checked? true : false };
                
                // Initial ListServ subscription
                listServSubscribe('expert-witness-wcasa-blog.org', 
                    Meteor.user().emails[0].address, checked? true : false);
                    
                break;
            case 'saPreventionToggle':
                query = { 'profile.subscriptions.saPrevention': checked? true : false };
                
                // Initial ListServ subscription
                listServSubscribe('wi-sa-prevention-wcasa-blog.org', 
                    Meteor.user().emails[0].address, checked? true : false);
                    
                break;
            case 'saTaskForceToggle':
                query = { 'profile.subscriptions.saTaskForce': checked? true : false };
                
                // Initial ListServ subscription
                listServSubscribe('wi-satf-wcasa-blog.org', 
                    Meteor.user().emails[0].address, checked? true : false);
                    
                break;
            case 'saAdvocatesToggle':
                query = { 'profile.subscriptions.saAdvocates': checked? true : false };
                
                // Initial ListServ subscription
                listServSubscribe('wi-sa-advocates-wcasa-blog.org', 
                    Meteor.user().emails[0].address, checked? true : false);
                    
                break;
            case 'campusSAToggle':
                query = { 'profile.subscriptions.campusSA': checked? true : false };
                
                // Initial ListServ subscription
                listServSubscribe('campussa-wcasa-blog.org', 
                    Meteor.user().emails[0].address, checked? true : false);
                    
                break;
            
        }
        
        // Now make the change
        Meteor.users.update({ _id: Meteor.userId() }, { $set: query });
    }
});
