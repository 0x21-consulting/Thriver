var Sections = new Mongo.Collection('sections'),

// Helper for changing tabs
changeTabs = function (event) {
    console.debug(event);
    var parent = event.delegateTarget.parentElement.parentElement,
        active = parent.querySelectorAll('.active'),
        i = 0, j = active.length;
        
    console.debug('active', active);
    // Remove active class from all elements under parent
    for (; i < j; ++i)
        active[i].classList.remove('active');
    
    // Make article with same ID as tab active
    parent.querySelector('[data-id="' + event.target.dataset.id + '"]').
        classList.add('active');
        
    // Make tab active, too
    event.target.classList.add('active');
};

// Dynamically generate anchor name
Template.registerHelper('anchor', function (name) {
    var removeName;
    
    // We're expecting to only build anchors for elements that actually have names
    if (!name || !name.hash || !name.hash.name)
        return;
    
    // Mutual Suspicion
    name = '' + name.hash.name;
    
    // Is the name an empty string?
    removeName = !name.length;
    
    // Make all lower case, then replace spaces with hyphens
    name = name.toLowerCase().trim().replace(/ /g, '-').
    
    // anchors can't begin with numbers or hyphens
    replace(/^[\d-]*/g, '');
    
    if (removeName || name.length > 0)
        return name;
        
    throw new Meteor.Error('Name must contain letters.');
});

// Subscribe to sections Mongo collection
Meteor.subscribe("sections");

// Render sections on page
Template.body.helpers({
    sections: function () {
        return Sections.find({ displayOnPage: true });
    }
});

// Pass to header template for menu
Template.header.helpers({
    sections: function () {
        return Sections.find({ displayOnPage: true, name: { $ne: null } });
    }
}); 

// Tabs
Template.tab.helpers({
    name: function (id) {
        return Sections.findOne({ '_id': id }, { '_id': 0, name: 1 }).name;
    },
    icon: function (id) {
        return Sections.findOne({ '_id': id }, { '_id': 0, icon: 1 }).icon;
    }
});

// Articles
Template.article.helpers({
    content: function (id) {
        return Sections.findOne({ '_id': id }, { '_id': 0, content: 1 }).content;
    },
    icon: function (id) {
        return Sections.findOne({ '_id': id }, { '_id': 0, icon: 1 }).icon;
    },
    name: function (id) {
        return Sections.findOne({ '_id': id }, { '_id': 0, name: 1 }).name;
    }
});
// Set the first tab as active
Template.tab.onRendered(function () {
    var parent;
    
    try {
        // TODO:  How robust is this?!
        parent = this.firstNode.parentElement.parentElement.parentElement;
        
        // Set the very first result as active.  Should be the first in the DOM.
        parent.querySelector('main > article').classList.add('active');
        parent.querySelector('menu li').classList.add('active');
    } catch (error) { /* no recovery */ }
});

// Helper for changing tabs
Template.tab.events({
    'click li': changeTabs
});