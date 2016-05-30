//Sidebar sections
var sidebars = [{
        title: 'Account Details',
        id: 'accounts', //Sets the ID of the sidebar which gets targeted by utility nav items 
        width: 656, //Sets the sidebar width & body class
        position:'left', //Which Direction the sidebar appears from
        tabs: [{ //If sidebar has tabs: use this property
                title: 'Profile',
                icon : 'user',
                id: 'profile',
                template : 'profile'
            },{
                title: 'Subscriptions',
                icon : 'envelope',
                id: 'subscriptions',
                template : 'userSubscriptions'
            },{
                title: 'Requests',
                icon : 'book',
                id: 'requests',
                template: 'userRequests'
            }
        ]
    },{ 
        title: 'Notifications',
        id: 'notifications', 
        width: 356, 
        position:'left',
        template: 'notifications'
    },{ 
        title: 'Account Sign in',
        id: 'login', 
        width: 356, 
        position:'left',
        template: 'login'
    },{ 
        title: 'Create an Account',
        id: 'register', 
        width: 356, 
        position:'left',
        template: 'register' 
    },{ 
        title: 'Twitter',
        id: 'twitter', 
        width: 356, 
        position:'right',
        template: 'twitter' 
    },{ 
        title: 'Learning Center',
        id: 'resources', 
        width: 700, 
        position:'right',
        tabs: [{ //If sidebar has tabs: use this property
                title: 'Library',
                id: 'library',
                template : 'library'
            },{
                title: 'Infosheets',
                id: 'infosheets',
                template : 'infosheets'
            },{
                title: 'Stats & Data',
                id: 'stats-data',
                template: 'statsData'
            },{
                title: 'Webinars',
                id: 'webinars',
                template: 'webinars'
            }
        ]
    },{ 
        title: 'Newsroom',
        id: 'news', 
        width: 1100, 
        position:'right',
        tabs: [{ //If sidebar has tabs: use this property
                title: 'In the News',
                id: 'in-the-news',
                template : 'inTheNews'
            },{
                title: 'Press Releases',
                id: 'press-releases',
                template : 'pressReleases'
            },{
                title: 'Newsletters',
                id: 'newsletters',
                template: 'newsletters'
            },{
                title: 'Annual Reports',
                id: 'annual-reports',
                template: 'annualReports'
            },{
                title: 'Press & Media Kits',
                id: 'press-media-kits',
                template: 'pressMediaKits'
            }
        ]
    },{ 
        title: 'Donate',
        id: 'donate', 
        width: 656, 
        position:'right',
        template: 'donate' 
    },{ 
        title: 'Language Select',
        id: 'lang', 
        width: 356, 
        position:'right',
        template: 'languageSelect' 
    }
];
Template.aside.item = function() {
    return sidebars;
};