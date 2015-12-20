if (Meteor.isClient) {
    Template.donate.onRendered(function () {
        $('form .custom').click(function(){
            $('.customAmt').focus();
        });
    });
}