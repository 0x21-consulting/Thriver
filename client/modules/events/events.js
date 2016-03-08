nextPosition = 1;
prevPosition = -1;
slideTotal = 3; //Total Slides, Should be -1 and 0 is a slide. Will need to update on li.eventSlide count change.

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
    }
});