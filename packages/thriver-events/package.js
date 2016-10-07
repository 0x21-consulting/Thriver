Package.describe({
    name: 'thriver:events',
    version: '0.0.1-teal',
    summary: 'Events/Calendar support for Thriver CMS',
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
    
    // Both server and client
    api.addFiles([
        // Events Namespace and collection schema
        'lib/schema.js'
    ], [ 'client', 'server' ]);

    // Client processing
    api.addFiles([
        // Templates
        'lib/templates/events.html',
        'lib/templates/admin.html',
        
        // Styles
        'lib/templates/events.less',
        
        // Helpers and methods
        'lib/client/calendar.js',
        'lib/client/events.js',
        'lib/client/helpers.js',
        'lib/client/viewAll.js',
        'lib/client/search.js',
        'lib/client/history.js',
        'lib/client/admin.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        'lib/server.js'
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:events');
    api.mainModule('events-tests.js');
});
