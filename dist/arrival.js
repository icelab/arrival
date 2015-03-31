(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.arrival = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Utilities
 */

var style = getComputedStyle;
var transitionend = require("transitionend-property");
var prefix = require("prefix");


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
    console.log(total);
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

  target.addEventListener(transitionend, function end() {
    callback();
    target.removeEventListener(transitionend, end);
  });
};

},{"prefix":2,"transitionend-property":3}],2:[function(require,module,exports){

var style = document.createElement('p').style
var prefixes = 'O ms Moz webkit'.split(' ')
var upper = /([A-Z])/g

var memo = {}

/**
 * memoized `prefix`
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

module.exports = exports = function(key){
  return key in memo
    ? memo[key]
    : memo[key] = prefix(key)
}

exports.prefix = prefix
exports.dash = dashedPrefix

/**
 * prefix `key`
 *
 *   prefix('transform') // => webkitTransform
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

function prefix(key){
  // camel case
  key = key.replace(/-([a-z])/g, function(_, char){
    return char.toUpperCase()
  })

  // without prefix
  if (style[key] !== undefined) return key

  // with prefix
  var Key = capitalize(key)
  var i = prefixes.length
  while (i--) {
    var name = prefixes[i] + Key
    if (style[name] !== undefined) return name
  }

  throw new Error('unable to prefix ' + key)
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * create a dasherized prefix
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

function dashedPrefix(key){
  key = prefix(key)
  if (upper.test(key)) key = '-' + key.replace(upper, '-$1')
  return key.toLowerCase()
}

},{}],3:[function(require,module,exports){
/**
 * Transition-end mapping
 */

var map = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition' : 'transitionend',
  'OTransition' : 'oTransitionEnd',
  'msTransition' : 'MSTransitionEnd',
  'transition' : 'transitionend'
};

/**
 * Expose `transitionend`
 */

var el = document.createElement('p');

for (var transition in map) {
  if (null != el.style[transition]) {
    module.exports = map[transition];
    break;
  }
}

},{}]},{},[1])(1)
});