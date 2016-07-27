//Actions are initiated by 'data-action' attributes on elements.
//By applying specific 'data-action' attributes to elements, global app events may occur.
Template.body.events({
    //Sign Out [data-action=signout]
    'click [data-action="signout"]': function (event) {
        c.clearCanvas();
        event.preventDefault(); event.stopPropagation();
        Meteor.logout(function (error) {
            if (error instanceof Error)
                console.error(error);
        })
    },
    'click [data-action="userRegister"]': function (event) {
        document.querySelector('#utility [href="#register"]').click();
    },
    'click [data-action="signin"]': function (event) {
        document.querySelector('#utility [href="#signin"]').click();
    },
    'click [data-action="manageSubscription"]': function (event) {
        document.querySelector('#utility [href="#accounts"]').click();
        document.querySelector('#accounts [href="#subscriptions"]').click();
    }
});
