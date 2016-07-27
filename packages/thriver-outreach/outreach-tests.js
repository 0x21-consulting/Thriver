// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by outreach.js.
import { name as packageName } from "meteor/outreach";

// Write your tests here!
// Here is an example.
Tinytest.add('outreach - example', function (test) {
  test.equal(packageName, "outreach");
});
