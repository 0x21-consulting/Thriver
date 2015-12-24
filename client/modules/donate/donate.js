Template.donate.onRendered(function () {
    $('form .custom').click(function(){
        $('.customAmt').focus();
    });
    $('.customAmt').click(function () {
        document.querySelector('#radio5').checked = true;
    });
});