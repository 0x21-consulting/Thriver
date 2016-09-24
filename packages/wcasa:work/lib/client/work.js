/**
 * Helper for changing tabs when a user clicks a link
 * @method
 *   @param {$.Event} event - jQuery Event instance
 */
var changeTabs = function (event) {
    event.stopPropagation(); event.preventDefault();
    
    var parent  = document.querySelector('section.mainSection.work'),
        active  = parent.querySelectorAll('.active'),
        target  = event.currentTarget.parentElement,
        article = parent.querySelector('article[data-id="' +
            target.dataset.id + '"]'),
        i = 0, j = active.length, path, parentName;

    // don't do anything if there's no article
    if (!article) return;

    // Remove active class from all elements under parent
    for (; i < j; ++i)
        active[i].classList.remove('active');

    // Make article with same ID as tab active
    article.classList.add('active');

    // Make tab active, too
    target.classList.add('active');

    // Establish current path
    parentName = parent.id;
    path = parentName + '/';

    // Is this is a submenu item?
    parent = target.parentElement.parentElement;
    if ( parent.nodeName.toLowerCase() === 'li' ) {
        // Make active
        parent.classList.add('active');

        // Add mobile article open
        document.body.classList.add('mobile-article-open');

        // Add to path
        path += Thriver.sections.generateId(
            getValue('name')(parent.dataset.id) ) + '/';
    }

    // Add current link to history as well
    path += Thriver.sections.generateId(
        getValue('name')(target.dataset.id) );

    // Update history registry
    Thriver.history.update(parentName, path);

    // Update URI
    window.history.pushState({ path: path }, undefined, '/' + path);

    // If not already active, add fade class, then active class to body
    if (!document.body.classList.contains('workActive')) {
        // Start Fade effect
        document.body.classList.add('workFadeIn');
        // End Fade effect
        setTimeout(function () {
            document.body.classList.remove('workFadeIn');
            document.body.classList.add('workActive');
        }, 250);
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
    tabName:  getValue('name'),
    anchor:   function () {
        //console.debug('parent data', Template.parentData());
        //debugger;
        //return Thriver.sections.generateId( getValue('name')( 
        //    this instanceof String? this.toString() : this.id ) );

        // TODO: Create true anchor refs
        return '#';
    }
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
    name:     getValue('name'),
    hash:     function () {
        var content;
        
        content = getValue('content')(this.id);

        // Return a SHA256 hash of the content for use in editing
        if (content) return SHA256(content);
        else         return '';
    }
});

// Helper for changing tabs
Template.workNav.events({
    'click h2': changeTabs,
    'click li > ul > li > a': changeTabs,
    'click li.backToIndexWork': function (event) {
        event.preventDefault(); event.stopPropagation();

        // Fade out and make not active
        document.body.classList.add('workFadeOut');
        setTimeout(function () {
            document.body.classList.remove('workActive', 'workReading', 'workFadeOut');
        }, 200);
    }
});

// TODO: Clean these up.
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

/**
 * Dynamically Generate Tertiary menu
 * @method
 */
Template.workContent.onRendered(function () {
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
    var instanceName = this.data.name,
        data = this.data;

    // Register
    Thriver.history.registry.insert({
        element: Thriver.sections.generateId(instanceName),

        /** Handle deep-linking */
        callback: function (path) {
            var sections, section, i, j, link,

            // Get Sections recursively
            getTabs = function (id) {
                var sections = {}, section,
                    tabs  = Thriver.sections.get(id, ['tabs']).tabs,
                    name, i, j;

                // Get name and ID for each tab
                for (i = 0, j = tabs.length; i < j; ++i) {
                    // Get section name
                    section = Thriver.sections.get( tabs[i], ['name'] );
                    name = section.name;

                    // Then sanitize section name
                    name = Thriver.sections.generateId(name);

                    // Add to link list and Recurse
                    sections[ name ] = getTabs( tabs[i] );

                    // Add ID to list as well
                    sections[ name ]._id = section._id;
                }

                return sections;
            };

            // If there's no path, there's nothing to do
            if (!path.length) return;

            // Get link list of all browseable sections
            sections = getTabs(data._id);

            // Get link for deep-linked section
            for (i = 0, j = path.length; i < j; ++i) {
                if (sections[ path[i] ])
                    sections = sections[ path[i] ];
                else break;
            }

            // Find anchor element
            link = document.querySelector('li[data-id="' + sections._id + '"] > a');

            // Click anchor to activate page
            if (link instanceof Element)
                link.click();

            console.debug('Deep-link:', path, data, sections);
        }
    });
});

/**
 * @summary Support details elements in unsupported browsers
 * @method
 */
Template.work.onRendered(function () {
    details_shim.init();
});
