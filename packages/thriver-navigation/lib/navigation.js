/**
 * @summary Main-level navigation
 * @function
 */
Template.navigation.helpers({
    sections: function () {
        var sections = Thriver.sections.get();
        return sections;
    }
});
