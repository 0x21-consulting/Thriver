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
    }
});