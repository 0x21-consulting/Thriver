//http://justmeteor.com/blog/implement-your-own-social-share-buttons/
//Will not work locally

UI.registerHelper('twitterShareLink', function() {
    return 'https://twitter.com/intent/tweet?url=' + window.location.href + '&text=' + document.title;
});

UI.registerHelper('facebookShareLink', function() {
    return 'https://www.facebook.com/sharer/sharer.php?&u=' + window.location.href;
});

UI.registerHelper('googlePlusShareLink', function() {
    return 'https://plus.google.com/share?url=' + window.location.href;
});

Template.articleNews.events({
    'click .articleNews .socialShare ul > li.print a': function (event) {
        window.print();
    }
});