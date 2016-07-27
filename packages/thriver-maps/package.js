Package.describe({
    name: 'thriver:maps',
    version: '0.0.1-teal',
    summary: 'Maps for Thriver CMS',
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
        'lib/templates/providers.html',
        
        // Styles
        'lib/templates/providers.less',
        
        // Helpers and methods
        'lib/client/providers.js',
        'lib/client/maps.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        'lib/providers.js'
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:maps');
    api.mainModule('maps-tests.js');
});
