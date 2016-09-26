Package.describe({
    name: 'thriver:outreach',
    version: '0.0.1-teal',
    summary: 'Outreach/Get Involved Section for Thriver CMS',
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
        'lib/templates/outreach.html',
        
        // Styles
        'lib/templates/outreach.less',
        
        // Helpers and methods
        'lib/client/outreach.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        'lib/server/outreach.js'
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:outreach');
    api.mainModule('outreach-tests.js');
});
