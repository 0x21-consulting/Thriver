Package.describe({
    name: 'thriver:core',
    version: '0.0.1-teal',
    summary: 'Core Libraries and Resources for the Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    var packages = [
        'ecmascript',                 // javascript
        'mongo',                      // database
        
        'templating',                 // Allow templates
        'spacebars',                  // Template Syntax
        'blaze-html-templates',       // Reactive templates
        
        'gwendall:body-events',       // Support Meteor.body.events
        
        'check',                      // Check library
        'audit-argument-checks',      // Enforce Check
        
        'aldeed:collection2@2.9.1',   // Enforce schemas on collections
        'aldeed:autoform@5.8.1'       // Enforce schemas on forms
    ];

    api.use(packages);
    api.imply(packages);

    api.addAssets([], 'client');

    api.addFiles([
        'lib/core.js',
        'lib/settings.js'
    ], ['client', 'server']);
    
    api.addFiles([
        'lib/client/history.js',
        'lib/client/scroll.js',
        'lib/client/markdown.js'
    ], ['client']);
    
    api.addFiles([
        
    ], ['server']);
    
    api.export([ 'Thriver' ]);
}); 

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:core');
    api.mainModule('core-tests.js');
});
