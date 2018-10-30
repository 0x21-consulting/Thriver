import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.admin.events({
  /**
   * Bind new action alert to button
   * @method
   */
  'click #newActionAlert': () => {
    const newAlert = document.createElement('aside');
    const button = document.createElement('button');

    let field;
    let label;

    const fields = [
      { element: 'input', name: 'title', label: 'Title' },
      { element: 'textarea', name: 'content', label: 'Content' },
      {
        element: 'input',
        name: 'masthead',
        label: 'Replace Masthead?',
        type: 'checkbox',
      },
    ];

    // Create each field
    for (let i = 0; i < fields.length; i += 1) {
      // Element
      field = document.createElement(fields[i].element);
      field.name = fields[i].name;

      // Input types
      if (fields[i].element === 'input') {
        field.type = fields[i].type ? fields[i].type : 'text';
      }

      // Label
      label = document.createElement('label');
      label.textContent = fields[i].label;
      label.appendChild(field);

      newAlert.appendChild(label);
    }

    // Button click
    button.textContent = 'Add action alert';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Get element values
      const parent = event.path[1];
      const title = parent.querySelector('[name="title"]').value;
      const date = new Date();
      const content = parent.querySelector('[name="content"]').value;
      const checked = parent.querySelector('[name="masthead"]');

      // Add action alert
      Meteor.call('addActionAlert', title, date, content);

      // Replace masthead
      if (checked) ; // TODO(micchickenburger): Allow action alert addition to update masthead

      // Remove form
      document.body.removeChild(parent);
    });
    newAlert.appendChild(button);

    // Add to page
    newAlert.classList.add('adminAside');
    document.body.appendChild(newAlert);
  },
});
