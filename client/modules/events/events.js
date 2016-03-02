/*jQuery(document).ready(function($) {


//Scroll Function
var amount = '';
function scroll() {
    $('.events-container').animate({
        scrollTop: amount
    }, 100, 'linear',function() {
        if (amount != '') {
            scroll();
        }
    });
}
$('.hover-up').hover(function() {
    amount = '-=78';
    scroll();
}, function() {
    amount = '';
});
$('.hover-down').hover(function() {
    amount = '+=78';
    scroll();
}, function() {
    amount = '';
});


//Click to Scroll Function
//For some reason it is toggling between scrolling to top and scrolling to this element
$('.has-event a').click(function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    $('.events-container').animate({scrollTop:$(id).position().top - 42}, 'slow');
    $(id + ' summary').click();
});


//Temp Actions of viewing previous/next months in calendar
$('.prev-month').click(function(e){
    e.preventDefault();
    alert('Navigate to October only on mini-calendar.');
});

$('.next-month').click(function(e){
    e.preventDefault();
    alert('Navigate to December only on mini-calendar.');
});


$('.scroll-prev-month').click(function(e){
    e.preventDefault();
    alert('Navigate to begining of November Only on events-scroller. Then replace the word "November 2015" with "October 2015"');
});

$('.scroll-next-month').click(function(e){
    e.preventDefault();
    alert('Navigate to begining of December Only on events-scroller. Then replace the word "December 2015" with "January 2016"');
});

$('input[type=search]').click(function(e){
    e.preventDefault();
    alert('Maybe this could populate the events list below via ajax as letters are typed and resets the list when all letters are removed."');
});




});*/