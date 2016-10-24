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
    function transitionSlider() {
        let activeItem = document.querySelector('.masthead menu.tabs > li a[aria-expanded="true"]'),
            menuItems  = document.querySelectorAll('.masthead menu.tabs > li');

        // If there is no active item, make the first active
        if (!activeItem)
            document.querySelector('.masthead menu.tabs > li a').
                setAttribute('aria-expanded', true);

        // Set the appropriate item as active
        for (let i = 0; i < menuItems.length; ++i) {
            let item = menuItems[i];

            // Look for which item is currently active
            if (item.children[0].getAttribute('aria-expanded') === 'true') {
                // If this is the last element
                if ( (i + 1) === menuItems.length)
                    menuItems[0].children[0].click();
                else
                    menuItems[i + 1].children[0].click();

                break;
            }
        };
    }
    setInterval(transitionSlider, 8000);

    // Start
    transitionSlider();

    /*$("#masthead menu.tabs > li a").click(function() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(transitionSlider, 8000);
    });*/
    alert($('[data-id="mastheadSlideC"]').get(0).height);
});
