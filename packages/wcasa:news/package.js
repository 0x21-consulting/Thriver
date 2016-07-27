Package.describe({
    name: 'wcasa:news',
    version: '0.0.1-teal',
    summary: 'News Interface for the WCASA implementation of Thriver CMS',
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
        'lib/templates/news.html',
        
        // Styles
        'lib/templates/news.less',
        
        // Helpers and methods
        'lib/client/helpers.js',
        'lib/client/news.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        'lib/server.js'
    ], ['server']);
    
    api.export([ 'Newsroom' ]);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('wcasa:news');
    api.mainModule('news-tests.js');
});
