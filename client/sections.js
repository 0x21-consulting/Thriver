// Helper for changing tabs
var changeTabs = function (event) {
    var parent = event.delegateTarget.parentElement.parentElement,
        active = parent.querySelectorAll('.active'),
        i = 0, j = active.length;
    
    // Remove active class from all elements under parent
    for (; i < j; ++i)
        active[i].classList.remove('active');
    
    // Make article with same ID as tab active
    parent.querySelector('[data-id="' + event.target.dataset.id + '"]').
        classList.add('active');
        
    // Make tab active, too
    event.target.classList.add('active');
},

// Collections
Sections  = new Mongo.Collection('sections'),
People    = new Mongo.Collection('people'),
Providers = new Mongo.Collection('providers'),
Counties  = new Mongo.Collection('counties');

// Subscriptions
Meteor.subscribe('sections');
Meteor.subscribe('people');
Meteor.subscribe('providers');
Meteor.subscribe('counties');

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
Template.header.helpers({
    sections: function () {
        return Sections.find({ displayOnPage: true, name: { $nin: [null, ''] } });
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

// People
Template.who.helpers({
    staff: function () {
        return People.find({ boardMember: false });
    },
    board: function () {
        return People.find({ boardMember: true });
    }
});

// Sliders
Template.registerHelper('slider', function () {
    var windowWidth = document.body.offsetWidth,
        elemWidth   = this.offsetWidth;
        
    console.debug(this);
});

// Counties
Template.providers.helpers({
    // All counties (for dropdown list)
    counties: function () {
        return Counties.find({});
    }
});
Template.providers.events({
    // County drop-down list
    'change #county': function (event) {
        var name = event.target.value;
        
        // Mutual Suspician
        if (!name) throw new Error('Invalid county');
        
        // Get all providers for that county
        Providers.find({ counties: { $elemMatch: { $in: [name] }}}).
            forEach(function (provider) {
                console.debug('Provider:', provider);
        });
    },
    // Clicking ZIP Code GO button
    'click #zip + .submit': function (event) {
        var zip = event.currentTarget.parentElement.querySelector('#zip'),
            county = '',
            providers  = [];
        
        // Mutual Suspicion
        if (!zip) throw new Error('No ZIP element?');
        
        // Get county
        county = Counties.findOne({ zips: 
            // Minimongo doesn't support $eq for some reason
            { $elemMatch: { $in: [zip.value] } }})
        console.debug('County:', county.name);
        
        // Now get providers that support that county
        Providers.find({ counties: { $elemMatch: { $in: [county.name] }}}).
            forEach(function (provider) {
                console.debug('Provider:', provider);
        });
    }
});