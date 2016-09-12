/**
 * Route default path
 */
Router.route(/\/.*/, function () {
    this.render('canvas');
});
