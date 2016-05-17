//This file contains temporary content declarations to eventually be merged into Mongo

//Sidebar sections
var sidebars = [{
        id: 'accounts', //Sets the ID of the sidebar which gets targeted by utility nav items 
        width: 656, //Sets the sidebar width & body class
        position:'left', //Which Direction the sidebar appears from
        template: 'accountDetails', //Template of said sidebar's content
        /*tabs: [{ //If unset, no tabs rendered
            title: 'Action Alerts', //Tab Title
            id: 'actionAlert', //Tab Id
            template : 'actionAlert', //Tab Content Template
        }];*/
    },{ 
        id: 'notifications', 
        width: 356, 
        position:'left',
        template: 'notifications',
        tabs: [{ //If sidebar has tabs: use this property
                title: 'Action Alerts',
                id: 'actionAlert',
                template : 'actionAlert'
            },{
                title: 'News',
                id: 'news',
                template : 'news'
            },{
                title: 'Press Releases',
                id: 'press',
                template: 'press'
            }
        ]
    },{ 
        id: 'login', 
        width: 356, 
        position:'left',
        template: 'login'
    },{ 
        id: 'register', 
        width: 356, 
        position:'left',
        template: 'register' 
    },{ 
        id: 'twitter', 
        width: 356, 
        position:'right',
        template: 'twitter' 
    },{ 
        id: 'resources', 
        width: 700, 
        position:'right',
        template: 'resources'
    },{ 
        id: 'news', 
        width: 1100, 
        position:'right',
        template: 'news' 
    },{ 
        id: 'donate', 
        width: 656, 
        position:'right',
        template: 'donate' 
    },{ 
        id: 'lang', 
        width: 356, 
        position:'right',
        template: 'languageSelect' 
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
        icon : 'CaretRight',
        iconAfter: true,
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
        iconAfter: true,
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
        type: 'internal',
        targetId: 'providers',
        icon : 'Important',
        position : 'right',
        more: 'help'
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


