//Focus.js controls our focus group functions.
//This is responsible for controling user-focusable areas based on user-interaction

// Focusable Variables
focusable ='a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
globalFocusGroup = $('[data-focus="global"]').find(focusable);
focusGlobalElFirst = globalFocusGroup[0];
focusGlobalElLast = globalFocusGroup[globalFocusGroup.length-1];
activeFocusGroup = $('[aria-hidden="false"][data-focus="group"]').find(focusable);
focusGroupElFirst = activeFocusGroup[0];
focusGroupElLast = activeFocusGroup[activeFocusGroup.length - 1];

Meteor.focusFunctions = {
	//Redundant with above
	currentFocusGroup : function(){
	    focusable ='a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
	    globalFocusGroup = $('[data-focus="global"]').find(focusable);
	    focusGlobalElFirst = globalFocusGroup[0];
	    focusGlobalElLast = globalFocusGroup[globalFocusGroup.length-1];
	    activeFocusGroup = $('[aria-hidden="false"][data-focus="group"]').find(focusable);
	    focusGroupElFirst = activeFocusGroup[0];
	    focusGroupElLast = activeFocusGroup[activeFocusGroup.length - 1];
	}
}
//Define Usage
f = Meteor.focusFunctions;

f.currentFocusGroup();

//Focus Groups Events
var resetFocus = false;
var focusToGroup = false;
var topFocus = false;
//This only works if the tab key alone is being used.
$("body").on("keydown", function(event) {
    console.log('k');
   /* if(event.keyCode == 9){
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
    }*/
});