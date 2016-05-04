Package.describe({
    name: 'thriver:twitter-ui',
    version: '0.0.1-teal',
    summary: 'Twitter User Interface for Thriver CMS',
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
        'lib/templates/twitter.html',
        
        // Styles
        'lib/styles/twitter.less',
        
        // Helpers and methods
        'lib/twitter.js',
    ], ['client']);
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:twitter-ui');
    api.mainModule('twitter-ui-tests.js');
});
