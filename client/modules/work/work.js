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

// From jQuery Providers file
// TODO: rewrite this
Template.work.onRendered(function () {
    //Toggle work filter
    $('button.work-filter').click(function(){
        if($('body').hasClass('work-menu-active')){
            $('body').removeClass('work-menu-active');
        } else{
            $('body').addClass('work-menu-active');
        }
    });

    $('.work menu.tabs').click(function(){
        if($('body').hasClass('work-menu-active')){
            $('body').removeClass('work-menu-active');
        } else{
            //Do nothing. This is used to close the menu on mobile after a selection is made.
        }
    });
    
    // Click the first tab to cause it to open
    var first = document.querySelector('.work .tabs ul > li:first-child');
    if (first)
        first.click();


    // Fix-position the Work Section Sidebar (Temp)
    /*
    $(window).scroll(function () {
        var position = $('.work').offset();
        
        // Sometimes position is undefined?!
        if (!position) return;
        
        var threshold = position.top -93;
        var positionBtm = $('#community').offset();
        var btmThreshold = positionBtm.top;
        if ($(window).scrollTop() >= threshold && $(window).scrollTop() < btmThreshold){
            $('.work .tabs').addClass('fixed');
            // TODO: This is a hack
            ///document.querySelector('.work .tabs').style.top = '95px';
        } else{
            $('.work .tabs').removeClass('fixed bottom');
            // TODO: This is a hack
            //document.querySelector('.work .tabs').style.top = '0px';
        }
    });

    //Scroll To Top of Div
    $('.work .tabs li').click(function (e) {
        $('html, body').animate({
            scrollTop: $('.work').offset().top - 94
        }, 'fast');
    });
    */
});
