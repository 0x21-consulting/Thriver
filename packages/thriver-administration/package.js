Package.describe({
    name: 'thriver:administration',
    version: '0.0.1-teal',
    summary: 'Support for administering the Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.0');
    api.use([
        'thriver:core',
        'thriver:core-styles',
        'accounts-password'
    ]);
    
    // Resources
    api.addAssets([
        
    ], ['client']);
    
    api.addFiles([
        // Templates
        'lib/templates/admin.html',
        'lib/templates/debug.html',
        
        // Styles
        'lib/styles/admin.less',
        
        // Helpers and methods
        'lib/client/admin.js',
        'lib/client/newActionAlert.js',
        'lib/client/newSection.js',
        'lib/client/editSection.js',
        'lib/client/deleteSection.js',
    ], ['client']);
    
    api.addFiles([
        'lib/server/admin.js'
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:administration');
    api.mainModule('administration-tests.js');
});
