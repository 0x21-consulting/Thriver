Package.describe({
    name: 'wcasa:who-we-are',
    version: '0.0.1-teal',
    summary: 'Who We Are Section for the WCASA Implementation of Thriver CMS',
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
        'lib/client/avatar.jpg'
    ], ['client']);
    
    // Client processing
    api.addFiles([
        // Templates
        'lib/templates/who.html',
        
        // Styles
        'lib/templates/who.less',
        
        // Helpers and methods
        'lib/client/who.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        'lib/server.js',
        'lib/site.js'
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('wcasa:who-we-are');
    api.mainModule('who-we-are-tests.js');
});
