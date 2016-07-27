Package.describe({
    name: 'thriver:sections',
    version: '0.0.1-teal',
    summary: 'Support for Sections in the Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.0');
    api.use('thriver:core');
    
    api.addFiles([
        'lib/schema.js',
        'lib/sections.js'
    ], ['client', 'server']);
    
    api.addFiles([
        'lib/server.js'
    ], ['server']);
    
    api.addFiles([
        'lib/client.js'
    ], ['client']);
    
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:sections');
    api.mainModule('sections-tests.js');
});
