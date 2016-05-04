// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by payments.js.
import { name as packageName } from "meteor/payments";

// Write your tests here!
// Here is an example.
Tinytest.add('payments - example', function (test) {
  test.equal(packageName, "payments");
});
