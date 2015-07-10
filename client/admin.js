// Method to set admin properties
var isAdmin = function () {
    var that = this; // keep in scope
    
    // Create Reactive Variable
    // If a user somehow gets admin privileges revoked, admin controls
    // would be immediately removed from the page
    this.isAdmin = new ReactiveVar(false);
    
    // Call the isAdmin method defined in server/admin.js to determine
    // whether the logged-in user is an admin or not
    Meteor.call('isAdmin', function (error, result) {
        // Update the reactive variable
        that.isAdmin.set(result);
        Session.set('isAdmin', result);
    });
},

// Handle new section creation
newSection = function () {
    var section = document.createElement('section'),
        oldSection = document.querySelector('.placeholder');
    
    // Don't allow duplicates
    if (oldSection)
        oldSection.remove();
    
    // Prepare element
    section.classList.add('placeholder');
    section.textContent = 'CREATE NEW SECTION';
    section.addEventListener('dragenter', function (event) {
        // override inhereted event listener
        event.preventDefault();
        event.stopPropagation();
    });
    section.addEventListener('dragover', function (event) {
        // Required to allow drop for some reason
        event.preventDefault();
    });
    // TODO: Sometimes the placeholder doesn't get removed on drop cancel
    section.addEventListener('dragleave', function (event) {
        var oldSections = document.querySelectorAll('.placeholder'),
            i = 0, j = oldSections.length;
    
        // Don't let the section hang around
        for (; i < j; ++i)
            oldSections[i].remove();
    });
    section.addEventListener('drop', function (event) {
        // Handle drop and template creation
        event.preventDefault();
        event.stopPropagation();
        
        var menu = document.createElement('menu'), // best semantically
            a, i = 0, j,
            
        // TODO: make this dynamic
        templates = [
            { name: 'Callout',      template: 'callout'     },
            { name: 'Community',    template: 'community'   },
            { name: 'Contact',      template: 'contact'     },
            { name: 'Providers',    template: 'providers'   },
            { name: 'Who We Are',   template: 'who'         },
            { name: 'Work',         template: 'work'        }
        ],
        
        // Function for applying templates on click
        setTemplate = function (event) {
            var sections, index, i = 0, j,
                placeholder = document.querySelector('.placeholder'),
                that = this;
            
            // Get rid of menu
            document.querySelector('#templatesMenu').remove();
            
            // Determine index of placeholder
            sections = document.querySelectorAll('main > section');
            for (j = sections.length; i < j; ++i)
                if (sections[i] === placeholder)
                    index = i;
            
            console.debug('index', index);
            ++index;
            
            // Remove placeholder
            placeholder.remove();
            
            // Add section to database
            // TODO: nonreactive doesn't appear to work; the new section always
            //       renders at the bottom of the page, despite the order value
            Tracker.nonreactive(function () {
                // Add section
                Meteor.call('addSection', that.dataset.template, index);
                
                // Update order
                for (; index < j; ++index) {
                    console.debug(index, sections[index].dataset.id);
                    Meteor.call('updateOrder', sections[index].dataset.id, index + 1);
                }
                
                // BUG: Order isn't reactive.  Reload as a work-around
                location.reload();
            });
        };
        
        // Create menu
        menu.id = 'templatesMenu';
        menu.textContent = 'Pick a Template:';
        for (j = templates.length; i < j; ++i) {
            a                   = document.createElement('a');
            a.href              = 'javascript:void(0)';
            a.textContent       = templates[i].name;
            a.dataset.template  = templates[i].template;
            
            // Make the link useful
            a.addEventListener('click', setTemplate);
            
            // Add link to menu
            menu.appendChild(a);
        }
        menu.style.left = event.pageX + 'px';
        menu.style.top  = event.pageY + 'px';
        
        // Add to page
        document.body.appendChild(menu);
    });
    
    // Return element
    return section;
};

// Bind isAdmin function
Template.body.onCreated(isAdmin);
Accounts.onLogin(isAdmin);

// Whether to show admin controls on page
Template.body.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});
Template.callout.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});
Template.community.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});
Template.contact.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});
Template.providers.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});
Template.who.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});
Template.work.helpers({
    isAdmin: function () {
        // Make the reactive variable available to the template
        return Session.get('isAdmin');
    }
});

