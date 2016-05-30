Template.languageSelect.events({
    // Switch tabs
    'click .languageList > ul > li': function (event) {
        $('.languageList > ul > li').removeClass('active');
        $(event.target).addClass('active');
    }
});