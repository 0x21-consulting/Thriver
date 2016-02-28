// Utility Nav
Template.masthead.events({
    //Should be attributed to correct alert (Figured alerts would be managed via a meteor variable)
    'click .masthead .cta.providers': function (event) {
        alert('Scroll to Providers. Note error onClick as there are no "active" li or sidebars.');
        $('figure.alert').addClass('active').delay(5000).queue(function(){
            $(this).removeClass("active").dequeue();
        });
    }
});