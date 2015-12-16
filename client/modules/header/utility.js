// Utility Nav
Template.utility.onRendered(function () {

    //Utility Navigation Sidebar Actions
    $('aside.utility > ul > li.has-sidebar').click(function(){
        //Variables to find accompanied sidebar
        var thisClass = $(this).attr('class');
        var thisSidebar = $( "section[class='" + thisClass +"']" );

        //Clear Open Elements
        $('aside.utility > ul > li.has-sidebar').not(this).removeClass('active');
        $('.sidebar section').not(thisSidebar).removeClass('active');


        //General Toggle Settings
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
            thisSidebar.removeClass('active');

            //Specific Conditions
            if ($(this).hasClass('left-small')){
                $('body').removeClass('left-small');
            }
            else if ($(this).hasClass('right-small')){
                $('body').removeClass('right-small');
            }
            else if ($(this).hasClass('right-medium')){
                $('body').removeClass('right-medium');
            }
            else if ($(this).hasClass('right-large')){
                $('body').removeClass('right-large');
            }
        } else{
            $(this).addClass('active');
            thisSidebar.addClass('active');
            //Alternative Specific Conditions
            if ($(this).hasClass('left-small')){
                $('body').removeClass('right-small right-medium right-large');
                $('body').addClass('left-small');
            }
            else if ($(this).hasClass('right-small')){
                $('body').removeClass('left-small right-medium right-large');
                $('body').addClass('right-small');
            }
            else if ($(this).hasClass('right-medium')){
                $('body').removeClass('right-small left-small right-large');
                $('body').addClass('right-medium');
            }
            else if ($(this).hasClass('right-large')){
                $('body').removeClass('right-small right-medium left-small');
                $('body').addClass('right-large');
            }   
        }
    });
    function removeActiveSidebars(){
        $('body').removeClass('left-small right-small right-medium right-large');
        $('aside.utility > ul > li.has-sidebar').removeClass('active');
        $('aside.sidebar > section').removeClass('active');        
    }
    $('.overlay, .close-tab, li.logout, li.get-help').click(function(){
        removeActiveSidebars();
    });



    // Toggle visibility of the Alerts
    var alerts = document.querySelectorAll('.alerts'),
        i, j, blockClose, modules,
    
    // Class swap method
    classSwap = function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        var active = document.querySelectorAll('.utility-nav .active'),
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
        var active = document.querySelectorAll('.utility-nav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
    });
    // But not if you click in the modules
    modules = document.querySelectorAll('.notification-menu');
    blockClose = function (event) {
        event.stopPropagation();
    };
    for (i = 0, j = modules.length; i < j; ++i)
        modules[i].addEventListener('mousedown', blockClose);
});