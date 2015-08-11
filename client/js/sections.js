// Subscriptions
Meteor.subscribe('sections');
Meteor.subscribe('people');
Meteor.subscribe('providers');
Meteor.subscribe('site');

// Collections
Sections  = new Mongo.Collection('sections');
People    = new Mongo.Collection('people');
Providers = new Mongo.Collection('providers');
Site      = new Mongo.Collection('site');

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
Template.person.helpers({
    avatar: function () {
        return Site.findOne({}, { avatar: 1 });
    }
});

// Sliders
Template.registerHelper('slider', function () {
    var windowWidth = document.body.offsetWidth,
        elemWidth   = this.offsetWidth;
        
    console.debug(this);
});

// Counties and other provider data
Template.providers.helpers({
    // All counties (for dropdown list)
    // NOTE: We only want to display counties which have providers,
    //       which is why we aren't using the counties collection here
    counties: function () {
        //return zipCodes.find({});
        
        // NOTE: Meteor's mongo driver still doesn't support
        //   db.collection.distinct(), so we have to hack it
        return _.chain(
            Providers.find({}, { counties: 1 }).map(function (provider) {
                return provider.counties;
        })).
        
        // provider.counties is an array, so we have to flatten them all,
        // then sort them alphabetically, then return distinct ones
        flatten().sort().uniq().value();
    },
    // The current provider
    currentProvider: function () {
        return Session.get('currentProvider');
    },
    // Current provider's counties served
    providerCounties: function () {
        return this.counties.join(', ');
    }
});