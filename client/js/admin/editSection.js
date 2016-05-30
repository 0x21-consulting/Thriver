// Section content editing
// Keep ID in scope
var edit = function (id, textarea) {
    return function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        var parent = this.parentElement,
            content = toMarkdown(textarea.value.//innerHTML.
            replace(/\n/gm, '<br>').                    // preserve new lines
            replace(/<(\/)?(div|span).*?>/gmi,'<$1p>'). // toss div and span elements
            replace(/<script.+?<\/script>/gmi, ''));    // no scripts!
        console.debug(textarea.value);
        console.debug(content);
        // If the content is different than prior, update section
        if (parent.dataset.content !== content) {
            console.info('Content is different.');
            
            // Update content in db
            Meteor.call('updateSectionContent', id, content);
            
            // Meteor is not reactive enough grr
            parent.dataset.content = content;
        }
        
        // Restore element
        var text = marked(parent.dataset.content);
        parent.innerHTML = text;
        
        // Should no longer be editable
        //this.contentEditable = false;
        //this.style.whiteSpace = 'inherit';
        
        // removeEventListener doesn't work for some reason,
        // so just replace the element with its clone
        parent.parentElement.replaceChild(parent.cloneNode(true), parent);
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
            i = 0, j = those.length,
            // New elements
            textarea = document.createElement('textarea'),
            save = document.createElement('button');
        
        // Use a textfield method
        if (that) {
            // Save button attributes
            save.textContent = 'Save';
            save.addEventListener('click', edit(parent.dataset.id, textarea) );
            
            // Text field attributes
            textarea.textContent = that.dataset.content;
            
            // Display stuff
            that.innerHTML = '';
            that.appendChild(textarea);
            that.appendChild(save);
            
            // Focus textfield
            textarea.focus();            
        }
        
        // Traditional content-editable method
        /*if (that) {
            // Main content section
            that.addEventListener('blur', edit(parent.dataset.id) );
            
            // Replace content with markdown
            that.style.whiteSpace = 'pre-line'; // preserve newlines
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
        }*/
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