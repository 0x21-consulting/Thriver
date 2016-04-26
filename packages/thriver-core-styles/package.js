Package.describe({
    name: 'thriver:core-styles',
    version: '0.0.1-teal',
    summary: 'Base styles for the Thriver CMS',
    git: 'https://github.com/enove/Thriver.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');
    
    var packages = [
      'less@=2.6.0',    // LessCSS Support
      'fortawesome:fontawesome'
    ];
    
    api.use  (packages);
    api.imply(packages);
    api.use(['thriver:core']);
    
    api.addAssets([
        
    ], ['client']);
    
    api.addFiles([
        'lib/index.less'
    ], ['client']);
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:core-styles');
    api.mainModule('core-styles-tests.js');
});
