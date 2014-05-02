// Arrival 0.0.1
// Copyright (c) 2014 Max Wheeler, Icelab
// Licensed under the MIT license
;(function(root, factory) {
  root.Arrival = factory(root, {}, $); // Browser global
}(this, function(root, Arrival, jQuery) {
  "use strict";
  var getLongestTransitionElementAndTime, getElementTransitionTime, parseSecondsToMilliseconds;
  // Iterate through descendants to get transition times
  getLongestTransitionElementAndTime = function(scope, descendantSelector, longestTotal) {
    var longestTransitionElement,
      descendants = scope.find(descendantSelector);
    descendants.each(function(i) {
      var descendant = descendants.eq(i),
      total = getElementTransitionTime(descendant);
      if(total > longestTotal) {
        longestTotal = total;
        longestTransitionElement = descendant;
      }
    });
    return {
      longestTotal: longestTotal,
      longestTransitionElement: longestTransitionElement
    }
  };
  // Find the sum of the transition duration/delay for a given element
  getElementTransitionTime = function(element) {
    var duration = parseSecondsToMilliseconds(
        element.css("transitionDuration")
      ),
      delay = parseSecondsToMilliseconds(
        element.css("transitionDelay")
      );
    return delay + duration;
  };
  // Parse assumed second string values into milliseconds
  parseSecondsToMilliseconds = function(n) {
    return parseFloat(n) * 1000
  };
  // Main Arrival method, takes an element, callback and an optional
  // descendantSelector.
  var complete = Arrival.complete = function(element, callback, descendantSelector) {
    var results, safety,
      longestTotal = getElementTransitionTime(element) || 0,
      longestTransitionElement = element,
    element = $(element);
    descendantSelector = descendantSelector || "*";
    // Find the longest transitionable element/time
    results = getLongestTransitionElementAndTime(element, descendantSelector, longestTotal);
    longestTotal = results.longestTotal;
    longestTransitionElement = results.longestTransitionElement;
    if (typeof longestTransitionElement !== "undefined" && longestTransitionElement !== null) {
      // Bind the callback to transitionEnd
      longestTransitionElement.on("transitionend", function() {
        clearTimeout(safety)
        callback();
      });
      // Create a timeout to fire at the same time as the event listener
      safety = setTimeout(function() {
        callback();
        longestTransitionElement.off("transitionend");
      }, longestTotal);
    } else {
      // Just in case, fire the callback all the time
      callback();
    }
  };
  return Arrival;
}));
