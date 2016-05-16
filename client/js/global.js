//////// Helpers ////////

//Spacebars Helpers
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

//UI Helpers
//Add Class
function addClass(e, cls){
    e.classList.add(cls);
}
//Remove Class
function removeClass(e, cls){
    e.classList.remove(cls);
}

//Remove Class (by Prefix)
function removeClassByPrefix(e, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    e.className = e.className.replace(regx, '');
    return e;
}

function hidden(e,state){
    if (state == false){
        e.setAttribute('aria-hidden', 'false');
    } else{
        e.setAttribute('aria-hidden', 'true');      
    }
}

function active(e,state){
    if(state == true){
        e.setAttribute('aria-expanded','true');
    } else{
        e.setAttribute('aria-expanded','false');        
    }
}


//////// Systems ////////

///// Focus Groups
// Focusable Variables
var focusable ='a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
var globalFocusGroup = $('[data-focus="global"]').find(focusable);
var focusGlobalElFirst = globalFocusGroup[0];
var focusGlobalElLast = globalFocusGroup[globalFocusGroup.length-1];
var activeFocusGroup = $('[aria-hidden="false"][data-focus="group"]').find(focusable);
var focusGroupElFirst = activeFocusGroup[0];
var focusGroupElLast = activeFocusGroup[activeFocusGroup.length - 1];

//Redundant with above
function currentFocusGroup(){
    focusable ='a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
    globalFocusGroup = $('[data-focus="global"]').find(focusable);
    focusGlobalElFirst = globalFocusGroup[0];
    focusGlobalElLast = globalFocusGroup[globalFocusGroup.length-1];
    activeFocusGroup = $('[aria-hidden="false"][data-focus="group"]').find(focusable);
    focusGroupElFirst = activeFocusGroup[0];
    focusGroupElLast = activeFocusGroup[activeFocusGroup.length - 1];
    console.log(focusGroupElFirst);
    console.log(focusGroupElLast);
    console.log(focusGlobalElFirst);
    console.log(focusGlobalElLast);
}
currentFocusGroup();

//Focus Groups Events
var resetFocus = false;
var focusToGroup = false;
var topFocus = false;
//This only works if the tab key alone is being used.
$("body").on("keydown", function(event) {
    if(event.keyCode == 9){
        var active;
        active = document.activeElement; 
        console.log(active);
        if($(active).is(focusGroupElLast)){ resetFocus = true; } // :focusable
        if($(active).is(focusGlobalElLast)){ focusToGroup = true; } // :focusable
        if($(active).is(focusGroupElFirst)){ topFocus = true; } // :focusable
        if(!event.shiftKey){
            topFocus = false;
            if(resetFocus == true){
                focusGlobalElFirst.focus();
                resetFocus = false;
                event.preventDefault();
            } 
            if(focusToGroup == true){
                focusGroupElFirst.focus();
                focusToGroup = false;
                event.preventDefault();
            }
        }
        if(event.shiftKey){
            resetFocus = false;
            focusToGroup = false;
            if(topFocus == true){
                focusGlobalElLast.focus();
                topFocus = false;
                event.preventDefault();
            }
        }
    }
});


//// Canvas States

function clearCanvas(){
    document.body.classList.remove('noScroll');
    var canvas = document.getElementById('canvas');
    canvas.setAttribute('data-canvas-position','');
    canvas.setAttribute('data-canvas-state','closed');
    canvas.setAttribute('data-canvas-width','');
}
//event.target function fires on click events of any element containing the data-attribute, "data-sidebar".
function toggleCanvas() {
    // Canvas Variables
    var toggle = document.querySelectorAll('[aria-controls]');
    var overlay = document.getElementById('overlay');
    var sidebar = document.querySelectorAll('section.sidebar');
    var canvas = document.getElementById('canvas');

    //Close open canvas elements if overlay or active li is clicked. Or if close canvas event fired
    if(event.target.getAttribute('aria-expanded') == 'true' || event.target == overlay || event.target.getAttribute('data-canvas-event') == 'close'){
        for (var i = 0, e; e = toggle[i]; i++) { active(e,false); } //Remove current toggle active states
        for (var i = 0, e; e = sidebar[i]; i++) { hidden(e,true); } //Clear all active Sidebars
        clearCanvas(); //Remove all canvas effect classes
        hidden(overlay,true);
        focusGlobalElFirst.focus();
    }

    // Open Overlay and offCanvas elements if clicking inactive list item
    else if(event.target.hasAttribute('aria-controls') && event.target.getAttribute('aria-expanded') == 'false'){
        clearCanvas();
        document.body.classList.add('noScroll');
        canvas.setAttribute('data-canvas-state','open'); //Add master canvas effect class
        hidden(overlay,false);
        for (var i = 0, e; e = toggle[i]; i++) { active(e,false); } //Clear all active toggles
        active(event.target,true); //Add active class to clicked element
        //Sets values based on the parameters of the current sidebar
        for (var i = 0, e; e = sidebar[i]; i++) {
            hidden(e,true); //Clear all active sidebars
            if ('#' + e.getAttribute('id') == event.target.getAttribute('aria-controls')){ //If Sidebar ID matches toggles' data-sidebar
                hidden(e,false); //Add active class to given sidebar
                canvas.setAttribute('data-canvas-width',e.dataset.width); //Add new sidebar-width effect class 
                if(e.dataset.position == 'left'){ canvas.setAttribute('data-canvas-position','left'); }
                if(e.dataset.position == 'right'){ canvas.setAttribute('data-canvas-position','right'); }
            }
            //focusGroupElFirst.focus();
            event.preventDefault();
        }
        currentFocusGroup(); //Recalculate live focus areas
        focusGroupElFirst.focus();
    }
    currentFocusGroup(); //Recalculate live focus areas
}

Template.body.events({
    //Canvas Actions
    'click [aria-controls]': function (event) { toggleCanvas(); },
    'click .overlay': function (event) { toggleCanvas(); },
    'click .closeTab': function (event) { toggleCanvas(); }
    //'keyup': function (event) { tabAction(); } //This is ideal over jQuery bit above
});