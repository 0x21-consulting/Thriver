/**
 * Remove all open sidebars
 * @method
 *   @param {$.Event} event
 */
var closeAsides = function (event) {
    event.preventDefault(); event.stopPropagation();
    
    // Start with body changes
    document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall');
    
    // Remove active components
    document.querySelector('nav.utility li.active').classList.remove('active');
    document.querySelector('aside.sidebar > section.active').classList.remove('active');
},

// Shortcut object for assigning Template event for aside closure
closure = { 'click .closeTab': closeAsides };

// Handle Utility Navigation events
Template.utility.events({
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
            return;
        }
        
        // Page body must move left or right depending on aside size
        document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall');
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
    'click li.getHelp': closeAsides
});
// More sidebar closure methods... one for each template :(
Template.body.events({ 'click .overlay' : closeAsides });
Template.login.events          (closure);
Template.register.events       (closure);
Template.notifications.events  (closure);
Template.accountDetails.events (closure);
Template.twitter.events        (closure);
Template.news.events           (closure);
Template.donate.events         (closure);

// Utility Nav
Template.utility.onRendered(function () {
    //Should be attributed to correct alert
    $('li.getHelp').click(function(){
        $('figure.alert').addClass('active').delay(5000).queue(function(){
            $(this).removeClass("active").dequeue();
        });
    });

    //Remove Unread Notification Icon on Click
    $('li.notifications button').click(function(){
        alert('b');
        $('li.notifications span.unreadNotifications').addClass('hidden');
    });

    $('span.closeAlert').click(function(){
        $('figure.alert').removeClass("active").dequeue();
    });

    //Temp UX Alert Notes
    $('.notificationRenewal button').click(function(){
        $('li.donate').click();
    });
    $('.notificationApproval > button').click(function(){
        $(this).parent().addClass('selected');
    });
    $('.notificationApproval .undo').click(function(){
        $(this).parent().parent().removeClass('selected');
    });
    $('.eventsRegistered .unregister').click(function(){
        $(this).parent().addClass('selected');
    });
    $('.eventsRegistered .undo').click(function(){
        $(this).parent().parent().removeClass('selected');
    });
    $('.eventsRegistered .viewEvent').click(function(){
        closeAsides();
        alert('scroll down to events and show the selected event');
    });
});