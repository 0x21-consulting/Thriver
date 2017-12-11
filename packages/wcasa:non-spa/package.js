Package.describe({
  name: 'wcasa:non-spa',
  version: '0.0.1-teal',
  summary: 'Temporary package for handling non Single-Page-App (SPA) templates in Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  // Dependencies
  api.use([
    'thriver:core',
    'thriver:core-styles',
  ]);

  // Resources
  api.addAssets([

  ], ['client']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/post.html',

    // Styles
    'lib/templates/post.less',

    // Helpers and methods
    'lib/client/post.js',
  ], ['client']);

  // Server processing
  api.addFiles([

  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:non-spa');
  // api.mainModule('non-spa-tests.js');
});
