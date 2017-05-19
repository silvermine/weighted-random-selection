'use strict';

var _ = require('underscore'),
    Class = require('class.extend'),
    Stack = require('./Stack'),
    WeightedRandomSelection, reassignRanges;

reassignRanges = function() {
   var self = this,
       totalSoFar = 0.0;

   this._ranges = _(this._items).map(function(item) {
      totalSoFar += self._transformer(item);
      return totalSoFar;
   });
};

WeightedRandomSelection = Class.extend({

   init: function(transformer, items) {
      this._transformer = transformer;
      this.setItems(items || []).setAllowRepeatsDisregardDistance();
   },

   setItems: function(items) {
      this._items = items;
      reassignRanges.call(this);
      // reset our last item storage (stack) by resetting repeats allowed state
      this.setAllowRepeatDistance(this._allowRepeatDistance);
      return this;
   },

   setAllowRepeatsDisregardDistance: function() {
      return this.setAllowRepeatDistance(true);
   },

   setAllowRepeatDistance: function(distance) {
      this._allowRepeatDistance = distance;
      this._stack = (distance === true ? Stack.NO_OP : new Stack(distance));
      return this;
   },

   next: function() {
      var allowRepeats = (this._allowRepeatDistance === true) || (this._allowRepeatDistance >= this._items.length),
          iterationCount = 1,
          rand, ind;

      /* eslint-disable no-restricted-syntax, no-unmodified-loop-condition */
      do {
         rand = (Math.random() * this._ranges[this._ranges.length - 1]);
         ind = _.sortedIndex(this._ranges, rand);
         iterationCount += 1;
         // istanbul ignore if
         if (iterationCount > 10000) {
            throw new Error('Should not ever iterate more than 10,000 times trying to get next item.');
         }
      } while (!allowRepeats && this._stack.contains(ind));

      /* eslint-enable no-restricted-syntax, no-unmodified-loop-condition */

      this._stack.push(ind);
      return this._items[ind];
   },

});

module.exports = WeightedRandomSelection;
