Package.describe({
    name: 'thriver:navigation',
    version: '0.0.1-teal',
    summary: 'Thriver CMS Navigation bars',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.0');
    api.use([
        'thriver:core',
        'thriver:core-styles'
    ]);

    // Resources
    api.addAssets([

    ], ['client']);

    api.addFiles([
        // Templates
        'lib/templates/main.html',
        'lib/templates/mobile.html',
        'lib/templates/utility.html',

        // Styles (Removed as unable to access global less dependencies. Can be found in thriver-core-styles>lib>sections...)
        //'lib/styles/utility.less',
        //'lib/styles/header.less',
        //'lib/styles/mobile.less',

        // Helpers and methods
        'lib/navigation.js',
        'lib/utility.js',
        'lib/mobile.js'
    ], ['client']);

});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:navigation');
    api.mainModule('navigation-tests.js');
});
