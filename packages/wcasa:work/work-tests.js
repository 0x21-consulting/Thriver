// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by work.js.
import { name as packageName } from "meteor/work";

// Write your tests here!
// Here is an example.
Tinytest.add('work - example', function (test) {
  test.equal(packageName, "work");
});
