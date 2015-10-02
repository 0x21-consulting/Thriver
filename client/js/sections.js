// No idea why this is the case, but we need javascript URLs to prevent
// the page from scrolling to the top as <a href="#" /> would.
Blaze._allowJavascriptUrls();

// Subscriptions
Meteor.subscribe('sections');
Meteor.subscribe('site');

// Collections
Sections  = new Mongo.Collection('sections');
Site      = new Mongo.Collection('site');

// Helper for changing tabs
var changeTabs = function (event) {
    event.stopPropagation();
    
    var parent = document.querySelector('section.work.tabs'),
                 //event.delegateTarget.parentElement.parentElement,
        active = parent.querySelectorAll('.active'),
        submenus = parent.querySelectorAll('ul.open'), submenu,
        i = 0, j = active.length;
    
    // Remove active class from all elements under parent
    for (; i < j; ++i)
        active[i].classList.remove('active');
    
    // Make article with same ID as tab active
    parent.querySelector('article[data-id="' + event.currentTarget.dataset.id 
        + '"]').classList.add('active');
        
    // Make tab active, too
    event.target.classList.add('active');
    
    // If there's a sub menu, close all other sub menus and then open this one
    submenu = event.target.querySelector('ul');
    if (submenu) {
        // Close existing submenus
        for (i = 0, j = submenus.length; i < j; ++i)
            submenus[i].classList.remove('open');
        // Open this one
        submenu.classList.add('open');
    }
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

// Render sections on page
Template.body.helpers({
    sections: function () {
        return Sections.find({ displayOnPage: true });
    }
});

// Pass to header template for menu
Template.mainNav.helpers({
    sections: function () {
        return Sections.find({ displayOnPage: true, name: { $nin: [null, ''] } });
    }
}); 

// Work helpers
Template.work.helpers({
    template: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, template: 1 });
        
        if (result)
            return result.template;
    },
    subtabs: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        
        if (result)
            return result.tabs;
    }
});
// Tabs Top helper
Template.tabsTop.helpers({
    template: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, template: 1 });
        
        if (result)
            return result.template;
    }
});

// Tabs
Template.tab.helpers({
    name: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, name: 1 });
        if (result)
            return result.name;
    },
    icon: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, icon: 1 });
        if (result)
            return result.icon;
    },
    hasChildren: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        
        if (result && result.tabs && result.tabs.length)
            return true;
            
        return false;
    },
    tabs: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        if (result)
            return result.tabs;
    }
});

// Articles
Template.article.helpers({
    content: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, content: 1 });
        if (result)
            return result.content;
    },
    icon: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, icon: 1 });
        if (result)
            return result.icon;
    },
    name: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, name: 1 });
        if (result)
            return result.name;
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

// Markdown helper
Template.registerHelper('markdown', function (text, options) {
    // Ignore if no text
    if (!text) return;
    
    // Convert markdown to html
    text = marked('' + text);
    
    // Remove <p> tags
    return text.trim().replace(/^<p>/i,'').replace(/<\/p>$/i,'');
});
