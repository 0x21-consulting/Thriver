//more.js controls display events for elements containing details/more. Via hover or click.
var more = {
    toggleMore : function(){
        var parent = Thriver.util.findAncestor(event.target, 'more');
        var e = parent.getElementsByTagName('figure')[0];
        if (event.target.getAttribute('aria-expanded') == 'false'){
            Thriver.util.makeActive(event.target,true);
            Thriver.util.hide(e,false);
        } else{
            event.target.setAttribute('aria-expanded', 'false');
            Thriver.util.makeActive(event.target,false);
            Thriver.util.hide(e,true);
        }
    }
}
//Define usage
//m = Meteor.moreFunctions;

Template.body.events({
    //'More' Hovers
    'mouseenter li.more > a': function (event) {
        if (window.innerWidth > 767) {
            more.toggleMore();
        }
    },
    'mouseleave li.more > a': function (event) {
        if (window.innerWidth > 767) {
            more.toggleMore();
        }
     }
});
