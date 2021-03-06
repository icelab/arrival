/**
 * Utilities
 */

var style = getComputedStyle;
var transitionend = require("transitionend-property");
var prefix = require("prefix");
var matches = require('matches-selector');

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
  var nodeStyle = style(node);
  var duration = (nodeStyle) ? ms(nodeStyle[prefix("transitionDuration")]) : 0;
  var delay = (nodeStyle) ? ms(nodeStyle[prefix("transitionDelay")]) : 0;
  return duration + delay;
}


/**
 * Return the element with the longest transition and its duration
 *
 * @param  {Element/s} els
 * @param  {String} selector
 * @return {Object} {el, duration}
 */

function getLongestTransition(els, selector) {
  var longest;
  var duration = 0;
  var selectedElements = [];

  [].slice.call(els).forEach(function(node) {
    if (matches(node, selector)) {
      selectedElements.push(node);
    }
  });

  Array.prototype.forEach.call(els, function findDescendants(node, i) {
    var descendants = [].slice.call(node.querySelectorAll(selector));
    selectedElements = selectedElements.concat(descendants);
  });

  Array.prototype.forEach.call(selectedElements, function checkDuration(node) {
    var total = getDuration(node);
    if(total > duration) {
      longest = node;
      duration = total;
    }
  });

  return {
    element: longest,
    duration: duration
  }
}


/**
 * Expose 'Arrival'
 * Define a target to add an event listener to.
 *
 * @param  {Element/s}  els
 * @param  {Function}  callback
 * @param  {String}  selector
 */

module.exports = function(els, callback, selector) {
  var safety;
  selector = selector || "*";

  if (els.length) {
    els = [].slice.call(els);
  } else {
    els = [els];
  }

  var longestTransition = getLongestTransition(els, selector);
  var target = longestTransition.element
  if(!target) return callback();

  function end() {
    clearTimeout(safety);
    target.removeEventListener(transitionend, end);
    callback();
  }

  target.addEventListener(transitionend, end);

  safety = setTimeout(function() {
    target.removeEventListener(transitionend, end);
    callback();
  }, longestTransition.duration)
};
