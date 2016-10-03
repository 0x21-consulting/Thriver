/**
 * @summary Route for Action Alerts
 */
Router.route('/action-alert/:title', function () {
    let alert = Thriver.newsroom.collection.findOne(
        { url: this.url.replace(/https?:\/{2,}.+?(:\d{,5})?\//i, '/') });

    // If no alert, nothing to do
    if (!alert) {
        this.render('canvas');
        return;
    }

    // The Post template expects the following additional information:
    alert['category'] = 'news';
    alert['logo'] = [{
        title: 'WCASA',
        src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
        url: '/'
    }];

    this.render('post', alert);
});

/**
 * @summary Route default path
 */
//Router.route(/\/.*/, function () {
//    if ( this.url.match(/\/action-alert\//i) ) return;
//    this.render('canvas');
//});
Router.configure({
    layoutTemplate: 'canvas'
})
