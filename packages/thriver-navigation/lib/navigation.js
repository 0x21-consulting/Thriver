/**
 * @summary Main-level navigation
 * @function
 */

mainNavigationHelpers = {
    sections: function () {
        var sections = Thriver.sections.get();
        return sections;
    }
};

Template.navigation.helpers(mainNavigationHelpers);
