//currentSlide = 0;
nextPosition = 1;
prevPosition = -1;
slideTotal = 3;





Template.events.events({
    'click .sliderPrev': function (event) {
        if (prevPosition >= 0){
            document.querySelector('.slides').style.webkitTransform = "translate(-" + prevPosition + "00% ,0px)";
            prevPosition = prevPosition - 1;
            nextPosition = nextPosition - 1;
        }
    },
    'click .sliderNext': function (event) {
        if (nextPosition < slideTotal){
            document.querySelector('.slides').style.webkitTransform = "translate(-" + nextPosition + "00% ,0px)";
            prevPosition = prevPosition + 1;
            nextPosition = nextPosition + 1;
        }
    },
    'click button.eventDate': function (event) {
        document.querySelector('.slides').style.webkitTransform = "translate(-" + event.target.value + "00% ,0px)";
        nextPosition = Number(event.target.value) + 1;
        prevPosition = Number(event.target.value) - 1;
    },
    'click a.eventDate': function (event) {
        event.preventDefault();
        document.querySelector('.slides').style.webkitTransform = "translate(-" + event.target.dataset.value + "00% ,0px)";
        nextPosition = Number(event.target.dataset.value) + 1;
        prevPosition = Number(event.target.dataset.value) - 1;
    },
    'click .unregister a': function (event) {
        event.preventDefault();
        //Append template:actionUnregisterPrompt to top of ul.actions
    },
    'click .notAccount a.login': function (event) {
        event.preventDefault();
        document.body.classList.add('leftSmall');
        $('nav.utility li.login').addClass('active');
        $('aside.sidebar section.login').addClass('active');
    },
    'click .notAccount a.create': function (event) {
        event.preventDefault();
        document.body.classList.add('leftSmall');
        $('nav.utility li.register').addClass('active');
        $('aside.sidebar section.register').addClass('active');
    },
    'click span.truncated': function (event) {
        $(event.currentTarget).parent().parent().parent().parent().addClass('extendedContent');
    },
    'click .eventSlide .actions .details': function (event) {
        $(event.currentTarget).parent().parent().parent().parent().addClass('extendedContent');
    }
});



