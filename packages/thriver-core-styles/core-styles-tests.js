// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by core-styles.js.
import { name as packageName } from "meteor/core-styles";

// Write your tests here!
// Here is an example.
Tinytest.add('core-styles - example', function (test) {
  test.equal(packageName, "core-styles");
});
