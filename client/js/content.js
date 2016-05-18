//This file contains temporary content declarations to eventually be merged into Mongo

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
                template : 'subscriptions'
            },{
                title: 'Requests',
                icon : 'book',
                id: 'requests',
                template: 'requests'
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

//Utility Nav Items
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





var lists =[{
    type: 'generic', //accepts: generic, details
    itemType: 'category',
    paginate: true, //Default is false
    perPage: 10, //if paginate:true, how many before paginate
    style: 'striped',
    //If standard
    items: {
        title: 'One Webinar',
        date: '06991020', //This is temporary
        friendlyDate: '02/11/29',
        content: 'lorem ipsum.'        
    },
    //If category
    category: {
        title: 'Summer Webinars',
        id: 'summerWebinars',
        items: {
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.'
        }
    },
    //If catalog
    catalog: {
        title: 'There is diversity Within Diversity: Community Leaders Views on increasing diversity in youth serving organizations.',
        byline: 'Sumru Erkut, et al., Center for Research on Women, 1993',
        id: 'summerWebinars',
        callNumber: '6504S',
        copies: 1,
        subjectHeadings: 'Ethnology -- United States. Minority teenagers -- United States -- Societies and clubs.',
        classification: 'Organizational',
        category: 'Organizational Material',
        type: 'Book or Booklet'
    }
}
];


var item
