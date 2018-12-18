'use strict';

var _ = require('underscore'),
    WRS = require('../src/WeightedRandomSelection'),
    util = require('util'),
    Stack = require('../src/Stack'),
    expect = require('expect.js');

describe('WeightedRandomSelection', function() {

   this.slow(1000);

   it('returns things in correct proportions', function() {
      var nums = [ 0, 1, 10, 100 ],
          ITERATIONS = 100000,
          results, sum, wrs;

      sum = _(nums).reduce(function(total, n) {
         return total + n;
      }, 0);
      wrs = new WRS(function(i) {
         return i;
      });

      results = _.reduce(nums, function(memo, n) {
         memo[n] = 0;
         return memo;
      }, {});

      wrs.setItems(nums);

      _(ITERATIONS).times(function() {
         var selected = wrs.next();

         results[selected] += 1;
      });

      _(nums).each(function(n) {
         var cnt = results[n],
             expected = (n === 0 ? 0 : n / sum),
             isOkay = Math.abs(expected - (cnt / ITERATIONS)) < 0.1;

         if (!isOkay) {
            expect().fail(util.format(
               'Expected %d to have count of %d (+/- 10%), but was %d',
               n,
               expected,
               cnt
            ));
         }
      });
   });

   it('does not return repeats if you do not want it to', function() {
      var nums = [ 1, 2, 3, 4, 5, 6, 7 ],
          DISTANCE = 4,
          ITERATIONS = 10000,
          stack = new Stack(DISTANCE),
          wrs;


      wrs = new WRS(function(i) {
         return i;
      });

      wrs.setItems(nums).setAllowRepeatDistance(DISTANCE);

      _(ITERATIONS).times(function() {
         var selected = wrs.next();

         if (stack.contains(selected)) {
            expect().fail(util.format('Should not have returned duplicate item %d (stack: %s)', selected, stack.toArray()));
         }
         stack.push(selected);
      });
   });

   it('forces the allowing of repeats if there are not enough items to achieve the desired distance', function() {
      var nums = [ 1 ],
          ITERATIONS = 1000,
          lastItem = nums[0],
          wrs;

      wrs = new WRS(function(i) {
         return i;
      });

      wrs.setItems(nums).setAllowRepeatDistance(1);

      _(ITERATIONS).times(function() {
         var selected = wrs.next();

         // Really, this part of the test is not strictly needed. If the code did not work
         // properly your CPU would simply catch on fire, indicating that the test failed.
         // Well, since we added the 10,000 iteration error in the code, this isn't
         // strictly true any more. But the CPU catching on fire thing was cool while it
         // lasted. In any event we put a test here to make it look like this is better.
         if (lastItem !== selected) {
            expect().fail(util.format('Should have returned duplicate item %d since that is the only item we have', lastItem));
         }

         lastItem = selected;
      });
   });

});
