'use strict';

var Class = require('class.extend'),
    _ = require('underscore'),
    Stack;

Stack = Class.extend({

   init: function(maxSize) {
      this._maxSize = maxSize;
      this._arr = [];
   },

   push: function(obj) {
      this._arr.push(obj);
      if (this._arr.length > this._maxSize) {
         this._arr.shift();
      }
   },

   contains: function(obj) {
      return _.contains(this._arr, obj);
   },

   toArray: function() {
      return _.rest(this._arr, 0);
   },

});

Stack.NO_OP = {
   push: function() {
      // do nothing
   },
   contains: function() {
      return false;
   },
   toArray: function() {
      throw new Error('toArray not supported on NO_OP Stack');
   },
};

module.exports = Stack;
