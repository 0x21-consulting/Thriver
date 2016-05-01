/**
 * Remove all open sidebars
 * @method
 *   @param {$.Event} event
 */
/*var closeAsides = function (event) {
    event.preventDefault(); event.stopPropagation();
    
    // Start with body changes
    document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall', 'leftMedium');
    
    // Remove active components
    document.querySelector('nav.utility li.active').classList.remove('active');
    document.querySelector('aside.sidebar > section.active').classList.remove('active');
},

// Shortcut object for assigning Template event for aside closure
closure = { 'click .closeTab': closeAsides };

// Handle Utility Navigation events
Template.utilityNav.events({
    // Handle left and right sidebars
    // All buttons that would trigger sidebars have the .hasSidebar class
    'click nav.utility li[data-sidebar]': function (event) {
        event.stopPropagation();
        
        // Mutual suspicion
        if (! (event instanceof $.Event) ) return;
        
        var that    = event.currentTarget,
            name    = that.className.replace(/ active/, ''),
            section = document.querySelector('section.' + name);
        
        // If this tab is already active, close sidebars
        if (that.classList.contains('active')) {
            closeAsides(event);
            $(event.target).blur();
            return;
        }
        
        // Page body must move left or right depending on aside size
        document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall', 'leftMedium');
        document.body.classList.add(that.dataset.sidebar);
        
        // Activate link
        $('li[data-sidebar]').removeClass('active');
        that.classList.add('active');
        
        // Activate section
        $('aside.sidebar section').removeClass('active');
        section.classList.add('active');
        section.classList.add(that.dataset.size);
    },
    // Close sidebars when clicking sign out or help links
    'click li.logout' : closeAsides,
    'click li.getHelp': closeAsides,
    'click li.getHelp': function (event) {
        offset = $('[id="service-providers"]').offset().top - 95;
        $('body').animate({ scrollTop: offset }, 1500);
        $('figure.alert').addClass('active').delay(5000).queue(function(){
            $(this).removeClass("active").dequeue();
        });
    },
    'mouseenter li.getHelp': function (event) {
        //alert('hover');
        $('figure.help').addClass('active');
    },
    'mouseout li.getHelp': function (event) {
        $('figure.help').removeClass('active');
    }

});*/
// More sidebar closure methods... one for each template :(
/*Template.body.events({ 'click .overlay' : closeAsides });
Template.languageSelect.events (closure);
Template.login.events          (closure);
Template.register.events       (closure);
Template.notifications.events  (closure);
Template.accountDetails.events (closure);
Template.twitter.events        (closure);
Template.resources.events        (closure);
Template.news.events           (closure);
Template.donate.events         (closure);*/