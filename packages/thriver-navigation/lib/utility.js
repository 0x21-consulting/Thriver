// Populate Profile tab under Account Overview
Template.utility.helpers({
    items: [{ 
        //Notifications
        //title: 'Notifications', //Readable Title
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
        sidebar: 'accounts',
        user: 'active'
    },{ 
        //Sign In
        title: 'Sign In',
        icon : 'Caret-right',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'signin',
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
        //Language
        icon : 'flag',
        type: 'sidebar',
        sidebar: 'lang',
        position : 'right',
        user: 'public'
    },{ 
        //Get Help
        title: 'Get Help',
        type: 'link',
        url: '#providers',
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
        sidebar: 'resources',
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
        icon : 'Youtube',
        type: 'link',
        url: 'https://www.youtube.com/user/WCASAVPCC',
        position : 'right',
        target: '_blank',
        user: 'public'
    },{ 
        //Facebook
        icon : 'Facebook',
        type: 'link',
        url: 'https://www.facebook.com/wcasa',
        position : 'right',
        target: '_blank',
        user: 'public'
    }]
});

Template.utilityItem.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    }
});
/**
 * Remove all open sidebars
 * @method
 *   @param {$.Event} event
 */
/*var closeAsides = function (event) {
    event.preventDefault(); event.stopPropagation();
    
    // Start with body changes
    document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall', 'leftMedium');
    
    // Remove active components
    document.querySelector('nav.utility li.active').classList.remove('active');
    document.querySelector('aside.sidebar > section.active').classList.remove('active');
},

// Shortcut object for assigning Template event for aside closure
closure = { 'click .closeTab': closeAsides };

// Handle Utility Navigation events
Template.utilityNav.events({
    // Handle left and right sidebars
    // All buttons that would trigger sidebars have the .hasSidebar class
    'click nav.utility li[data-sidebar]': function (event) {
        event.stopPropagation();
        
        // Mutual suspicion
        if (! (event instanceof $.Event) ) return;
        
        var that    = event.currentTarget,
            name    = that.className.replace(/ active/, ''),
            section = document.querySelector('section.' + name);
        
        // If this tab is already active, close sidebars
        if (that.classList.contains('active')) {
            closeAsides(event);
            $(event.target).blur();
            return;
        }
        
        // Page body must move left or right depending on aside size
        document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall', 'leftMedium');
        document.body.classList.add(that.dataset.sidebar);
        
        // Activate link
        $('li[data-sidebar]').removeClass('active');
        that.classList.add('active');
        
        // Activate section
        $('aside.sidebar section').removeClass('active');
        section.classList.add('active');
        section.classList.add(that.dataset.size);
    },
    // Close sidebars when clicking sign out or help links
    'click li.logout' : closeAsides,
    'click li.getHelp': closeAsides,
    'click li.getHelp': function (event) {
        offset = $('[id="service-providers"]').offset().top - 95;
        $('body').animate({ scrollTop: offset }, 1500);
        $('figure.alert').addClass('active').delay(5000).queue(function(){
            $(this).removeClass("active").dequeue();
        });
    },
    'mouseenter li.getHelp': function (event) {
        //alert('hover');
        $('figure.help').addClass('active');
    },
    'mouseout li.getHelp': function (event) {
        $('figure.help').removeClass('active');
    }

});*/
// More sidebar closure methods... one for each template :(
/*Template.body.events({ 'click .overlay' : closeAsides });
Template.languageSelect.events (closure);
Template.login.events          (closure);
Template.register.events       (closure);
Template.notifications.events  (closure);
Template.accountDetails.events (closure);
Template.twitter.events        (closure);
Template.resources.events        (closure);
Template.news.events           (closure);
Template.donate.events         (closure);*/