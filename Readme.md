A little helper for knowing reliably when CSS transitions have finished.

## Usage

Simply call `Arrival.complete` and pass it the `element` you care about, along with a `callback`:

```js
var panel = $(".panel");
var panelTransitionComplete = function() { };
Arrival.complete(panel, panelTransitionComplete);
```

`Arrival` will look at the passed element and traverse its children to find the element with the longest transition duration (determined by the sum of its `transition-duration` and `transition-delay` properties). Whenever that element finishes transitioning, the `callback` will fire.

`Arrival.complete` also takes a third argument, a `descendantSelector` that is used to limit the traversal of the `element`s children. This is useful in situations where you _know_ what descendants are going to be the longest.

```js
var panel = $(".panel");
var panelTransitionComplete = function() { };
Arrival.complete(panel, panelTransitionComplete, ".panel-children");
```

## Limitations

* Since there’s no `transitionstart` event, you’ll need to call `Arrival.complete` at the same time you trigger the transition.
* `Arrival` will uses `setTimeout` to _guarantee_ that your `callback` will fire. If you remove the `element` before the transition is complete this timeout will still fire.

## Dependencies

Arrival requires jQuery.

## License

Arrival is released under the MIT License.
