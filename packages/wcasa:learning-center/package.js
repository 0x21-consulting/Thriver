Package.describe({
  name: 'wcasa:learning-center',
  version: '0.0.1-teal',
  summary: 'Resource Center Section for the WCASA Implementation of Thriver CMS',
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

  // Client and server
  api.addFiles(['lib/schema.js'], ['client', 'server']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/resourceCenter.html',

    // Styles
    'lib/templates/resourceCenter.less',

    // Helpers and methods
    'lib/client/helpers.js',
    'lib/client/resourceCenter.js',
  ], ['client']);

  // Server processing
  api.addFiles([
    'lib/server.js',
  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:learning-center');
  // api.mainModule('learning-center-tests.js');
});
