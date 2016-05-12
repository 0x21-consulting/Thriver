//Remove Class by Prefix
function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}


//Off Canvas Effects
function toggleOffCanvas() {
    // Canvas Variables
    var eachToggle = document.querySelectorAll('.utilityNav > ul > li[data-sidebar]');
    var overlay = document.getElementById('overlay');
    var buttonParent = event.target.parentNode;
    var thisSidebarWidth = buttonParent.dataset.width;

    //Close open canvas elements if overlay or active li is clicked
    if(buttonParent.classList.contains('active') || event.target == overlay){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        document.body.classList.remove('canvasActive');
    }
    // Open Overlay and offCanvas elements if clicking inactive LI
    else if(buttonParent.hasAttribute('data-sidebar') && buttonParent.classList !== 'active'){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        buttonParent.classList.add('active');
        document.body.classList.add('canvasActive');    
        if(buttonParent.dataset.position == 'left'){
            document.body.classList.remove('canvasRight'); 
            document.body.classList.add('canvasLeft');  
        }
        if(buttonParent.dataset.position == 'right'){
            document.body.classList.remove('canvasLeft'); 
            document.body.classList.add('canvasRight');  
        }
        removeClassByPrefix(document.body, 'canvasW');
        document.body.classList.add('canvasW' + thisSidebarWidth);       
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



