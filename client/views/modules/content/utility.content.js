var utilityItem = [{ 
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
        sidebar: 'login',
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
        user: 'active'
    },{ 
        //Language
        icon : 'flag',
        type: 'sidebar',
        sidebar: 'lang',
        position : 'right'
    },{ 
        //Get Help
        title: 'Get Help',
        type: 'link',
        url: '#providers',
        icon : 'important',
        position : 'right',
        more: 'help'
    },{ 
        //Donate
        title: 'Donate',
        icon : 'heart',
        type: 'sidebar',
        sidebar: 'donate',
        position : 'right'
    },{
        //Learning Center
        title: 'Learning Center',
        icon : 'institution',
        type: 'sidebar',
        sidebar: 'resources',
        position : 'right'
    },{ 
        //News
        title: 'News',
        icon : 'news',
        type: 'sidebar',
        sidebar: 'news',
        position : 'right'
    },{ 
        //Twitter
        title: 'Twitter',
        icon : 'twitter',
        type: 'sidebar',
        sidebar: 'twitter',
        position : 'right'
    },{ 
        //Youtube
        icon : 'Youtube',
        type: 'link',
        url: 'https://www.youtube.com/user/WCASAVPCC',
        position : 'right',
        target: '_blank'
    },{ 
        //Facebook
        icon : 'Facebook',
        type: 'link',
        url: 'https://www.facebook.com/wcasa',
        position : 'right',
        target: '_blank'
    }

];
Template.utility.item = function() {
    return utilityItem;
};