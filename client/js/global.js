
//Off Canvas Effects
function toggleOffCanvas() {
    // Canvas Variables
    var eachToggle = document.querySelectorAll('.utilityNav > ul > li[data-width]');
    var overlay = document.getElementById('overlay');
    var buttonParent = event.target.parentNode;
    var thisSidebarWidth = buttonParent.dataset.width;

    //Close open canvas elements if overlay or active li is clicked
    if(buttonParent.classList.contains('active') || event.target == overlay){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        document.body.classList.remove('offCanvasActive');
    }
    // Open Overlay and offCanvas elements if clicking inactive LI
    else if(buttonParent.hasAttribute('data-width') && buttonParent.classList !== 'active'){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        buttonParent.classList.add('active');
        document.body.classList.add('offCanvasActive');    
        if(buttonParent.dataset.position == 'left'){
            document.body.classList.add('offCanvasLeft');  
        }
        if(buttonParent.dataset.position == 'right'){
            document.body.classList.add('offCanvasRight');  
        }
        document.body.classList.add('offCanvasWidth' + thisSidebarWidth);       
    }
}

Template.body.events({
    //Canvas Actions
    'click .utilityNav > ul > li[data-width] button': function (event) {
        toggleOffCanvas();
    },
    'click .overlay': function (event) {
        toggleOffCanvas();
    }
});