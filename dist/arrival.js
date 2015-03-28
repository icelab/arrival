!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.arrival=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Utilities
 */

var style = getComputedStyle;
var slice = [].slice;


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
 * @param  {Element} el
 * @param  {String} child
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
 * @param  {Element}  el
 * @param  {Function}  callback
 * @param  {String}  child
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

  target.addEventListener('transitionend', function end(){
    callback();
    target.removeEventListener('transitionend', end);
  });
};
},{}]},{},[1])
(1)
});
