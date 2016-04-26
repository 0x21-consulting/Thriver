/**
 * @summary Main-level navigation
 * @function
 */
Template.mainNav.helpers({
    sections: function () {
        var sections = Thriver.sections.get();
        return sections;
    }
});
