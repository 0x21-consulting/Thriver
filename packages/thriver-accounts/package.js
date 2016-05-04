Package.describe({
    name: 'thriver:accounts',
    version: '0.0.1-teal',
    summary: 'Accounts support for Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.0');
    api.use([
        'thriver:core',
        'thriver:core-styles',
        'accounts-password',
        'mizzao:user-status'
    ]);
    
    // Resources
    api.addAssets([
        
    ], ['client']);
    
    api.addFiles([
        // Templates
        'lib/templates/account.html',
        'lib/templates/details.html',
        'lib/templates/login.html',
        'lib/templates/notifications.html',
        'lib/templates/register.html',
        
        // Styles
        'lib/styles/accounts.less',
        
        // Helpers and methods
        'lib/accounts.js',
    ], ['client']);
    
    api.addFiles([
        'lib/server.js'
    ], ['server']);
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:accounts');
    api.mainModule('accounts-tests.js');
});
