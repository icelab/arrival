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

function getTotalDuration(el, child) {
  child = child || null;
  var longest;
  var duration = 0;

  walk(el, child, function(node, next){
    var total = getDuration(node);

    if(total > duration) {
      longest = node;
      duration = total;
    }
    next();
  });

  return longest;
}


/**
 * Walk the all or selected children of an element
 * 
 * @param  {Element}  el
 * @param  {String}  child  [optional]
 * @param  {Function}  process
 * @param  {Function}  done
 * @return {Function}
 */

function walk(el, child, process, done) {
  done = done || function(){};
  var nodes = [];

  if(child){
    var children = el.querySelectorAll(child);
    Array.prototype.forEach.call(children, function(child){
      nodes.push(child);
    });
  }
  else {
    nodes = slice.call(el.children);
  }

  function next(){
    if(nodes.length === 0) return done();
    walk(nodes.shift(), null, process, next);
  }

  process(el, next);
}


/**
 * Expose 'Arrival'
 * Define a target to add an event listener to.
 * 
 * @param  {Element}  el
 * @param  {Function}  callback
 * @param  {String}  child
 */

module.exports = function(el, callback, child) {

  // if jQuery object, get the first child
  if (window.jQuery && el instanceof jQuery) el = el[0];

  var target = getTotalDuration(el, child);
  if(!target) return callback();

  target.addEventListener('transitionend', function end(){
    callback();
    target.removeEventListener('transitionend', end);
  });
};