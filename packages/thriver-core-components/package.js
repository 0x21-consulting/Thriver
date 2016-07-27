Package.describe({
    name: 'thriver:core-components',
    version: '0.0.1-teal',
    summary: 'Core Thriver CMS Template Components',
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
        'lib/component-alert/alerts.html',
        'lib/component-help/help.html',
        'lib/component-list/list.html',
        'lib/component-search-filter/filter.html',
        'lib/component-sidebar/aside.html',
        'lib/component-tabs/tabs.html',
        'lib/component-top/top.html',
        
        // Styles
        'lib/component-header/header.less',
        'lib/component-header/mobile-menu.less',
        'lib/component-header/utility.less',
        'lib/component-search-filter/filter.less',
        'lib/component-section/sections.less',
        'lib/component-sidebar/sidebars.less',
        'lib/component-tabs/tabs.less',
        'lib/component-top/top.less',
        
        // Helpers and methods
        'lib/component-alert/alerts.js',
        'lib/component-help/help.js',
        'lib/component-list/list.js',
        'lib/component-more/more.js',
        'lib/component-sidebar/aside.js',
        'lib/component-tabs/tabs.js',
        'lib/component-top/top.js'
    ], ['client']);
    
    // Server processing
    api.addFiles([
        
    ], ['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('thriver:core-components');
    api.mainModule('core-components-tests.js');
});
