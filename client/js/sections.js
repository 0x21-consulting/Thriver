// No idea why this is the case, but we need javascript URLs to prevent
// the page from scrolling to the top as <a href="#" /> would.
Blaze._allowJavascriptUrls();

// Subscriptions
Meteor.subscribe('sections');
Meteor.subscribe('site');

// Collections
Sections  = new Mongo.Collection('sections');
Site      = new Mongo.Collection('site');

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

// Markdown helper
Template.registerHelper('markdown', function (text, options) {
    // Ignore if no text
    if (!text) return;
    
    // Convert markdown to html
    text = marked('' + text);
    
    // Remove <p> tags
    return text.trim().replace(/^<p>/i,'').replace(/<\/p>$/i,'');
});
