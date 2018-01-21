Thriver.alert = {
  /**
   * @summary Display Alerts
   * @method
   */
  hideAlert: () => {
    // Vars
    const alert = document.getElementById('alert');
    alert.classList.remove('active');
  },

  showAlert: (opts) => {
    // Define Alert
    const alert = document.getElementById('alert');

    // Update alert content & display alert
    $(alert).find('.content').html(opts.content);
    alert.classList.add('active', opts.class);
    window.setTimeout(() => alert.classList.remove('active', opts.class), 3500);
  },
};
