var test = require("tape");
var arrival = require("../index.js");

// Set up some basic HTML and CSS for testing transitions
var wrapperElement;

var cssString = ".test { \
  height: 50px; \
  margin: 20px; \
  width: 100px; \
  -webkit-transition-property: all; \
  -moz-transition-property: all; \
  transition-property: all; \
} \
.test-1 { \
  background-color: #f09; \
  -webkit-transition-duration: 100ms; \
  -moz-transition-duration: 100ms; \
  transition-duration: 100ms; \
} \
.test-2 { \
  background-color: #fc0; \
  -webkit-transition-duration: 200ms; \
  -moz-transition-duration: 200ms; \
  transition-duration: 200ms; \
} \
.test-3 { \
  background-color: #090; \
  -webkit-transition-duration: 1500ms; \
  -moz-transition-duration: 1500ms; \
  transition-duration: 1000ms; \
} \
.test-4 { \
  background-color: #36c; \
  -webkit-transition-duration: 400ms; \
  -moz-transition-duration: 400ms; \
  transition-duration: 400ms; \
} \
.test-5 { \
  background-color: #d34; \
  -webkit-transition-duration: 300ms; \
  -moz-transition-duration: 300ms; \
  transition-duration: 300ms; \
  -webkit-transition-delay: 150ms; \
  -moz-transition-delay: 150ms; \
  transition-delay: 150ms; \
} \
.test-6 { \
  background-color: #f03; \
  -webkit-transition-duration: 500ms; \
  -moz-transition-duration: 500ms; \
  transition-duration: 500ms; \
  -webkit-transition-delay: 100ms; \
  -moz-transition-delay: 100ms; \
  transition-delay: 100ms; \
} \
.tests-start .test { \
  margin-left: 50px; \
}";

function setUpHtml() {
  wrapperElement = document.createElement("div");
  wrapperElement.className = "tests";
  var styleElement = document.createElement("style");
  styleElement.appendChild(document.createTextNode(cssString));

  for (var i = 0; i < 6; i++) {
    var classes = ["test", "test-"+(i+1)];
    if (i > 4) {
      classes.push("descendant");
    }
    var el = document.createElement("div");
    el.className = classes.join(" ");
    wrapperElement.appendChild(el);
  };
  document.head.appendChild(styleElement);
  document.body.appendChild(wrapperElement);
}

// Config
var TIMING_THRESHOLD_IN_MILLISECONDS = 50;

test('It should fire the callback on the longest element or descendant', {timeout: 10000}, function(t) {
  var start = Date.now();
  var callback = function() {
    // 1500ms is the longest time for all .test objects
    var difference = Date.now() - start - 1500;
    var metThreshold = (difference < TIMING_THRESHOLD_IN_MILLISECONDS)
    t.true(metThreshold, "Callback fired within threshold");
  };
  setUpHtml();
  t.plan(1);
  arrival(wrapperElement, callback);
  wrapperElement.className = wrapperElement.className + " tests-start";
});

test('It should fire the callback on the longest element or descendant `selector`', {timeout: 10000}, function(t) {
  var start = Date.now();
  var callback = function() {
    // 600ms is the longest time for all .test objects
    var difference = Date.now() - start - 600;
    var metThreshold = (difference < TIMING_THRESHOLD_IN_MILLISECONDS)
    t.true(metThreshold, "Callback fired within threshold");
  };
  setUpHtml();
  t.plan(1);
  arrival(wrapperElement, callback, ".descendant");
  wrapperElement.className = wrapperElement.className + " tests-start";
});

test('It should fire the callback on the longest element or descendant when passed a set of elements', {timeout: 10000}, function(t) {
  var start = Date.now();
  var callback = function() {
    // 1500ms is the longest time for all .test objects
    var difference = Date.now() - start - 1500;
    var metThreshold = (difference < TIMING_THRESHOLD_IN_MILLISECONDS)
    t.true(metThreshold, "Callback fired within threshold");
  };
  setUpHtml();
  t.plan(1);
  arrival(wrapperElement.querySelectorAll(".test"), callback);
  wrapperElement.className = wrapperElement.className + " tests-start";
});

test('It should fire the callback on the longest descendant `selector` when passed a set of elements', {timeout: 10000}, function(t) {
  var start = Date.now();
  var callback = function() {
    // 600ms is the longest time for all .test objects
    var difference = Date.now() - start - 600;
    var metThreshold = (difference < TIMING_THRESHOLD_IN_MILLISECONDS)
    t.true(metThreshold, "Callback fired within threshold");
  };
  setUpHtml();
  t.plan(1);
  arrival(wrapperElement.querySelectorAll(".test"), callback, ".descendant");
  wrapperElement.className = wrapperElement.className + " tests-start";
});

test('It should fire the callback immediately if no targets are found', {timeout: 10000}, function(t) {
  var start = Date.now();
  var callback = function() {
    // 0ms is the longest time for this empty test
    var difference = Date.now() - start - 0;
    var metThreshold = (difference < TIMING_THRESHOLD_IN_MILLISECONDS)
    t.true(metThreshold, "Callback fired within threshold");
  };
  setUpHtml();
  t.plan(1);
  arrival(document.createElement("div"), callback);
  wrapperElement.className = wrapperElement.className + " tests-start";
});

test('It should fire the callback based on duration timeout', {timeout: 10000}, function(t) {
  var start = Date.now();
  var callback = function() {
    // 0ms is the longest time for this empty test
    var difference = Date.now() - start - 0;
    var metThreshold = (difference < TIMING_THRESHOLD_IN_MILLISECONDS)
    t.true(metThreshold, "Callback fired within threshold");
  };
  setUpHtml();
  t.plan(1);
  arrival(document.createElement("div"), callback);
});
