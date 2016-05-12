//Helpers
//Class Control
//Add Class
function addClass(el, cls){
    el.classList.add(cls);
}
//Remove Class
function removeClass(el, cls){
    el.classList.remove(cls);
}
//Remove Class (by Prefix)
function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}


//Off Canvas Effects
//This function fires on click events of any element containing the data-attribute, "data-sidebar".
function toggleOffCanvas() {
    // Canvas Variables
    var eachToggle = document.querySelectorAll('li[data-sidebar]');
    var overlay = document.getElementById('overlay');
    var buttonParent = event.target.parentNode;
    var thisSidebarWidth = buttonParent.dataset.width;
    var body = document.body;

    //Close open canvas elements if overlay or active li is clicked
    if(buttonParent.classList.contains('active') || event.target == overlay){
        //Remove any active classes on data-sidebar elements
        for (var i = 0, element; element = eachToggle[i]; i++) { removeClass(element,'active'); }
        //Remove all canvas effect classes
        removeClassByPrefix(body, "canvas");
    }

    // Open Overlay and offCanvas elements if clicking inactive list item
    else if(buttonParent.hasAttribute('data-sidebar') && buttonParent.classList !== 'active'){
        //Remove any currently active data-sidebar toggles
        for (var i = 0, element; element = eachToggle[i]; i++) { removeClass(element,'active'); }
        //Add active class to currently clicked item
        addClass(buttonParent,'active');
        //Add master canvas effect class
        addClass(body,'canvasActive');
        // Add/Remove left/right
        if(buttonParent.dataset.position == 'left'){
            removeClass(body,'canvasRight');
            addClass(body,'canvasLeft');
        }
        // Add/Remove right/left
        if(buttonParent.dataset.position == 'right'){
            body.classList.remove('canvasLeft'); 
            body.classList.add('canvasRight');  
        }
        //Remove any currently active sidebar-width effect classes
        removeClassByPrefix(document.body, 'canvasW');
        //Add new sidebar-width effect class
        addClass(body,'canvasW' + thisSidebarWidth);       
    }
}


Template.body.events({
    //Canvas Actions
    'click .utilityNav > ul > li[data-sidebar] button': function (event) {
        toggleOffCanvas();
    },
    'click .overlay': function (event) {
        toggleOffCanvas();
    }
});



