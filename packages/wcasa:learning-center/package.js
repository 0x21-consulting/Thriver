Package.describe({
  name: 'wcasa:learning-center',
  version: '0.0.1-teal',
  summary: 'Learning Center Section for the WCASA Implementation of Thriver CMS',
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
    'lib/templates/resources.html',

    // Styles
    'lib/templates/resources.less',

    // Helpers and methods
    'lib/client/infosheets.js',
    'lib/client/library.js',
    'lib/client/stats-data.js',
    'lib/client/webinars.js',
  ], ['client']);

  // Server processing
  api.addFiles([

  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:learning-center');
  // api.mainModule('learning-center-tests.js');
});
