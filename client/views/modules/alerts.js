if (Meteor.isClient) {
    Template.alerts.events({
        'click span.closeAlert': function (event) {
            document.getElementById('alert').classList.remove("active");
        }
    });
}

