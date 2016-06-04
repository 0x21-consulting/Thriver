//more.js controls display events for elements containing details/more. Via hover or click.
Meteor.moreFunctions = {
    toggleMore : function(){
        var parent = findAncestor(event.target, 'more');
        var e = parent.getElementsByTagName('figure')[0];
        if (event.target.getAttribute('aria-expanded') == 'false'){ 
            active(event.target,true);
            hidden(e,false);
        } else{ 
            event.target.setAttribute('aria-expanded', 'false');
            active(event.target,false);
            hidden(e,true);
        }
    }
}
//Define usage
m = Meteor.moreFunctions;

Template.body.events({
    //'More' Hovers
    'mouseenter li.more > a': function (event) { m.toggleMore(); },
    'mouseleave li.more > a': function (event) { m.toggleMore(); }
});