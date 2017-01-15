Package.describe({
  name: 'thriver:maps',
  version: '0.0.1-teal',
  summary: 'Maps for Thriver CMS',
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
    'lib/client/data/wisconsin_counties.kml',
  ], ['client']);

  // Schema
  api.addFiles('lib/schema.js', ['server', 'client']);

  // Server processing
  api.addFiles([
    'lib/providers.js',
  ], ['server']);

  // Client processing
  api.addFiles([
    // Plugins
    'lib/client/geoxml3.js',

    // Templates
    'lib/templates/providers.html',
    'lib/templates/admin.html',

    // Styles
    'lib/templates/providers.less',

    // Helpers and methods
    'lib/client/providers.js',
    'lib/client/maps.js',
    'lib/client/admin.js',
  ], ['client']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:maps');
  // api.mainModule('maps-tests.js');
});