// Bind drag and drop events for adding new sections
Template.body.events({
    // Drop before or after section element
    'dragenter main > section': function (event) {
        var originalEvent = event.originalEvent,
            elem = event.currentTarget,
            location, section;
        
        // Check bounds
        if (originalEvent.pageY > elem.offsetTop && originalEvent.pageY < (elem.offsetTop + elem.offsetHeight)) {
            // If mouse is over top half of element
            if (originalEvent.pageY < (elem.offsetTop + elem.offsetHeight / 2))
                location = 'before';
            // Otherwise, if mouse is over bottom half of element
            else if (originalEvent.pageY > (elem.offsetTop + elem.offsetHeight / 2))
                location = 'after';
        } else
            // This should be unreachable
            console.debug('Hmm... not within the element...');
        
        // Create new section
        section = newSection();
        
        // Add to page
        if (location === 'before')
            elem.parentElement.insertBefore(section, elem);
        else if (location === 'after')
            elem.parentElement.insertBefore(section, elem.nextElementSibling);
    },
    'dragenter main': function (event) {
        event.stopPropagation();
        
        // If there are no sections on the page, add section, otherwise ignore
        if (!document.querySelector('main > section'))
            document.querySelector('main').appendChild(newSection());
    }
});

// Bind section modifying events
Template.sectionAdmin.events({
    // Delete section
    'click button.section-delete': function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        // Call delete method
        Meteor.call('deleteSection', event.delegateTarget.dataset.id);
    },
    // Add or modify section name
    'change input.section-name': function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Capitalization rules
        var capitalize = function (name) {
            var word, exception, filename,
            
            // Find function for exception array
            find = function (element) {
                return filename[word].toLowerCase() === element;
            };
            
            // Mutual Suspicion
            name = '' + name;
            
            // Replace all concatenating symbols with a space, then convert to array
            filename = name.replace(/[-_+]/g, ' ').split(' ');
            
            // Capitalize words based on title rules
            for (word in filename) {
                if ( !filename.hasOwnProperty(word) ) continue;
                
                // Capitalize everything except articles, coordinating conjunctions, 
                // and prepositions
                exception = ['a', 'abaft', 'abeam', 'aboard', 'about', 'above', 'absent',  
                 'across', 'afore', 'after', 'against', 'along', 'alongside', 'amid', 'amidst', 
                 'among', 'amongst', 'an', 'anenst', 'apropos', 'apud', 'around', 'as', 'aside', 
                 'astride', 'at', 'athwart', 'atop', 'barring', 'before', 'behind', 'below', 
                 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'chez', 
                 'circa', 'c.', 'ca.', 'concerning', 'despite', 'down', 'during', 'except', 
                 'excluding', 'failing', 'following', 'for', 'forenenst', 'from', 'given', 'in', 
                 'including', 'inside', 'into', 'like', 'mid', 'midst', 'minus', 'modulo', 'near',
                 'next', 'notwithstanding', 'of', 'off', 'on', 'onto', 'opposite', 'out', 
                 'outside', 'over', 'pace', 'past', 'per', 'plus', 'pro', 'qua', 'regarding', 
                 'round', 'sans', 'save', 'since', 'than', 'through', 'thru', 'throughout', 
                 'thruout', 'till', 'times', 'to', 'toward', 'towards', 'under', 'underneath', 
                 'unlike', 'until', 'unto', 'up', 'upon', 'versus', 'vs.', 'v.', 'via', 'vice',  
                 'with', 'within', 'without', 'worth', 'and', 'the'].
                find(find);
                
                // If this isn't the first word, and it's an exception, keep lowercase
                // Note: Even though word contains the value of a number, its type is string
                if (parseInt(word) && exception)
                    continue;
                
                // Capitalize
                filename[word] = filename[word].charAt(0).toUpperCase() + filename[word].slice(1);
            }
            
            // Return capitalized filename
            return filename.join(' ');
        },
        
        // Lowercase for use as element ID
        anchor = function (name) {
            var removeName;
            
            // Mutual Suspicion
            name = '' + name;
            
            // Is the name an empty string?
            removeName = !name.length;
            
            // Make all lower case, then replace spaces with hyphens
            name = name.toLowerCase().trim().replace(' ', '-').
            
            // anchors can't begin with numbers
            replace(/^\d*/g, '');
            
            if (removeName || name.length > 0)
                return name;
                
            throw new Meteor.Error('Name cannot be all numbers.');
        },
        
        // Grep name from text field
        name = event.currentTarget.value;
        
        console.debug(event.delegateTarget.dataset.id, capitalize(name), anchor(name));
        // Now update section with new parameters
        Meteor.call('updateSection', event.delegateTarget.dataset.id, 
            capitalize(name), anchor(name));
    }
});

/**
 *  Polyfill for ECMAScript 6 Array.prototype.find Method
 *  Adapted from: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *    Reference/Global_Objects/Array/find}
 *  @method find
 *  @param {function} predicate - The method containing the find algorithm
 *  @returns {undefined}
 */
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null)
            throw new Meteor.Error('Array.prototype.find called on null or undefined');
        if (typeof predicate !== 'function')
            throw new Meteor.Error('predicate must be a function');
        
        var list = Object(this),
            length = list.length >>> 0,
            thisArg = arguments[1],
            value, i = 0;

        for (; i < length; ++i) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list))
                return value;
        }
        return undefined;
    };
}