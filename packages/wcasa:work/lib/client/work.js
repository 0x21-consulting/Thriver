/**
 * Helper for changing tabs when a user clicks a link
 * @method
 *   @param {$.Event} event - jQuery Event instance
 */
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

    // don't do anything if there's no article
    if (!article) return; 

    article.classList.add('active');

    // Make tab active, too
    event.currentTarget.classList.add('active');

    // Is this is a submenu item?
    parent = event.currentTarget.parentElement.parentElement;
    if ( parent.nodeName.toLowerCase() === 'li' ) {
        // Make active
        parent.classList.add('active');
    }
    if ( parent.nodeName.toLocaleLowerCase() === 'li'){
        document.body.classList.add('mobile-article-open');
    }
},

/**
 * Sections collection getter
 * @function
 *   @param {string} field - The name of the field whose value to return
 *   @param {string} id    - The Mongo DB ID of the document to return.
 *      Optional.  Uses `this` otherwise.
 *   @returns {string}
 */
getValue = function (field) {
    check(field, String);                // Must be a String
    
    // Meteor template helpers expect a function with a single variable
    return function (id) {
        check(id, Match.Maybe(String));  // String or undefined
        
        var result;
        id = id || this.id || this._id;
        
        if (!id) return '';
        
        result = Thriver.sections.get( id, [field] );
        
        if (result)
            return result[field];
        else
            return '';
    };
};

// Tabs
Template.workNav.helpers({
    name: getValue('name'),
    icon: getValue('icon'),
    hasChildren: function (id) {
        var result;
        id = id || this.id;

        result = Thriver.sections.get(id, ['tabs']);

        if (result && result.tabs && result.tabs.length)
            return true;

        return false;
    },
    tabs: getValue('tabs')
});

// Navigation
Template.workListItem.helpers({
    icon:     getValue('icon'),
    name:     getValue('name'),
    tabs:     getValue('tabs'),
    tabName:  getValue('name')
});

// Content Container
Template.workContentContainer.helpers({
    tabs:     getValue('tabs'),
    template: getValue('template'),
    subtabs:  getValue('tabs')
});
// Content
Template.workContent.helpers({
    content:  getValue('content'),
    icon:     getValue('icon'),
    name:     getValue('name')
});

// Helper for changing tabs
Template.workNav.events({
    'click li': changeTabs,
});

Template.workContent.events({
    'click footer.truncate button': function (event) {
        event.preventDefault();
        $("body").addClass("workReadingAnimate").delay(2000).queue(function(){
            $("body").removeClass("workReadingAnimate").dequeue();
            $("body").addClass("workReading").dequeue();
        });
    },
    'click button.backToTopWork': function (event) {
        offset = $('[id="what-we-do"]').offset().top + 228;
        $('body').animate({ scrollTop: offset }, 750);
    },
    'click .backToPrevious': function (event) {
        document.body.classList.remove('mobile-article-open');
    }
});

// Eoghan's stuff
Template.work.onRendered(function () {
    // Handle adding and removing the Body 'workActive' class
    $('.workNav > ul > li > h2 > a:not(.backToIndexWorkA), .workNav ul > li > ul > li > a').click(function (event) {
        event.preventDefault();
        if($("body").hasClass('openNavItem')){
            $("body").removeClass('openNavItem');
        }
        if(!$("body").hasClass('workActive')){
            $("body").removeClass("workBack");
            $("body").addClass('openNavItem');
            $("body").addClass("workFadeIn").delay(250).queue(function(){
                $(this).removeClass("workFadeIn").dequeue();
                $(this).addClass("workActive").dequeue();
            });
            //$('body').addClass('workFadeOut');
        }
    });

    $('.workNav li.backToIndexWork').click(function (event) {
        event.preventDefault();
        $("body").addClass("workFadeOut").delay(175).queue(function(){
        $('body').removeClass('workActive');
        $('body').removeClass('workReading');
        $(this).removeClass("workFadeOut").dequeue();
        });
        //offset = $('[id="what-we-do"]').offset().top - 125;
        //$('body').animate({ scrollTop: offset }, 350);
    });

});

/**
 * Dynamically Generate Tertiary menu
 * @method
 */
Template.workContent.onRendered(function () { console.debug('work rendered', this);
    var that = this;
    Deps.autorun(function (c) {
        var tertiary = that.firstNode.querySelector('.workTertiary'),
            content  = tertiary.parentElement.querySelectorAll('h3'),
            ul       = document.createElement('ul'),
            li, a, i = 0, j = content.length;

        // Wait until ready
        if (!j) return;

        // Quit if there already is a menu (this method executes a dozen times
        // for some reason...)
        if (tertiary.children[0] instanceof Element) return;

        // We're ready now
        c.stop();

        for (; i < j; ++i) {
            // Create list and anchor elements
            li = document.createElement('li');
            a  = document.createElement('a');

            // Create link details
            a.href = '#' + content[i].id;
            a.textContent = content[i].textContent;

            // Add elements
            ul.appendChild(li).appendChild(a);
        }

        tertiary.appendChild(ul);
    });
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.work.onRendered(function () {
    // Get db ID from current instance
    var instanceName = this.data.name;

    // Register
    Thriver.history.registry.insert({
        element: Thriver.sections.generateId(instanceName),
        /** Handle deep-linking */
        callback: function (path) {
            console.debug('Deep-link:', path);
        }
    });
});
