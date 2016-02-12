if (Meteor.isClient) {
    Template.alert.events({
        'click span.closeAlert': function (event) {
            document.getElementById('alert').classList.remove("active");
        }
    });
}

