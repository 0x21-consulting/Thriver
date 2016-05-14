//This file contains temporary content declarations to eventually be merged into Mongo

//Sidebar elements
var sidebars = [{ 
        id: 'accounts', 
        width: 231, 
        position:'left',
        content: 'acc'
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

Template.sidebars.section = function() {
    return sidebars;
};