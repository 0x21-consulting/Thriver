// Pass to header template for menu
Template.mainNav.helpers({
    sections: function () {
        return Sections.find({ displayOnPage: true, name: { $nin: [null, ''] } });
    }
});
