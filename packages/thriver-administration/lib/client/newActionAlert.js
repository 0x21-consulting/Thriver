'use strict';

Template.admin.events({
    /**
     * Bind new action alert to button
     * @method
     *   @param {$.Event} event
     */
    'click #newActionAlert': function (event) {
        var newAlert = document.createElement('aside'),
            button   = document.createElement('button'),
            i, j, field, label,
            fields   = [
                { element: 'input',    name: 'title',    label: 'Title'   },
                { element: 'textarea', name: 'content',  label: 'Content' },
                { element: 'input',    name: 'masthead', label: 'Replace Masthead?', type: 'checkbox' }
            ];
        
        // Create each field
        for (i = 0, j = fields.length; i < j; ++i) {
            // Element
            field = document.createElement(fields[i].element);
            field.name = fields[i].name;
            
            // Input types
            if (fields[i].element === 'input')
                field.type = fields[i].type? fields[i].type : 'text';
            
            // Label
            label = document.createElement('label');
            label.textContent = fields[i].label;
            label.appendChild(field);
            
            newAlert.appendChild(label);
        }
        
        // Button click
        button.textContent = 'Add action alert';
        button.addEventListener('click', function (event) {
            event.preventDefault(); event.stopPropagation();
            
            // Get element values
            var parent  = event.path[1],
                title   = parent.querySelector('[name="title"]').value,
                date    = new Date(),
                content = parent.querySelector('[name="content"]').value,
                checked = parent.querySelector('[name="masthead"]');
            
            // Add action alert
            Meteor.call('addActionAlert', title, date, content);
            
            // Replace masthead
            if (checked)
                ; // todo
            
            // Remove form
            document.body.removeChild(parent);
        });
        newAlert.appendChild(button);
        
        // Add to page
        newAlert.classList.add('adminAside');
        document.body.appendChild(newAlert);
    }
});