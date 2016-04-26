// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by navigation.js.
import { name as packageName } from "meteor/navigation";

// Write your tests here!
// Here is an example.
Tinytest.add('navigation - example', function (test) {
  test.equal(packageName, "navigation");
});
