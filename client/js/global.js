//Spacebars Helpers
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

//UI Helpers
//Add Class
function addClass(el, cls){
    el.classList.add(cls);
}
//Remove Class
function removeClass(el, cls){
    el.classList.remove(cls);
}

function activeSwitch(el, state){
    el.dataset.active = state;
}
//Remove Class (by Prefix)
function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}

//Functions
//Off Canvas Effects
//event.target function fires on click events of any element containing the data-attribute, "data-sidebar".
function toggleCanvas() {

    // Canvas Variables
    var toggle = document.querySelectorAll('[data-sidebar]');
    var overlay = document.getElementById('overlay');
    var sidebar = document.querySelectorAll('section.sidebar');
    var body = document.body;

    //Close open canvas elements if overlay or active li is clicked
    if(event.target.dataset.active == 'true' || event.target == overlay || event.target.classList.contains('closeTab')){
        for (var i = 0, e; e = toggle[i]; i++) { activeSwitch(e,'false'); } //Clear all active Toggles
        for (var i = 0, e; e = sidebar[i]; i++) { activeSwitch(e,'false'); } //Clear all active Sidebars
        removeClassByPrefix(body, "canvas"); //Remove all canvas effect classes
        overlay.setAttribute('aria-hidden', 'true'); //toggle aria-hidden
    }

    // Open Overlay and offCanvas elements if clicking inactive list item
    else if(event.target.hasAttribute('data-sidebar') && event.target.dataset.active == 'false'){
        removeClassByPrefix(body, 'canvasW'); //Remove any currently active sidebar-width effect classes
        addClass(body,'canvasActive'); //Add master canvas effect class
        overlay.setAttribute('aria-hidden', 'false'); //toggle aria-hidden
        for (var i = 0, e; e = toggle[i]; i++) { activeSwitch(e,'false'); } //Clear all active toggles
        activeSwitch(event.target,'true'); //Add active class to clicked element
        //Sets values based on the parameters of the current sidebar
        for (var i = 0, e; e = sidebar[i]; i++) {
            activeSwitch(e,'false');; //Clear all active sidebars
            if (e.getAttribute('id') == event.target.dataset.sidebar){ //If Sidebar ID matches toggles' data-sidebar
                activeSwitch(e,'true'); //Add active class to given sidebar
                addClass(body,'canvasW' + e.dataset.width); //Add new sidebar-width effect class 
                if(e.dataset.position == 'left'){ // Add/Remove left/right
                    removeClass(body,'canvasRight');
                    addClass(body,'canvasLeft');
                }
                if(e.dataset.position == 'right'){ // Add/Remove right/left
                    body.classList.remove('canvasLeft'); 
                    body.classList.add('canvasRight');  
                }
            }
        }
    }
}

Template.body.events({
    //Canvas Actions
    'click [data-sidebar]': function (event) { toggleCanvas(); },
    'click .overlay': function (event) { toggleCanvas(); },
    'click .closeTab': function (event) { toggleCanvas(); }
});


Template.body.onRendered(function () {
    //Init Custom Scrollbars
    //SimpleScrollbar.initAll();
});



