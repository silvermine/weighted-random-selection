'use strict';

var Stack = require('../src/Stack'),
    expect = require('expect.js');

describe('Stack', function() {

   it('properly shifts items off the stack, keeping the max items at the supplied level', function() {
      var stack = new Stack(5);

      expect(stack.toArray()).to.eql([]);

      stack.push(1);
      expect(stack.toArray()).to.eql([ 1 ]);

      stack.push(2);
      expect(stack.toArray()).to.eql([ 1, 2 ]);

      stack.push(3);
      expect(stack.toArray()).to.eql([ 1, 2, 3 ]);

      stack.push(4);
      expect(stack.toArray()).to.eql([ 1, 2, 3, 4 ]);

      stack.push(5);
      expect(stack.toArray()).to.eql([ 1, 2, 3, 4, 5 ]);

      stack.push(6);
      expect(stack.toArray()).to.eql([ 2, 3, 4, 5, 6 ]);
   });

   describe('contains', function() {
      var stack = new Stack(3);

      it('returns true if the item is in the stack, false otherwise', function() {
         expect(stack.contains(1)).to.be(false);
         expect(stack.contains(2)).to.be(false);
         expect(stack.contains(3)).to.be(false);
         expect(stack.contains(4)).to.be(false);

         stack.push(1);

         expect(stack.contains(1)).to.be(true);
         expect(stack.contains(2)).to.be(false);
         expect(stack.contains(3)).to.be(false);
         expect(stack.contains(4)).to.be(false);

         stack.push(2);

         expect(stack.contains(1)).to.be(true);
         expect(stack.contains(2)).to.be(true);
         expect(stack.contains(3)).to.be(false);
         expect(stack.contains(4)).to.be(false);

         stack.push(3);

         expect(stack.contains(1)).to.be(true);
         expect(stack.contains(2)).to.be(true);
         expect(stack.contains(3)).to.be(true);
         expect(stack.contains(4)).to.be(false);

         stack.push(4);

         expect(stack.contains(1)).to.be(false);
         expect(stack.contains(2)).to.be(true);
         expect(stack.contains(3)).to.be(true);
         expect(stack.contains(4)).to.be(true);
      });
   });

   describe('Stack.NO_OP', function() {
      var stack = Stack.NO_OP;

      describe('toArray', function() {

         it('throws an error', function() {
            expect(stack.toArray).to.throwError();
         });
      });

      describe('contains, push', function() {

         it('contains always returns false, push appears to do nothing', function() {
            expect(stack.contains(1)).to.be(false);
            stack.push(1);
            expect(stack.contains(1)).to.be(false);
         });

      });

   });

});
