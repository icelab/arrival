# Arrival

A little helper for knowing reliably when CSS transitions have finished.

## Installation

With [component](https://github.com/component/component):

```
$ component install icelab/arrival
```

With npm via [browserify](http://browserify.org/):

```
$ npm install arrival
```

With [bower](http://browserify.org/):

```
$ bower install icelab/arrival
```

## Download

* [Development](https://raw.githubusercontent.com/icelab/arrival/master/dist/arrival.js)
* [Production](https://raw.githubusercontent.com/icelab/arrival/master/dist/arrival.min.js)

## Quickstart

Arrival will look at the passed element/s and traverse its children to find the element with the longest transition duration (determined by the sum of its `transition-duration` and `transition-delay` properties). Whenever that element finishes transitioning, the `callback` will fire.

```html
<span class="btn">Make slides go now</span>
<div class="slides">
  <div class="slide-in first">One</div>
  <div class="slide-in second">Two</div>
  <div class="slide-in third">Three</div>
</div>
```

```js
var arrival = require('arrival');
var slides = document.querySelector('.slides');
var trigger = document.querySelector('.btn');

function callback() {
  console.log('Like, totally all transitions were completed');
}

trigger.addEventListener('click', function(e){
  arrival(slides, callback);
});
```

`Arrival` also takes a third argument, a `descendantSelector` that is used to limit the traversal of the `element`s children. This is useful in situations where you _know_ what descendants are going to be the longest.

```js
var arrival = require('arrival');

...

trigger.addEventListener('click', function(e){
  arrival(slides, callback, '.third');
});
```

## Building the example

With [component](https://github.com/component/component):

```
$ component build
```

With [browserify](http://browserify.org/):

```
$ browserify index.js --s arrival > build/build.js
```

When using `browserify`, You will also need to remove the line `var arrival = require('arrival');` from the `index.html` file.

## Limitations

* Since there’s no `transitionstart` event, you’ll need to call `arrival` at the same time you trigger the transition.
* Arrival only looks at `transition` properties, not `animation` properties for now.
* Arrival will blindly look at _all_ descendants of the passed elements. If you have multi-stage transitions it may find the wrong element to bind to.

## License

Arrival is released under the MIT License.
