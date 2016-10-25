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
    'less@=2.6.0',    // LessCSS Support
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
    'lib/styles/animate.less',
    'lib/styles/buttons.less',
    'lib/styles/context.less',
    'lib/styles/fonts.less',
    'lib/styles/forms.less',
    'lib/styles/helpers.less',
    'lib/styles/icons.less',
    'lib/styles/print.less',
    'lib/styles/reset.less',
    'lib/styles/scroll.less',
    'lib/styles/tables.less',
    'lib/styles/type.less',
  ], ['client']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:core-styles');
  // api.mainModule('core-styles-tests.js');
});
