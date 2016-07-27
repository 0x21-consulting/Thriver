// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by accounts.js.
import { name as packageName } from "meteor/accounts";

// Write your tests here!
// Here is an example.
Tinytest.add('accounts - example', function (test) {
  test.equal(packageName, "accounts");
});
