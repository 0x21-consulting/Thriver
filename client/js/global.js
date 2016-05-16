
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




//Focus Trigger Functions
//Needs written work, however function events occur flawlessly
/*var resetFocus = false;
var startGlobalFocus = document.getElementById('focus0');
var endGlobalFocus = document.getElementById('focus0end');
$("body").on("keydown", function(event) {
    if(event.keyCode == 9){
        var active;
        active = document.activeElement; 
        if(resetFocus == true){
            //active.blur();
            document.getElementById('focus0').focus();
            resetFocus = false;
            event.preventDefault();

        } 
        if(active.getAttribute('id') == 'focus0end'){
            //alert('end');
            var sidebarSections = document.querySelectorAll('section.sidebar');
            for (var i = 0, e; e = sidebarSections[i]; i++) { 
                if (e.dataset.active == 'true'){
                    //alert('derp');
                    //document.getElementById('focus0').focus();
                    $('#' + e.id + " [data-focus=head]").focus();
                    event.preventDefault();
                }
            }
        }
        if(active.dataset.focus == 'reset'){
            resetFocus = true;
        }
    }
});*/

/*
focusableEls = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
nonFocusableEls '[tabindex=-1], [disabled], :hidden';
focusable = $(focusableEls:not(nonFocusableEls));
focusGroup= $()

focusGroups = querySelectorAll('[data-focus]');
for (var i = 0, e; e = focusGroups[i]; i++) {
    e.querySelectorAll(this.id + " > .foo");

for (var i = 0, e; e = focusable[i]; i++) { 
//Focus Trigger Functions
//The selector, ":focusable" is derivative of the library: focusable.js
var resetFocus = false;
var focusToGroup = false;
$("body").on("keydown", function(event) {
    if(event.keyCode == 9){
        var active;
        active = document.activeElement; 
        if(resetFocus == true){
            $("[data-focus=global] :focusable:first-of-type").focus();
            resetFocus = false;
            event.preventDefault();
        } 
        if(focusToGroup == true){
            $("[data-focus=group][data-active=true] :focusable:first-of-type").focus();
            focusToGroup = false;
            event.preventDefault();
        }
        if(active == $("[data-focus=global] :focusable:last-of-type")){ focusToGroup = true; }
        if(active == $("[data-focus=group] :focusable:last-of-type")){ resetFocus = true; }
    }
});



        var sidebarSections = document.querySelectorAll('section.sidebar');
        for (var i = 0, e; e = sidebarSections[i]; i++) { 
            if (e.dataset.active == 'true'){
                $('#' + e.id + " [data-focus=group] :focusable:first-of-type").focus();
                event.preventDefault();
            }
        }

*/

function clearCanvas(){
    document.body.classList.remove('noScroll');
    var canvas = document.getElementById('canvas');
    canvas.setAttribute('data-canvas-position','');
    canvas.setAttribute('data-canvas-state','closed');
    canvas.setAttribute('data-canvas-width','');
}

//Off Canvas Effects
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
        //NEED TO FOCUS: document.getElementById('focus0').focus();
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
                //focusTrap.activate(e); //Pauses Focus to Group
                canvas.setAttribute('data-canvas-width',e.dataset.width); //Add new sidebar-width effect class 
                if(e.dataset.position == 'left'){ canvas.setAttribute('data-canvas-position','left'); }
                if(e.dataset.position == 'right'){ canvas.setAttribute('data-canvas-position','right'); }
            }
            //NEED TO FOCUS: $('#' + e.id + " [data-focus=head]").focus();
            event.preventDefault();
        }
    }
}

Template.body.events({
    //Canvas Actions
    'click [aria-controls]': function (event) { toggleCanvas(); },
    'click .overlay': function (event) { toggleCanvas(); },
    'click .closeTab': function (event) { toggleCanvas(); }
    //'keyup': function (event) { tabAction(); } //This is ideal over jQuery bit above
});