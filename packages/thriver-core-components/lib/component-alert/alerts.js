Template.alerts.events({
  'click .closeAlert': () =>
    document.getElementById('alert').classList.remove('active'),
});