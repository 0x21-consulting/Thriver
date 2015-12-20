// Utility Nav
Template.utility.onRendered(function () {
    //Utility Navigation Sidebar Actions
    $('nav.utility > ul > li.hasSidebar').click(function(){
        //Variables to find accompanied sidebar
        var thisClass = $(this).attr('class');
        var thisSidebar = $( "section[class='" + thisClass +"']" );

        //Clear Open Elements
        $('nav.utility > ul > li.hasSidebar').not(this).removeClass('active');
        $('.sidebar section').not(thisSidebar).removeClass('active');

        //General Toggle Settings
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
            thisSidebar.removeClass('active');

            //Specific Conditions
            if ($(this).hasClass('leftSmall')){
                $('body').removeClass('leftSmall');
            }
            else if ($(this).hasClass('rightSmall')){
                $('body').removeClass('rightSmall');
            }
            else if ($(this).hasClass('rightMedium')){
                $('body').removeClass('rightMedium');
            }
            else if ($(this).hasClass('rightLarge')){
                $('body').removeClass('rightLarge');
            }
        } else{
            $(this).addClass('active');
            thisSidebar.addClass('active');
            //Alternative Specific Conditions
            if ($(this).hasClass('leftSmall')){
                $('body').removeClass('rightSmall rightMedium rightLarge');
                $('body').addClass('leftSmall');
            }
            else if ($(this).hasClass('rightSmall')){
                $('body').removeClass('leftSmall rightMedium rightLarge');
                $('body').addClass('rightSmall');
            }
            else if ($(this).hasClass('rightMedium')){
                $('body').removeClass('rightSmall leftSmall rightLarge');
                $('body').addClass('rightMedium');
            }
            else if ($(this).hasClass('rightLarge')){
                $('body').removeClass('rightSmall rightMedium leftSmall');
                $('body').addClass('rightLarge');
            }   
        }
    });

    //Should be attributed to correct alert
    $('li.logout, li.getHelp').click(function(){
        $('figure.alert').addClass('active').delay(5000).queue(function(){
            $(this).removeClass("active").dequeue();
        });
    });

    $('span.closeAlert').click(function(){
        $('figure.alert').removeClass("active").dequeue();
    });

    function removeActiveSidebars(){
        $('body').removeClass('leftSmall rightSmall rightMedium rightLarge');
        $('nav.utility > ul > li.hasSidebar').removeClass('active');
        $('aside.sidebar > section').removeClass('active');        
    }
    $('.overlay, .closeTab, li.logout, li.getHelp').click(function(){
        removeActiveSidebars();
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
    $('button.loadMore').click(function(){
        alert('Load More Results');
    });
    $('.eventsRegistered .unregister').click(function(){
        $(this).parent().addClass('selected');
    });
    $('.eventsRegistered .undo').click(function(){
        $(this).parent().parent().removeClass('selected');
    });
    $('.eventsRegistered .viewEvent').click(function(){
        removeActiveSidebars();
        alert('scroll down to events and show the selected event');
    });



    // Toggle visibility of the Alerts
    var alerts = document.querySelectorAll('.alerts'),
        i, j, blockClose, modules,
    
    // Class swap method
    classSwap = function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        var active = document.querySelectorAll('.utilityNav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
        
        this.classList.add('active');
    };
    
    console.debug(alerts);
    
    for (i = 0, j = alerts.length; i < j; ++i)
        alerts[i].addEventListener('mousedown', classSwap);
    
    // Close modules by default
    document.body.addEventListener('mousedown', function () {
        var active = document.querySelectorAll('.utilityNav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
    });
    // But not if you click in the modules
    modules = document.querySelectorAll('.notificationMenu');
    blockClose = function (event) {
        event.stopPropagation();
    };
    for (i = 0, j = modules.length; i < j; ++i)
        modules[i].addEventListener('mousedown', blockClose);
});