Package.describe({
  name: 'thriver:core-styles',
  version: '0.0.1-teal',
  summary: 'Base styles for the Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  const packages = [
    'less@2.7.6', // LessCSS Support
    'fortawesome:fontawesome',
  ];

  api.use(packages);
  api.imply(packages);
  api.use(['thriver:core']);

  api.addAssets([

  ], ['client']);

  api.addFiles([
    'lib/index.less',

    // Styles
    'lib/vendor/details-shim.less',
    'lib/styles/animate.import.less',
    'lib/styles/buttons.import.less',
    'lib/styles/context.import.less',
    'lib/styles/fonts.import.less',
    'lib/styles/forms.import.less',
    'lib/styles/helpers.import.less',
    'lib/styles/icons.import.less',
    'lib/styles/print.import.less',
    'lib/styles/reset.import.less',
    'lib/styles/scroll.import.less',
    'lib/styles/tables.import.less',
    'lib/styles/type.import.less',
  ], ['client']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:core-styles');
  // api.mainModule('core-styles-tests.js');
});
