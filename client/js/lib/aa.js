//Spacebars helpers for particular template actions/controls
//////// Helpers ////////

//Spacebars Helpers
//Value equals
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

//Value equals or...
Template.registerHelper("equals_or", function(param, arr) {
    arr = arr.split(",");
    if (arr.indexOf(param) !== -1) {
        return true;
    } else {
        return false;
    }
});

Meteor.myFunctions = {
    //Add Class
    makeBoard : function addClass(e, cls){
        e.classList.add(cls);
    },
    //Remove Class
    makeBoard : function removeClass(e, cls){
        e.classList.remove(cls);
    },
    //Remove Class
    makeBoard : function removeClass(e, cls){
        e.classList.remove(cls);
    },
    //Remove Class (by Prefix)
    makeBoard : function removeClassByPrefix(e, prefix) {
        var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        e.className = e.className.replace(regx, '');
        return e;
    },
    makeBoard : function hidden(e,state){
        if (state == false){
            e.setAttribute('aria-hidden', 'false');
        } else{
            e.setAttribute('aria-hidden', 'true');      
        }
    },
    makeBoard : function active(e,state){
        if(state == true){
            e.setAttribute('aria-expanded','true');
        } else{
            e.setAttribute('aria-expanded','false');        
        }
    },
    makeBoard : function findAncestor (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }
}