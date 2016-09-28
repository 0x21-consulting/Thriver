// Populate Profile tab under Account Overview
utilityNavigationHelpers = {
    items: [{
        //Notifications
        title: '<span class="mobile">Notifications</span>', //Readable Title
        icon : 'bell', //Icon class to be applied (see icons.less)
        //iconAfter: true, //default is false. Will place the icon :after instead of :before
        type: 'sidebar', //Sets Link type. (Accepts: sidebar, external, null) *Required
        sidebar: 'notifications', //which sidebar to activate. *required if type=sidebar (Should be same as sidebars.item.id).
        //position: 'right' //default is left (accepts: 'left', 'right')
        user: 'active', //Set If item should only be active when logged in/out (accepts: 'active','inactive')
        alerts: true //Set to true to add notification element
        //url: 'wcasa.org', //*required if type=external
        //more: 'getHelp' //If list item has additional elements within. Get the template
    },{
        //Accounts
        icon : 'caret-right',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'account',
        user: 'active'
    },{
        //Sign In
        title: 'Sign In',
        icon : 'caret-right',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'sign-in',
        user: 'inactive'
    },{
        //Register
        title: 'Create an Account',
        icon : 'caret-right',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'register',
        user: 'inactive'
    },{
        //Sign Out
        title: 'Sign Out',
        icon : 'caret-right',
        iconAfter: true,
        type: 'null',
        user: 'active',
        action: 'signout'
    },{
    /*
        //Language
        icon : 'flag',
        type: 'sidebar',
        sidebar: 'lang',
        position : 'right',
        user: 'public'
    },{*/
        //Get Help
        title: 'Get Help',
        type: 'link',
        url: '/service-providers',
        icon : 'important',
        position : 'right',
        more: 'help',
        user: 'public'
    },{
        //Donate
        title: 'Donate',
        icon : 'heart',
        type: 'sidebar',
        sidebar: 'donate',
        position : 'right',
        user: 'public'
    },{
        //Learning Center
        title: 'Learning Center',
        icon : 'institution',
        type: 'sidebar',
        sidebar: 'learning-center',
        position : 'right',
        user: 'public'
    },{
        //News
        title: 'News',
        icon : 'news',
        type: 'sidebar',
        sidebar: 'news',
        position : 'right',
        user: 'public'
    },{
        //Twitter
        title: 'Twitter',
        icon : 'twitter',
        type: 'sidebar',
        sidebar: 'twitter',
        position : 'right',
        user: 'public'
    },{
        //Youtube
        title: '<span class="mobile">Youtube</span>',
        icon : 'youtube',
        type: 'link',
        url: 'https://www.youtube.com/user/WCASAVPCC',
        position : 'right',
        target: '_blank',
        user: 'public'
    },{
        //Facebook
        title: '<span class="mobile">Facebook</span>',
        icon : 'facebook',
        type: 'link',
        url: 'https://www.facebook.com/wcasa',
        position : 'right',
        target: '_blank',
        user: 'public'
    }]
};

Template.utilityItem.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    },
    // Show notifications on bell icon
    show: function () {
        if (Meteor.user())
            return true;
        return false;
    },
    // Show notification count
    count: function () {
        // Return count
        return count.get();
    }
});

Template.utility.helpers(utilityNavigationHelpers);
