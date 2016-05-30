Package.describe({
    name: 'thriver:masthead',
    version: '0.0.1-teal',
    summary: 'Masthead component for Thriver CMS',
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
        'lib/templates/masthead.html',
        
        // Styles
        'lib/styles/masthead.less',
        
        // Helpers and methods
        'lib/masthead.js',
    ], ['client']);
    
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('masthead');
    api.mainModule('masthead-tests.js');
});
