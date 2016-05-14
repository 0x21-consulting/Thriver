//This file contains temporary content declarations to eventually be merged into Mongo

//Sidebar elements
var sidebars = [
    { id: 'accounts', width: 231, position:'left' },
    { id: 'notifications', width: 231, position:'left' },
    { id: 'signin', width: 231, position:'left' },
    { id: 'register', width: 231, position:'left' },
    { id: 'twitter', width: 231, position:'right' },
    { id: 'resources', width: 231, position:'right' },
    { id: 'news', width: 231, position:'right' },
    { id: 'donate', width: 231, position:'right' },
    { id: 'lang', width: 231, position:'right' }
];
Template.sidebars.section = function() {
    return sidebars;
};