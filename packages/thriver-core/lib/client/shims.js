/* eslint-disable */

// scopedQuerySelectorShim
// https://github.com/lazd/scopedQuerySelectorShim
!function(){function c(c,d){var e=c[d];c[d]=function(c){var d,f=!1,g=!1;if(c.match(b)){c=c.replace(b,""),this.parentNode||(a.appendChild(this),g=!0);var h=this.parentNode;return this.id||(this.id="rootedQuerySelector_id_"+(new Date).getTime(),f=!0),d=e.call(h,"#"+this.id+" "+c),f&&(this.id=""),g&&a.removeChild(this),d}return e.call(this,c)}}if(!HTMLElement.prototype.querySelectorAll)throw new Error("rootedQuerySelectorAll: This polyfill can only be used with browsers that support querySelectorAll");var a=document.createElement("div");try{a.querySelectorAll(":scope *")}catch(d){var b=/^\s*:scope/gi;c(HTMLElement.prototype,"querySelector"),c(HTMLElement.prototype,"querySelectorAll")}}();

/**
 *  Polyfill for ECMAScript 6 Array.prototype.find Method
 *  Adapted from: {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *    Reference/Global_Objects/Array/find}
 *  @method find
 *  @param {function} predicate - The method containing the find algorithm
 *  @returns {undefined}
 */
Array.prototype.find||(Array.prototype.find=function(a){if(null==this)throw new Meteor.Error("Array.prototype.find called on null or undefined");if("function"!=typeof a)throw new Meteor.Error("predicate must be a function");for(var e,b=Object(this),c=b.length>>>0,d=arguments[1],f=0;f<c;++f)if(e=b[f],a.call(d,e,f,b))return e});
