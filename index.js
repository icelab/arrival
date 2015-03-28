/**
 * Utilities
 */

var style = getComputedStyle;
var slice = [].slice;
var transitionend = require("transitionend-property");


/**
 * Return a floating point number from a string
 */

function ms(str) {
  return parseFloat(str) * 1000;
}


/**
 * Take a node and return it's computed transition
 * 'duration' and 'delay' style values
 *
 * @param  {Element} node
 * @return {Number}
 */

function getDuration(node) {
  var duration = ms(style(node).transitionDuration);
  var delay = ms(style(node).transitionDelay);
  return duration + delay;
}


/**
 * Return an element with the longest transition duration
 *
 * @param  {Element/s} els
 * @param  {String} childSelector
 * @return {Element} longest
 */

function getLongestTransitionElement(els, childSelector) {
  var longest;
  var duration = 0;
  var selectedElements = [].slice.call(els);

  Array.prototype.forEach.call(els, function findDescendants(node, i) {
    var descendants = [].slice.call(node.querySelectorAll(childSelector));
    selectedElements = selectedElements.concat(descendants);
  });

  Array.prototype.forEach.call(selectedElements, function checkDuration(node) {
    var total = getDuration(node);
    if(total > duration) {
      longest = node;
      duration = total;
    }
  });

  return longest;
}


/**
 * Expose 'Arrival'
 * Define a target to add an event listener to.
 *
 * @param  {Element/s}  els
 * @param  {Function}  callback
 * @param  {String}  childSelector
 */

module.exports = function(els, callback, childSelector) {
  childSelector = childSelector || "*";

  if (els.length) {
    els = [].slice.call(els);
  } else {
    els = [els];
  }

  var target = getLongestTransitionElement(els, childSelector);
  if(!target) return callback();

  target.addEventListener(transitionend, function end(){
    callback();
    target.removeEventListener(transitionend, end);
  });
};
