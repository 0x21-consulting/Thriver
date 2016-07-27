//UI Helper Functions
Meteor.helperFunctions = {
    //Add Class
    addClass : function(e, cls){
        e.classList.add(cls);
    },
    //Remove Class
    removeClass : function(e, cls){
        e.classList.remove(cls);
    },
    //Remove Class (by Prefix)
    removeClassByPrefix : function(e, prefix) {
        var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        e.className = e.className.replace(regx, '');
        return e;
    },
    hidden : function(e,state){
        if (state == false){
            e.setAttribute('aria-hidden', 'false');
        } else{
            e.setAttribute('aria-hidden', 'true');      
        }
    },
    active : function(e,state){
        if(state == true){
            e.setAttribute('aria-expanded','true');
        } else{
            e.setAttribute('aria-expanded','false');        
        }
    },
    findAncestor : function(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }
}

//Define usage
h = Meteor.helperFunctions;