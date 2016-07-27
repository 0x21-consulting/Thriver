// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by core-components.js.
import { name as packageName } from "meteor/core-components";

// Write your tests here!
// Here is an example.
Tinytest.add('core-components - example', function (test) {
  test.equal(packageName, "core-components");
});
