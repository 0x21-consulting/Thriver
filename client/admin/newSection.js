// Handle new section creation
var newSection = function () {
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