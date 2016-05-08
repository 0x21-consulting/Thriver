
//Off Canvas Effects
function toggleOffCanvas() {
    // Canvas Variables
    var eachToggle = document.querySelectorAll('.utilityNav > ul > li[data-sidebar]');
    var canvas = document.getElementById('canvas');
    var overlay = document.getElementById('overlay');

    //Close Canvas Elements if Overlay or active LI is clicked
    var buttonParent = event.target.parentNode;
    if(buttonParent.classList.contains('active') || event.target == overlay){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        document.body.classList.remove('offCanvasActive');
    }
    // Open Overlay and offCanvas elements if clicking inactive LI
    else if(buttonParent.hasAttribute('data-sidebar') && buttonParent.classList !== 'active'){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        buttonParent.classList.add('active');
        document.body.classList.add('offCanvasActive');        
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