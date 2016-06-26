//tabs.js are the events and functions associated with UI tabs.
Meteor.tabsFunctions = {
	toggleTabs : function(){
	    // Tabs Variables
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
			//If filter active
			if (event.target.getAttribute('aria-controls') == '#library'){
				event.target.parentNode.parentNode.parentNode.querySelector('aside.filter').classList.add('active-filter');
			}
			else{
				event.target.parentNode.parentNode.parentNode.querySelector('aside.filter').classList.remove('active-filter');
			}
	    }
	}
}

//Define Usage
t = Meteor.tabsFunctions;

Template.body.events({
    //Tabs
    'click [data-toggle=tabs]': function (event) { t.toggleTabs(); },
});

Template.body.onRendered(function() {
	if (window.innerWidth > 767){
		var toggleMenus = document.querySelectorAll('menu.tabs');
		//alert(toggleMenus);
		for (var i = 0, e; e = toggleMenus[i]; i++) {
			//alert(e);
			var menuItem = e.querySelectorAll('[data-toggle="tabs"]');
			menuItem[0].click();
		}
	}
	/*$(window).resize(function() {
		if (window.innerWidth > 767){
			var toggleMenus = document.querySelectorAll('menu.tabs');
			//alert(toggleMenus);
			for (var i = 0, e; e = toggleMenus[i]; i++) {
				//alert(e);
				var menuItem = e.querySelectorAll('[data-toggle="tabs"]');
				menuItem[0].click();
			}
		}
	});*/
});
