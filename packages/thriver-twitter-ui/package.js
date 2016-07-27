Package.describe({
    name: 'thriver:twitter-ui',
    version: '0.0.1-teal',
    summary: 'Twitter User Interface for Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.0');
    
    // Dependencies
    api.use([
        'thriver:core',
        'thriver:core-styles'
    ]);
    
    // Resources
    api.addAssets([
        
    ], ['client']);
    
    // Client processing
    api.addFiles([
        // Templates
        'lib/templates/twitter.html',
        
        // Styles
        'lib/templates/twitter.less',
        
        // Helpers and methods
        'lib/client/twitter.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:twitter-ui');
    api.mainModule('twitter-ui-tests.js');
});
