// Subscriptions
Meteor.subscribe('site');

// Handle new section creation
newSection = function (sectionType, id) {
    var section = document.createElement('section'),
        oldSection = document.querySelector('.placeholder');
    
    // Mutual Suspician
    sectionType = '' + sectionType;
    
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
    
    // Create a section or a tab?
    switch (sectionType) {
        case 'tab':
            section.addEventListener('drop', newSectionTab(id));
            break;
        case 'section':
        default:
            section.addEventListener('drop', newPageSection);
    }
    
    // Return element
    return section;
},

// Create menu for new section 
newPageSection = function (event) {
    // Handle drop and template creation
    event.preventDefault();
    event.stopPropagation();
    
    var menu = document.createElement('menu'), // best semantically
        a, i = 0, j, templates,
    
    // Function for applying templates on click
    setTemplate = function (event) {
        var sections, index = i = 0, j,
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
                Meteor.call('updateSectionOrder', sections[index].dataset.id, index + 1);
            }
            
            // BUG: Order isn't reactive.  Reload as a work-around
            location.reload();
        });
    };
    
    // Get Templates
    templates = Site.findOne({},{ templates: 1 });
    if (templates)
        templates = templates.templates;
    
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
},

// Handle new tab creation
newSectionTab = function (id) {
    return function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        var placeholder = document.querySelector('.placeholder'),
            tabs = document.querySelectorAll('[data-id="' + id + '"] > menu li'),
            i = 0, j = tabs.length, index = 0;
        
        // Determine index of placeholder
        console.debug('ID', id);
        console.debug('Tabs', tabs);
        for (; i < j; ++i)
            if (tabs[i] === placeholder)
                index = i;
        
        console.debug('index', index);
        ++index;
        
        // Remove placeholder
        placeholder.remove();
        
        // Add new tab
        Meteor.call('addTab', id, index);
        
        // Update order
        for (; index < j; ++index) {
            console.debug(index, tabs[index].dataset.id);
            Meteor.call('updateTabOrder', tabs[index].dataset.id, index + 1);
        }
        
        // BUG: Order isn't reactive.  Reload as a work-around
        //location.reload();
    }
};
/*
// Bind drag and drop events for adding new sections
Template.body.events({
    // Drop before or after section element
    'dragenter main > section': function (event) {
        event.stopPropagation();
        
        var originalEvent = event.originalEvent,
            elem          = event.currentTarget,
            location      = '', 
           
        // Create new section 
        section = newSection('section');
        
        // Check bounds
        if (originalEvent.pageY > elem.offsetTop && originalEvent.pageY < 
            (elem.offsetTop + elem.offsetHeight)) {
                
            // If mouse is over top half of element
            if (originalEvent.pageY < (elem.offsetTop + elem.offsetHeight / 2))
                location = 'before';
            // Otherwise, if mouse is over bottom half of element
            else if (originalEvent.pageY > (elem.offsetTop + elem.offsetHeight / 2))
                location = 'after';
        }
        
        // Add to page
        if (location === 'before')
            elem.parentElement.insertBefore(section, elem);
        else
            elem.parentElement.insertBefore(section, elem.nextElementSibling);
    },
    // For adding new sections when none currently exist
    'dragenter main': function (event) {
        event.stopPropagation();
        
        // If there are no sections on the page, add section, otherwise ignore
        if (!document.querySelector('main > section'))
            document.querySelector('main').appendChild(newSection());
    },
    // For adding new tabs
    // Drop before or after menu items
    'dragenter menu.tabs li': function (event) {
        event.stopPropagation();
        
        var originalEvent = event.originalEvent,
            elem     = event.currentTarget,
            parent   = elem.parentElement.parentElement.parentElement,
            location = '',
            
        // Create new tab using proper parent section's ID
        section = newSection('tab', parent.dataset.id);
        
        // Check bounds
        if (originalEvent.pageY > elem.offsetTop && originalEvent.pageY < 
            (elem.offsetTop + elem.offsetHeight)) {
                
            // If mouse is over top half of element
            if (originalEvent.pageY < (elem.offsetTop + elem.offsetHeight / 2))
                location = 'before';
            // Otherwise, if mouse is over bottom half of element
            else if (originalEvent.pageY > (elem.offsetTop + elem.offsetHeight / 2))
                location = 'after';
        }
        
        // Add to page
        // TODO: This technically breaks HTML standards!!!
        if (location === 'before')
            elem.parentElement.insertBefore(section, elem);
        else
            elem.parentElement.insertBefore(section, elem.nextElementSibling);
    },
    // For adding new tabs when none currently exist
    'dragenter menu.tabs': function (event) {
        event.stopPropagation();
        
        var elem = event.currentTarget,
            id   = elem.parentElement.dataset.id;
        
        // If there are no tabs in a section, add section, otherwise ignore
        if (!elem.querySelector('li'))
            // TODO: This technically breaks HTML standards!!!
            elem.querySelector('ul').appendChild(newSection('tab', id));
    },
});
*/