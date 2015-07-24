// Section content editing
// Keep ID in scope
var edit = function (id) {
    return function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        var content = this.textContent.trim();
        
        // If the content is different than prior, update section
        //if (this.dataset.originalContent !== this.textContent.trim()) {
        if (this.dataset.content !== content) {
            console.debug('Original:', this.dataset.content);
            console.debug('New:', content);
            this.innerHTML = '';
            Meteor.call('updateSectionContent', id, content);
        }
        
        // Restore element
        this.innerHTML = marked(this.dataset.content);
        //this.dataset.originalContent = null;
        this.contentEditable = false;
    };
},

// Tab name editing
// Keep ID in scope
editTab = function (id) {
    return function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        var name = this.textContent.trim();
        
        // If the content is different than prior, update tab name
        if (this.dataset.content !== name) {
            this.textContent = '';
            Meteor.call('updateTabName', id, name);
        }
        
        // Restore element
        this.dataset.content = '';
        this.contentEditable = false;
    };
};

// Bind section modifying events
Template.sectionAdmin.events({
    // Edit section content
    'click button.section-edit': function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        var parent = event.delegateTarget,
            that   = parent.querySelector(':scope > .content'),
            those  = parent.querySelectorAll(':scope menu.tabs li'),
            i = 0, j = those.length;
        
        if (that) {
            // Main content section
            that.addEventListener('blur', edit(parent.dataset.id) );
            
            // Replace content with markdown
            that.textContent = that.dataset.content;
            
            // Make section editable
            that.contentEditable = 'true';
            
            // Focus editable element
            that.focus();
        }
        
        for (; i < j; ++i) {
            that = those[i];
            
            // Copy text content to dataset to check if there was any change
            that.dataset.content = that.textContent.trim();
            
            // Make section editable
            that.contentEditable = 'true';
            
            // Bind edit handler
            that.addEventListener('blur', editTab(that.dataset.id) );
        }
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
        
        // Grep name from text field
        name = event.currentTarget.value;
        
        // Now update section with new parameters
        Meteor.call('updateSectionName', event.delegateTarget.dataset.id, 
            capitalize(name));
            
        // BUG: Reactivity doesn't keep proper order
        location.reload();
    }
});