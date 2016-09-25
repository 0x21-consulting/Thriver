// Bind section modifying events
Template.sectionAdmin.events({
    /**
     * @summary Modify Section name, which also creates section ID
     * @method
     *   @param {$.Event} event
     */
    'change input.section-name': function (event) {
        check(event, $.Event);

        event.preventDefault();
        event.stopPropagation();
        
        // Capitalization rules
        var capitalize = function (name) {
            check(name, Match.Maybe(String) );

            var word, exception, filename,
            
            // Find function for exception array
            find = function (element) {
                return filename[word].toLowerCase() === element;
            };
            
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
    }
});
