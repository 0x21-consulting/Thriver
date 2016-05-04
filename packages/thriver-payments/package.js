Package.describe({
    name: 'thriver:payments',
    version: '0.0.1-teal',
    summary: 'Payments support for Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');
    api.use([
        'thriver:core',
        'thriver:core-styles',
        'mrt:paypal@=1.1.1'
    ]);
    
    // Resources
    api.addAssets([
        
    ], ['client']);
    
    api.addFiles([
        // Templates
        'lib/templates/payments.html',
        
        // Styles
        'lib/styles/payments.less',
        
        // Helpers and methods
        'lib/payments.js',
    ], ['client']);
    
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:payments');
    api.mainModule('payments-tests.js');
});
