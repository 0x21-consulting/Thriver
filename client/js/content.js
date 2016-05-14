//This file contains temporary content declarations to eventually be merged into Mongo

//Sidebar sections
var sidebars = [{
        id: 'accounts', //Sets the ID of the sidebar which gets targeted by utility nav items 
        width: 231, //Sets the sidebar width & body class
        position:'left', //Which Direction the sidebar appears from
        content: 'acc' //Content of said sidebar
    },{ 
        id: 'notifications', 
        width: 231, 
        position:'left',
        content: 'notif' 
    },{ 
        id: 'signin', 
        width: 231, 
        position:'left',
        content: 'signin' 
    },{ 
        id: 'register', 
        width: 231, 
        position:'left',
        content: 'register' 
    },{ 
        id: 'twitter', 
        width: 231, 
        position:'right',
        content: 'twitter' 
    },{ 
        id: 'resources', 
        width: 231, 
        position:'right',
        content: 'resources' 
    },{ 
        id: 'news', 
        width: 231, 
        position:'right',
        content: 'news' 
    },{ 
        id: 'donate', 
        width: 231, 
        position:'right',
        content: 'donate' 
    },{ 
        id: 'lang', 
        width: 231, 
        position:'right',
        content: 'lang' 
    }
];
Template.sidebars.item = function() {
    return sidebars;
};

//Utility Nav Items
var utilityItem = [{ 
        //Notifications
        title: 'Notifications', //Readable Title
        icon : '&#xf0f3;', //Icon to be used (http://fontawesome.io/cheatsheet/)
        type: 'sidebar', //Sets Link type. (Accepts: sidebar, external, null) *Required
        sidebar: 'notifications', //which sidebar to activate. *required if type=sidebar (Should be same as sidebars.item.id).
        user: 'active', //Set If item should only be active when logged in/out (accepts: 'active','inactive')
        alerts: true //Set to true to add notification element
        //url: 'wcasa.org', //*required if type=external
        //iconPos: 'right', //default is left
        //preIcon: '&#xf007;', //If icon has right toggle icon and aside icon
    },{ 
        //Accounts
        title: '{{name}}', //Renders Logged-in user's name
        icon : '&#xf0da;',
        iconAfter: true,
        preIcon: '&#xf007;',
        type: 'sidebar',
        sidebar: 'accounts',
        user: 'active'
    },{ 
        //Sign In
        title: 'Sign In',
        icon : '&#xf0da;',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'signin',
        user: 'inactive'
    },{  
        //Register
        title: 'Create an Account',
        icon : '&#xf0da;',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'register',
        user: 'inactive'
    },{ 
        //Sign Out
        title: 'Sign Out',
        icon : '&#xf0da;',
        iconPos: 'right',
        type: 'null',
        user: 'active'
    },{ 
        //Facebook
        icon : '&#xf099;',
        type: 'external',
        url: 'https://www.facebook.com/wcasa'
    },{ 
        //Youtube
        icon : '&#xf099;',
        type: 'external',
        url: 'https://www.youtube.com/user/WCASAVPCC'
    },{ 
        //Twitter
        title: 'Twitter',
        icon : '&#xf099;',
        type: 'sidebar',
        sidebar: 'twitter'
    },{ 
        //News
        title: 'News',
        icon : '&#xf1ea;',
        type: 'sidebar',
        sidebar: 'news'
    },{ 
        //Learning Center
        title: 'Learning Center',
        icon : '&#xf19c;',
        type: 'sidebar',
        sidebar: 'resources'
    },{ 
        //Donate
        title: 'Donate',
        icon : '&#xf004;',
        type: 'sidebar',
        sidebar: 'donate'
    },{ 
        //Get Help
        title: 'Get Help',
        type: 'null',
        icon : '&#xf06a;'
    },{ 
        //Language
        title: 'Language',
        icon : '&#xf024;',
        type: 'sidebar',
        sidebar: 'lang'
    }
];
Template.utility.item = function() {
    return utilityItem;
};