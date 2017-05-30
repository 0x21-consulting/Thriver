/**
 * @summary Register Deep-linking
 * @method
 */
Template.payments.onRendered(() => {
  Thriver.history.registry.insert({
    element: 'payments',
    accessData: {
      element: 'a[aria-controls="payments"]',
    },
  });
});
