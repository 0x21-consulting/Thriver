// Populate Profile tab under Account Overview
Template.masthead.helpers({
    items: [{
        //Need to find away to get background images in here
        tabs: [{ //If sidebar has tabs: use this property
                title: 'April is Sexual Assault Awareness Month',
                id: 'mastheadSlideA', //These are for aria-controls
                template : 'slideA' //This could really just be an editable content area instead of unique templates
            },{
                title: 'Join the WCASA team in making a big difference',
                id: 'mastheadSlideB',
                template : 'slideB'
            },{
                title: 'Training Institute Conference',
                id: 'mastheadSlideC',
                template: 'slideC'
            }
        ]
    }]
})

/*function mastheadHeight(){
    var mastheadEls = document.querySelectorAll('.masthead div.tabs > article');
    for (var i = 0, e; e = mastheadEls[i]; i++) {
        console.log(e);
    }
}*/



Template.masthead.onRendered(function () {
    //mastheadHeight();
    //Auto Rotate function
    function transitionSlider(){
        //mastheadHeight();
        $( ".masthead menu.tabs > li" ).each(function() {
            if($(this).find('a').attr("aria-expanded") == "true" && $(this).is(':not(:last-child)')){
                $(this).next().find('a')[0].click();
                return false;
            }
            if($(this).find('a').attr("aria-expanded") == "true" && $(this).is(':last-child')){
                $('.masthead menu.tabs > li:first-child a')[0].click();
                return false;
            }
        });
    }
    var sliderTimer = setInterval(transitionSlider, 8000);
    $("#masthead menu.tabs > li a").click(function() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(transitionSlider, 8000);
    });
});
