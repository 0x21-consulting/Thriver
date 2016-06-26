//tabs.js are the events and functions associated with UI tabs.
Meteor.tabsFunctions = {
	toggleTabs : function(){
	    // Tabs Variables
	    var toggle = document.querySelectorAll('[aria-controls][data-toggle=tabs]');
	    var content = document.querySelectorAll('div.tabs > [aria-hidden]');
	    if(event.target.hasAttribute('aria-controls') && event.target.getAttribute('aria-expanded') == 'false'){
			var thisToggleMenu = event.target.parentNode.parentNode;
			var thisToggleMenuButtons = thisToggleMenu.querySelectorAll('[aria-controls][data-toggle=tabs]');
			var thisTabsContent = thisToggleMenu.parentNode.querySelector('div.tabs');
			var thisTabsContentElement = thisTabsContent.querySelectorAll('[aria-hidden]');
			for (var i = 0, e; e = thisToggleMenuButtons[i]; i++) {
				h.active(e,false);
			}
			h.active(event.target, true);
			for (var i = 0, e; e = thisTabsContentElement[i]; i++) {
				h.hidden(e, true);
	            if ('#' + e.getAttribute('id') == event.target.getAttribute('aria-controls')){ //If Sidebar ID matches toggles' data-sidebar
	                h.hidden(e,false); //Add active class to given sidebar
	            }
			}
			/*
	        for (var i = 0, e; e = content[i]; i++) {
	            h.hidden(e,true); //Clear all active content
	        }*/
	    }
	}
}

//Define Usage
t = Meteor.tabsFunctions;

Template.body.events({
    //Tabs
    'click [data-toggle=tabs]': function (event) { t.toggleTabs(); },
});