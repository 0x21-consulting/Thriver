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
    }
    
});