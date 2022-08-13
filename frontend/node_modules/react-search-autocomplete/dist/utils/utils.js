"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    if (immediate && !timeout) func.apply(context, args);
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}