// Bind section modifying events
Template.sectionAdmin.events({
  /**
   * @summary Modify Section name, which also creates section ID
   * @method
   *   @param {$.Event} event
   */
  'change input.section-name': (event) => {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Capitalization rules
    const capitalize = (name) => {
      check(name, Match.Maybe(String));

      // Replace all concatenating symbols with a space, then convert to array
      const title = name.replace(/[-_+]/g, ' ').split(' ');
      const newTitle = [];

      // Capitalize words based on title rules
      title.forEach((word, index) => {
        // Capitalize everything except articles, coordinating conjunctions,
        // and prepositions
        const specialCase = ['a', 'abaft', 'abeam', 'aboard', 'about', 'above', 'absent',
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
          'with', 'within', 'without', 'worth', 'and', 'the']
          .find(element => word.toLowerCase() === element);

        // If this isn't the first word, and it's a specialCase, keep lowercase
        // Note: Even though word contains the value of a number, its type is string
        if (index && specialCase) return;

        newTitle.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      });

      // Return capitalized filename
      return newTitle.join(' ');
    };

    // Grep name from text field
    const name = event.currentTarget.value;

    // Now update section with new parameters
    Meteor.call('updateSectionName', event.delegateTarget.dataset.id, capitalize(name));
  },
});
