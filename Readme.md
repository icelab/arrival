# Arrival

A little helper for knowing reliably when CSS transitions have finished.

## Installation

With npm via [browserify](http://browserify.org/) or your package manager of choice:

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

`Arrival` also takes a third argument, a `selector` that is used to match against all the passed `element`s and their children. This is useful in situations where you _know_ what elements are going to be the longest.

```js
var arrival = require('arrival');

...

trigger.addEventListener('click', function(e){
  arrival(slides, callback, '.third');
});
```

## Building the example

There are a couple of build options run through browserify:

```
$ npm run build
$ npm run build-standalone
$ npm run build-standalone-min
```

`npm run build-standalone` generates the file used in the example `./test/index.html`.

## Limitations

* Since there’s no `transitionstart` event, you’ll need to call `arrival` at the same time you trigger the transition.
* Arrival only looks at `transition` properties, not `animation` properties for now.
* Arrival will blindly look at _all_ descendants of the passed elements (unless you tell it not to). If you have multi-stage transitions it may find the wrong element to bind to.

## License

Arrival is released under the MIT License.
