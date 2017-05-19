# Weighted Random Selection

[![Build Status](https://travis-ci.org/silvermine/weighted-random-selection.png?branch=master)](https://travis-ci.org/silvermine/weighted-random-selection)
[![Coverage Status](https://coveralls.io/repos/github/silvermine/weighted-random-selection/badge.svg?branch=master)](https://coveralls.io/github/silvermine/weighted-random-selection?branch=master)
[![Dependency Status](https://david-dm.org/silvermine/weighted-random-selection.png)](https://david-dm.org/silvermine/weighted-random-selection)
[![Dev Dependency Status](https://david-dm.org/silvermine/weighted-random-selection/dev-status.png)](https://david-dm.org/silvermine/weighted-random-selection#info=devDependencies&view=table)


## What is it?

A utility that allows you to easily choose a random item from a list of items. However, rather than having uniform
random distribution of the choices, it will allow you to assign a "weight" to each item so that things that "weigh" more
will be chosen more often.


## How do I use it?

Here's an example of how you can use this library:

```js
'use strict';

var WRS = require('weighted-random-selection'),
    ads, wrs;

ads = [
   { name: 'Ad 1', clickthroughPctg: 0.1 },
   { name: 'Ad 2', clickthroughPctg: 0.2 },
   { name: 'Ad 3', clickthroughPctg: 0.4 },
];

function clickthroughWeight(ad) {
   // the simplest type of weight transformer: returning a field
   // that already contains a valid value for the weighting:
   return ad.clickthroughPctg;
}

wrs = new WRS(clickthroughWeight);
wrs.setItems(ads);
for (var i = 0; i < 100; i++) {
   console.log(wrs.next().name);
}
```

In this example, you should roughly get:

   * Ad 1: 14.29% of the time (1 in 7, or 0.1 in 0.7)
   * Ad 2: 28.57% of the time (2 in 7, or 0.2 in 0.7)
   * Ad 3: 57.14% of the time (4 in 7, or 0.4 in 0.7)


## API

### Constructor

The constructor of `WeightedRandomSelection` must be passed a function that returns a weight for each item in the list
that is being randomly-selected from. In the example above, that is the `clickthroughWeight` function.

The constructor can be passed an optional second argument `items` which initializes the items in the list without
needing to call `setItems` separately.

### setItems

The `setItems` function is passed a list of `items` that are being selected from. When `setItems` is called, internally
the WRS will recalculate all of the weights of the items by calling your weighting function once for each item.

Returns the instance of WRS so that you can chain calls together, e.g.
`wrs = new WRS(foo).setItems(items).setAllowRepeatDistance(n);`

### setAllowRepeatsDisregardDistance

Calling this function tells WRS that it can return the same item multiple times in a row, which is the natural behavior
of random selection. This is enabled by default.

However, in some applications, you want a "random" item, but you don't want that item to be one that has been selected
in the recent *n* iterations. For that behavior, see `setAllowRepeatDistance`.

Returns the instance of WRS so that you can chain calls together, e.g.
`wrs = new WRS(foo).setItems(items).setAllowRepeatDistance(n);`

### setAllowRepeatDistance

Call this function with a positive integer equal to the number of items that must appear between repeats of an item
being selected. For example, say that you have a total of 1,000 advertisement objects you are "randomly" selecting from,
named "ad 1" through "ad 1,000". They have varying weights based on whatever you are using to weight them. However, you
don't want the same ad to appear multiple times in a row - if "ad 1" was returned once, you want at least *n* other ads
to appear before "ad 1" can be returned again. In that case, call `setAllowRepeatDistance(n)`.

NOTE: if you set the repeat distance to a number less than the number of items you have, WRS will allow repeats even
though you didn't want them. This is a safeguard for you.

Returns the instance of WRS so that you can chain calls together, e.g.
`wrs = new WRS(foo).setItems(items).setAllowRepeatDistance(n);`

### next

This is the function that actually returns to you a random item from your set of items.


## Various Weighting Examples

Of course, in the example above you may not want a straight progression where Ad 3 that is performing four times as well
Ad 1 gets used 4x as frequently. Maybe you want it to be 8x as frequently, or want some logarithmic scale. That's where
you simply adjust your weighting transformer to apply whatever weight you want to the object in question. Here are some
examples:

```js
// I want better-performing ads to be ranked much higher than lesser-performing ads:
function clickthroughWeight(ad) {
   // Results in (roughly):
   // Ad 1: 4.76%
   // Ad 2: 19.05%
   // Ad 3: 76.19%
   return Math.pow(ad.clickthroughPctg, 2);
}

// Or, I want ads to be more evenly distributed than the simple example:
function clickthroughWeight(ad) {
   // Results in (roughly):
   // Ad 1: 25.62%
   // Ad 2: 33.33%
   // Ad 3: 41.05%
   return Math.log(ad.clickthroughPctg * 100);
}
```

Obviously, you can use any calculation that you want to obtain your weighting. For instance, if you wanted to rank newer
items first (for some object that has a `createdDate` property, you could use this:

```js
function objectWeight(o) {
   var ageInMS = Date.now() - o.creationDate.getTime(),
       dividend = (365 * 24 * 60 * 60 * 1000); // approx number of millis in a year

   // Results in (roughly):
   // Something that is 1 hour old being selected 14.1 times more frequently than the oldest item
   // Something that is 1 day old being selected 9.5 times more frequently than the oldest item
   // Something that is 1 week old being selected 6.7 times more frequently than the oldest item
   // Anything 365 days or older (365 in our dividend) having a weight of 1
   return Math.max(1, Math.log2(dividend / ageInMS));
}
```

## How do I contribute?

We genuinely appreciate external contributions. See [our extensive
documentation](https://github.com/silvermine/silvermine-info#contributing) on
how to contribute.


## License

This software is released under the MIT license. See [the license file](LICENSE) for more details.
