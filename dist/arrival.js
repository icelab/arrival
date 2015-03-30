
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Meta info, accessible in the global scope unless you use AMD option.
 */

require.loader = 'component';

/**
 * Internal helper object, contains a sorting function for semantiv versioning
 */
require.helper = {};
require.helper.semVerSort = function(a, b) {
  var aArray = a.version.split('.');
  var bArray = b.version.split('.');
  for (var i=0; i<aArray.length; ++i) {
    var aInt = parseInt(aArray[i], 10);
    var bInt = parseInt(bArray[i], 10);
    if (aInt === bInt) {
      var aLex = aArray[i].substr((""+aInt).length);
      var bLex = bArray[i].substr((""+bInt).length);
      if (aLex === '' && bLex !== '') return 1;
      if (aLex !== '' && bLex === '') return -1;
      if (aLex !== '' && bLex !== '') return aLex > bLex ? 1 : -1;
      continue;
    } else if (aInt > bInt) {
      return 1;
    } else {
      return -1;
    }
  }
  return 0;
}

/**
 * Find and require a module which name starts with the provided name.
 * If multiple modules exists, the highest semver is used. 
 * This function can only be used for remote dependencies.

 * @param {String} name - module name: `user~repo`
 * @param {Boolean} returnPath - returns the canonical require path if true, 
 *                               otherwise it returns the epxorted module
 */
require.latest = function (name, returnPath) {
  function showError(name) {
    throw new Error('failed to find latest module of "' + name + '"');
  }
  // only remotes with semvers, ignore local files conataining a '/'
  var versionRegexp = /(.*)~(.*)@v?(\d+\.\d+\.\d+[^\/]*)$/;
  var remoteRegexp = /(.*)~(.*)/;
  if (!remoteRegexp.test(name)) showError(name);
  var moduleNames = Object.keys(require.modules);
  var semVerCandidates = [];
  var otherCandidates = []; // for instance: name of the git branch
  for (var i=0; i<moduleNames.length; i++) {
    var moduleName = moduleNames[i];
    if (new RegExp(name + '@').test(moduleName)) {
        var version = moduleName.substr(name.length+1);
        var semVerMatch = versionRegexp.exec(moduleName);
        if (semVerMatch != null) {
          semVerCandidates.push({version: version, name: moduleName});
        } else {
          otherCandidates.push({version: version, name: moduleName});
        } 
    }
  }
  if (semVerCandidates.concat(otherCandidates).length === 0) {
    showError(name);
  }
  if (semVerCandidates.length > 0) {
    var module = semVerCandidates.sort(require.helper.semVerSort).pop().name;
    if (returnPath === true) {
      return module;
    }
    return require(module);
  }
  // if the build contains more than one branch of the same module
  // you should not use this funciton
  var module = otherCandidates.sort(function(a, b) {return a.name > b.name})[0].name;
  if (returnPath === true) {
    return module;
  }
  return require(module);
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~transitionend-property@0.0.2", function (exports, module) {
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

});

require.register("arrival", function (exports, module) {
/**
 * Utilities
 */

var style = getComputedStyle;
var transitionend = require("component~transitionend-property@0.0.2");


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

});

if (typeof exports == "object") {
  module.exports = require("arrival");
} else if (typeof define == "function" && define.amd) {
  define("arrival", [], function(){ return require("arrival"); });
} else {
  (this || window)["arrival"] = require("arrival");
}
})()
