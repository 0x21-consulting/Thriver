Package.describe({
    name: 'thriver:maps',
    version: '0.0.1-teal',
    summary: 'Maps for Thriver CMS',
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
        'lib/templates/providers.html',
        
        // Styles
        'lib/styles/providers.less',
        'lib/styles/maps.less',
        
        // Helpers and methods
        'lib/providers.js',
        'lib/maps.js'
    ], ['client']);
    
    api.addFiles([
        'lib/server/providers.js'
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:maps');
    api.mainModule('maps-tests.js');
});
