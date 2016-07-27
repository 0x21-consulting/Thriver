Package.describe({
    name: 'thriver:i18n',
    version: '0.0.1-teal',
    summary: 'Internationalization Support for Thriver CMS',
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
        'lib/templates/i18n.html',
        
        // Styles
        'lib/templates/i18n.less',
        
        // Helpers and methods
        'lib/client/i18n.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:i18n');
    api.mainModule('i18n-tests.js');
});
