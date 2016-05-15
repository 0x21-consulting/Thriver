//This file contains temporary content declarations to eventually be merged into Mongo

//Sidebar sections
var sidebars = [{
        id: 'accounts', //Sets the ID of the sidebar which gets targeted by utility nav items 
        width: 656, //Sets the sidebar width & body class
        position:'left', //Which Direction the sidebar appears from
        content: 'accountDetails' //Template of said sidebar's content
    },{ 
        id: 'notifications', 
        width: 356, 
        position:'left',
        content: 'notifications' 
    },{ 
        id: 'login', 
        width: 356, 
        position:'left',
        content: 'login' 
    },{ 
        id: 'register', 
        width: 356, 
        position:'left',
        content: 'register' 
    },{ 
        id: 'twitter', 
        width: 356, 
        position:'right',
        content: 'twitter' 
    },{ 
        id: 'resources', 
        width: 700, 
        position:'right',
        content: 'resources' 
    },{ 
        id: 'news', 
        width: 1100, 
        position:'right',
        content: 'news' 
    },{ 
        id: 'donate', 
        width: 656, 
        position:'right',
        content: 'donate' 
    },{ 
        id: 'lang', 
        width: 356, 
        position:'right',
        content: 'languageSelect' 
    }
];
Template.sidebars.item = function() {
    return sidebars;
};

//Utility Nav Items
var utilityItem = [{ 
        //Notifications
        //title: 'Notifications', //Readable Title
        icon : 'Bell', //Icon class to be applied (see icons.less)
        type: 'sidebar', //Sets Link type. (Accepts: sidebar, external, null) *Required
        sidebar: 'notifications', //which sidebar to activate. *required if type=sidebar (Should be same as sidebars.item.id).
        user: 'active', //Set If item should only be active when logged in/out (accepts: 'active','inactive')
        alerts: true //Set to true to add notification element
        //url: 'wcasa.org', //*required if type=external
        //iconPos: 'right', //default is left
        //preIcon: '&#xf007;', //If icon has right toggle icon and aside icon
        //position: 'right' //default is left (accepts: 'left', 'right')
    },{ 
        //Accounts
        icon : 'CaretRight',
        iconAfter: true,
        preIcon: 'User',
        type: 'sidebar',
        sidebar: 'accounts',
        user: 'active'
    },{ 
        //Sign In
        title: 'Sign In',
        icon : 'CaretRight',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'login',
        user: 'inactive'
    },{  
        //Register
        title: 'Create an Account',
        icon : 'CaretRight',
        iconAfter: true,
        type: 'sidebar',
        sidebar: 'register',
        user: 'inactive'
    },{ 
        //Sign Out
        title: 'Sign Out',
        icon : 'CaretRight',
        iconPos: 'right',
        type: 'null',
        user: 'active'
    },{ 
        //Language
        icon : 'Flag',
        type: 'sidebar',
        sidebar: 'lang',
        position : 'right'
    },{ 
        //Get Help
        title: 'Get Help',
        type: 'null',
        icon : 'Important',
        position : 'right'
    },{ 
        //Donate
        title: 'Donate',
        icon : 'Heart',
        type: 'sidebar',
        sidebar: 'donate',
        position : 'right'
    },{
        //Learning Center
        title: 'Learning Center',
        icon : 'Institution',
        type: 'sidebar',
        sidebar: 'resources',
        position : 'right'
    },{ 
        //News
        title: 'News',
        icon : 'Newspaper',
        type: 'sidebar',
        sidebar: 'news',
        position : 'right'
    },{ 
        //Twitter
        title: 'Twitter',
        icon : 'Twitter',
        type: 'sidebar',
        sidebar: 'twitter',
        position : 'right'
    },{ 
        //Youtube
        icon : 'Youtube',
        type: 'external',
        url: 'https://www.youtube.com/user/WCASAVPCC',
        position : 'right'
    },{ 
        //Facebook
        icon : 'Facebook',
        type: 'external',
        url: 'https://www.facebook.com/wcasa',
        position : 'right'
    }

];
Template.utility.item = function() {
    return utilityItem;
};


