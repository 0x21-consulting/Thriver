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
var utilItem = [{ 
        title: 'Accounts', //Readable Title
        icon : '&/s', //Icon to be used (http://fontawesome.io/cheatsheet/)
        sidebar: true, //Activates a sidebar (accepts: true/false)
        forSidebar: 'accounts', //If sidebar set to true, which sidebar to activate
        user: 'active' //Set when this item should be visible (accepts: 'active','inactive',default)
    },{ 
        id: 'notifications', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'signin', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'register', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'twitter', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'resources', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'news', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'donate', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    },{ 
        id: 'lang', 
        title: 'Accounts',
        icon : '&/s',
        sidebar: true,
        forSidebar: 'accounts',
        user: 'active'
    }
];
Template.utility.item = function() {
    return utilItem;
};