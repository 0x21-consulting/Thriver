// scopedQuerySelectorShim
// https://github.com/lazd/scopedQuerySelectorShim
(function() {
  if (!HTMLElement.prototype.querySelectorAll) {
    throw new Error('rootedQuerySelectorAll: This polyfill can only be used with browsers that support querySelectorAll');
  }

  // A temporary element to query against for elements not currently in the DOM
  // We'll also use this element to test for :scope support
  var container = document.createElement('div');

  // Check if the browser supports :scope
  try {
    // Browser supports :scope, do nothing
    container.querySelectorAll(':scope *');
  }
  catch (e) {
    // Match usage of scope
    var scopeRE = /^\s*:scope/gi;

    // Overrides
    function overrideNodeMethod(prototype, methodName) {
      // Store the old method for use later
      var oldMethod = prototype[methodName];

      // Override the method
      prototype[methodName] = function(query) {
        var nodeList,
            gaveId = false,
            gaveContainer = false;

        if (query.match(scopeRE)) {
          // Remove :scope
          query = query.replace(scopeRE, '');

          if (!this.parentNode) {
            // Add to temporary container
            container.appendChild(this);
            gaveContainer = true;
          }

          var parentNode = this.parentNode;

          if (!this.id) {
            // Give temporary ID
            this.id = 'rootedQuerySelector_id_'+(new Date()).getTime();
            gaveId = true;
          }

          // Find elements against parent node
          nodeList = oldMethod.call(parentNode, '#'+this.id+' '+query);

          // Reset the ID
          if (gaveId) {
            this.id = '';
          }

          // Remove from temporary container
          if (gaveContainer) {
            container.removeChild(this);
          }

          return nodeList;
        }
        else {
          // No immediate child selector used
          return oldMethod.call(this, query);
        }
      };
    }

    // Browser doesn't support :scope, add polyfill
    overrideNodeMethod(HTMLElement.prototype, 'querySelector');
    overrideNodeMethod(HTMLElement.prototype, 'querySelectorAll');
  }
}());

/**
 *  Polyfill for ECMAScript 6 Array.prototype.find Method
 *  Adapted from: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *    Reference/Global_Objects/Array/find}
 *  @method find
 *  @param {function} predicate - The method containing the find algorithm
 *  @returns {undefined}
 */
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null)
            throw new Meteor.Error('Array.prototype.find called on null or undefined');
        if (typeof predicate !== 'function')
            throw new Meteor.Error('predicate must be a function');
        
        var list = Object(this),
            length = list.length >>> 0,
            thisArg = arguments[1],
            value, i = 0;

        for (; i < length; ++i) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list))
                return value;
        }
        return undefined;
    };
}
