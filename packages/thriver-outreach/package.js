Package.describe({
    name: 'thriver:outreach',
    version: '0.0.1-teal',
    summary: 'Outreach/Get Involved Section for Thriver CMS',
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
        'lib/templates/outreach.html',
        
        // Styles
        'lib/styles/outreach.less',
        
        // Helpers and methods
        'lib/outreach.js',
    ], ['client']);
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:outreach');
    api.mainModule('outreach-tests.js');
});
