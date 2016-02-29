Template.utility.onRendered(function () {
    //Should be attributed to correct alert (Figured alerts would be managed via a meteor variable)
    $('.workNav li a').click(function(){
        event.preventDefault();
        if(!$('body').hasClass('workActive')){
            $('body').addClass('workActive');
        }
    });
});