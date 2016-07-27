// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by learning-center.js.
import { name as packageName } from "meteor/learning-center";

// Write your tests here!
// Here is an example.
Tinytest.add('learning-center - example', function (test) {
  test.equal(packageName, "learning-center");
});
