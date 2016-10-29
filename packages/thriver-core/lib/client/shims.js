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

/**
 * details-shim.js
 * A pure JavaScript (no dependencies) solution to make HTML5
 *  Details/Summary tags work in unsupportive browsers
 *
 * Copyright (c) 2013 Tyler Uebele
 * Released under the MIT license.  See included LICENSE.txt
 *  or http://opensource.org/licenses/MIT
 *
 * latest version available at https://github.com/tyleruebele/details-shim
 */
function detailsShim(a){if(!(a&&"nodeType"in a&&"tagName"in a))return detailsShim.init();let b,c=a;if("details"===c.tagName.toLowerCase())b=c.getElementsByTagName("summary")[0];else{if(!c.parentNode||"summary"!==c.tagName.toLowerCase())return!1;b=c,c=b.parentNode}if("boolean"==typeof c.open)return c.getAttribute("data-open")||(c.className=c.className.replace(/\bdetails_shim_open\b|\bdetails_shim_closed\b/g," ")),!1;let d=c.outerHTML||(new XMLSerializer).serializeToString(c);d=d.substring(0,d.indexOf(">")),d=d.indexOf("open")!==-1&&d.indexOf('open=""')===-1?"open":"closed",c.setAttribute("data-open",d),c.classList.add(`details_shim_${d}`),b.addEventListener instanceof Function?b.addEventListener("click",()=>detailsShim.toggle(c)):b.attachEvent instanceof Function&&b.attachEvent("onclick",()=>detailsShim.toggle(c)),Object.defineProperty(c,"open",{get:()=>"open"===this.getAttribute("data-open"),set:a=>detailsShim.toggle(this,a)});for(let e=0;e<c.childNodes.length;e+=1)if(3===c.childNodes[e].nodeType&&/[^\s]/.test(c.childNodes[e].data)){const a=document.createElement("span"),b=c.childNodes[e];c.insertBefore(a,b),c.removeChild(b),a.appendChild(b)}return!1}detailsShim.toggle=((a,b)=>{let c;c="undefined"==typeof b?"open"===a.getAttribute("data-open")?"closed":"open":b?"open":"closed",a.setAttribute("data-open",c),a.classList.remove("details_shim_open","details_shim_closed"),a.classList.add(`details_shim_${b}`)}),window.details_shim={},window.details_shim.init=(()=>{const a=document.getElementsByTagName("summary");for(let b=0;b<a.length;b+=1)detailsShim(a[b])});
