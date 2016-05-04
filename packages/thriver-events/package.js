Package.describe({
    name: 'thriver:events',
    version: '0.0.1-teal',
    summary: 'Events/Calendar support for Thriver CMS',
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
        'lib/templates/events.html',
        
        // Styles
        'lib/styles/events.less',
        
        // Helpers and methods
        'lib/events.js',
    ], ['client']);
    
    api.addFiles([
        'lib/server.js'
    ], ['server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:events');
  api.mainModule('events-tests.js');
});
