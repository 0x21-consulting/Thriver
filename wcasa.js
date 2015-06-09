if (Meteor.isClient) {
    // code to run on client at startup
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
