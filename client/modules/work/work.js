// Helper for changing tabs
var changeTabs = function (event) {
    event.stopPropagation(); event.preventDefault();
    
    var parent = document.querySelector('section.mainSection.work'),
        active = parent.querySelectorAll('.active'),
        article, i = 0, j = active.length;
    
    // Remove active class from all elements under parent
    for (; i < j; ++i)
        active[i].classList.remove('active');
    
    // Make article with same ID as tab active
    article = parent.querySelector('article[data-id="' +
        event.currentTarget.dataset.id + '"]');
    if (!article) return; // don't do anything if there's no article
    article.classList.add('active');
        
    // Make tab active, too
    event.currentTarget.classList.add('active');
    
    // Is this is a submenu item?
    parent = event.currentTarget.parentElement.parentElement;
    if ( parent.nodeName.toLowerCase() === 'li' ) {
        // Make active
        parent.classList.add('active');
    }
};

// Tabs
Template.workNav.helpers({
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
        id = id || this._id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        console.info(this, id, result);
        if (result)
            return result.tabs;
    }
});

// Navigation
Template.workListItem.helpers({
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
    },
    tabs: function (id) {
        var result;
        id = id || this.id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        
        if (result)
            return result.tabs;
    },
    tabName: function (id) {
        var result;
        id = id || this;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        
        if (result)
            return result.name;
    }
});

// Content Container
Template.workContentContainer.helpers({
    tabs: function (id) {
        var result;
        id = id || this._id;
        
        result = Sections.findOne({ '_id': id }, { '_id': 0, tabs: 1 });
        
        if (result)
            return result.tabs;
    },
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
// Content
Template.workContent.helpers({
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
/*Template.tab.onRendered(function () {
    var parent;
    
    try {
        // TODO:  How robust is this?!
        parent = this.firstNode.parentElement.parentElement.parentElement;
        
        // Set the very first result as active.  Should be the first in the DOM.
        parent.querySelector('main > article').classList.add('active');
        parent.querySelector('menu li').classList.add('active');
    } catch (error) { }
});*/

// Helper for changing tabs
Template.workNav.events({
    'click li': changeTabs
});

// From jQuery Providers file
// TODO: rewrite this
/*Template.work.onRendered(function () {
    //Opening The workDetails pane
    $('.workGrid > ul > li > a, .backToIndex a').click(function(){
        if($('body').hasClass('workDetails')){
            event.preventDefault();
            $('body').removeClass('workDetails');
        } else{
            event.preventDefault();
            $('body').addClass('workDetails');
        }
    });


});*/


// Eoghan's stuff
Template.work.onRendered(function () {
    // Handle adding and removing the Body 'workActive' class
    $('.workNav > ul > li > a, .workNav > ul > li > .icon, .workNav ul > li > ul > li > a').click(function () {
        event.preventDefault();
        $('body').addClass('workActive');
    });

    $('.workNav li.backToIndexWork a').click(function(){
        event.preventDefault();
        $('body').removeClass('workActive');
    });
});